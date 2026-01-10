import { useState } from 'react';
import { userApi, Document } from '@/services/api';
import { toast } from '@/hooks/use-toast';

export function useUploadDocument() {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File, documentType: string) => {
    setIsLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        throw new Error('Invalid file type. Only JPG, PNG, and PDF files are allowed.');
      }

      // Validate file size (10MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('File too large. Maximum size is 10MB.');
      }

      const response = await userApi.uploadDocument({ file, documentType });
      
      toast({
        title: 'Document Uploaded',
        description: 'Your document has been uploaded successfully.',
      });
      
      setUploadProgress(100);
      return { success: true, document: response.document };
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Document upload failed';
      setError(errorMessage);
      toast({
        title: 'Upload Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  return { upload, isLoading, uploadProgress, error };
}

