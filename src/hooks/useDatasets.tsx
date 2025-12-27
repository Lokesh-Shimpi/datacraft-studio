import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import type { Column } from '@/types/dataset';
import type { Json } from '@/integrations/supabase/types';

export interface SavedDataset {
  id: string;
  name: string;
  description: string | null;
  columns: Column[];
  data: Record<string, unknown>[];
  row_count: number;
  template_name: string | null;
  created_at: string;
  updated_at: string;
}

export const useDatasets = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [datasets, setDatasets] = useState<SavedDataset[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDatasets = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('generated_datasets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion for JSONB columns
      const typedData = (data || []).map(item => ({
        ...item,
        columns: item.columns as unknown as Column[],
        data: item.data as unknown as Record<string, unknown>[],
      }));
      
      setDatasets(typedData);
    } catch (error) {
      console.error('Error fetching datasets:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your datasets.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveDataset = async (
    name: string,
    columns: Column[],
    data: Record<string, unknown>[],
    templateName?: string,
    description?: string
  ) => {
    if (!user) {
      toast({
        title: 'Not logged in',
        description: 'Please sign in to save datasets.',
        variant: 'destructive',
      });
      return null;
    }

    try {
      const { data: savedData, error } = await supabase
        .from('generated_datasets')
        .insert({
          user_id: user.id,
          name,
          description: description || null,
          columns: columns as unknown as Json,
          data: data as unknown as Json,
          row_count: data.length,
          template_name: templateName || null,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Dataset saved',
        description: `"${name}" has been saved successfully.`,
      });

      // Refresh the list
      await fetchDatasets();
      
      return savedData;
    } catch (error) {
      console.error('Error saving dataset:', error);
      toast({
        title: 'Error',
        description: 'Failed to save the dataset.',
        variant: 'destructive',
      });
      return null;
    }
  };

  const deleteDataset = async (id: string) => {
    try {
      const { error } = await supabase
        .from('generated_datasets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Dataset deleted',
        description: 'The dataset has been deleted.',
      });

      // Refresh the list
      await fetchDatasets();
    } catch (error) {
      console.error('Error deleting dataset:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete the dataset.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchDatasets();
    } else {
      setDatasets([]);
    }
  }, [user]);

  return {
    datasets,
    loading,
    saveDataset,
    deleteDataset,
    refetch: fetchDatasets,
  };
};
