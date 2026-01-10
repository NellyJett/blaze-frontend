import { useState, useEffect } from 'react';
import { userApi, Document } from '@/services/api';
import { toast } from '@/hooks/use-toast';

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await userApi.getDocuments();
      setDocuments(response.documents);
      return { success: true, documents: response.documents };
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch documents';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDocument = async (documentId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await userApi.deleteDocument(documentId);
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      toast({
        title: 'Document Deleted',
        description: 'Document has been deleted successfully.',
      });
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to delete document';
      setError(errorMessage);
      toast({
        title: 'Delete Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return { documents, isLoading, error, fetchDocuments, deleteDocument };
}

