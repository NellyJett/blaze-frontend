import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ingestApi } from '@/services/api';
import { toast } from 'sonner';
import { Customer } from '@/types';

interface DataImporterProps {
  onSuccess?: () => void;
}

interface IngestionResult {
  imported: number;
  skipped: number;
  failed: number;
  errors: Array<{ row: number; reason: string }>;
}

export function DataImporter({ onSuccess }: DataImporterProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<IngestionResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResults(null);
    }
  };

  const processFile = async () => {
    if (!file) return;
    setIsProcessing(true);
    setResults(null);
    
    try {
      let rawData: Partial<Customer>[] = [];

      if (file.name.endsWith('.csv')) {
        const text = await file.text();
        const result = Papa.parse(text, { header: true, skipEmptyLines: true });
        rawData = result.data as Partial<Customer>[];
      } else {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        rawData = XLSX.utils.sheet_to_json(sheet) as Partial<Customer>[];
      }

      if (rawData.length === 0) {
        throw new Error('No data found in file');
      }

      // Send raw data to backend - normalization and validation happens there
      const response = await ingestApi.ingestCustomers(rawData, 'CSV_IMPORT');
      
      const { summary, errors } = response;
      
      setResults({
        imported: summary.imported,
        skipped: summary.skipped,
        failed: summary.failed,
        errors: errors,
      });

      if (summary.imported > 0) {
        toast.success(`Successfully imported ${summary.imported} customers`);
        if (onSuccess) {
          // Trigger refetch of customer list from DB only
          onSuccess();
        }
      } else if (summary.failed > 0) {
        toast.error(`Import failed for ${summary.failed} rows`);
      } else {
        toast.info('No new customers were imported');
      }

    } catch (error: unknown) {
      console.error('Import failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to process file';
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-600" />
            Bulk Customer Import
          </CardTitle>
          <CardDescription>
            Upload a CSV or Excel file to import customer data. Database is the only source of truth.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            className="border-2 border-dashed border-gray-200 rounded-lg p-10 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".csv,.xlsx,.xls" 
              onChange={handleFileChange}
            />
            {file ? (
              <div className="flex items-center gap-3">
                <FileText className="h-10 w-10 text-blue-500" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <Upload className="h-10 w-10 text-gray-400 mb-4" />
                <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500 mt-1">CSV or Excel (xlsx, xls)</p>
              </>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => { setFile(null); setResults(null); }}
              disabled={!file || isProcessing}
            >
              Clear
            </Button>
            <Button 
              onClick={processFile} 
              disabled={!file || isProcessing}
              className="min-w-[120px]"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Start Import'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <Card className="border-blue-100 bg-blue-50/30 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
              Import Processing Complete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg border border-emerald-100 shadow-sm">
                <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">Imported</p>
                <p className="text-3xl font-bold text-emerald-700">{results.imported}</p>
                <p className="text-[10px] text-emerald-500 mt-1">Persisted to DB</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-amber-100 shadow-sm">
                <p className="text-xs text-amber-600 font-semibold uppercase tracking-wider">Skipped</p>
                <p className="text-3xl font-bold text-amber-700">{results.skipped}</p>
                <p className="text-[10px] text-amber-500 mt-1">Already exists</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-red-100 shadow-sm">
                <p className="text-xs text-red-600 font-semibold uppercase tracking-wider">Failed</p>
                <p className="text-3xl font-bold text-red-700">{results.failed}</p>
                <p className="text-[10px] text-red-500 mt-1">Validation errors</p>
              </div>
            </div>

            {results.errors.length > 0 && (
              <div className="rounded-xl border border-red-200 bg-white shadow-sm overflow-hidden">
                <div className="bg-red-50 px-4 py-3 border-b border-red-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-bold text-red-900">Error Report</span>
                  </div>
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                    {results.errors.length} issues
                  </span>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Row</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Reason</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {results.errors.map((err, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-3 whitespace-nowrap text-gray-600 font-medium">{err.row}</td>
                          <td className="px-6 py-3 text-red-600">{err.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            <p className="text-center text-xs text-gray-500 mt-6 italic">
              Dashboard list automatically refreshed from database
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
