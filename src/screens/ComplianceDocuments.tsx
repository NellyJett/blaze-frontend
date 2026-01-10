import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FileText, Upload, Check, X, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { addComplianceDocument, removeComplianceDocument, setComplianceDocuments } from '@/store/slices/onboardingSlice';
import { useUploadDocument } from '@/hooks/useUploadDocument';
import { useDocuments } from '@/hooks/useDocuments';
import type { ComplianceDocument } from '@/types/onboarding';
import type { RootState } from '@/store';

import Logo  from '@/components/icons/logo';

interface DocumentConfig {
  type: ComplianceDocument['type'];
  name: string;
  description: string;
  required: boolean;
}

const REQUIRED_DOCUMENTS: DocumentConfig[] = [
  {
    type: 'certificate_of_incorporation',
    name: 'Certificate of Incorporation',
    description: 'Official registration document (JPG, PNG, PDF)',
    required: true,
  },
  {
    type: 'license_certificate',
    name: 'License Certificate',
    description: 'Operating license from regulatory body',
    required: true,
  },
  {
    type: 'aml_kyc_policy',
    name: 'AML / KYC Policy',
    description: 'Your anti-money laundering and KYC policies',
    required: true,
  },
  {
    type: 'authorized_signatory_letter',
    name: 'Authorized Signatory Letter',
    description: 'Letter authorizing account representatives',
    required: true,
  },
];

const REVERSE_DOC_TYPE_MAP: Record<string, ComplianceDocument['type']> = {
  CERTIFICATE_OF_INCORPORATION: 'certificate_of_incorporation',
  LICENSE: 'license_certificate',
  AML_POLICY: 'aml_kyc_policy',
  OTHER: 'authorized_signatory_letter',
  KYC_POLICY: 'aml_kyc_policy', // Fallback
  DATA_PROTECTION_POLICY: 'data_protection_policy',
};

export const ComplianceDocuments = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { complianceDocuments } = useSelector((state: RootState) => state.onboarding);
  
  const [uploadingType, setUploadingType] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const { upload, isLoading: isUploading, uploadProgress: singleProgress } = useUploadDocument();
  const { documents: backendDocuments, fetchDocuments, deleteDocument } = useDocuments();

  useEffect(() => {
    if (backendDocuments && backendDocuments.length > 0) {
      // Map backend Document to ComplianceDocument type
      const mappedDocs: ComplianceDocument[] = backendDocuments
        .map((doc): ComplianceDocument | null => {
          const frontendType = REVERSE_DOC_TYPE_MAP[doc.type];
          if (!frontendType) return null;
          
          return {
            id: doc.id,
            name: REQUIRED_DOCUMENTS.find(d => d.type === frontendType)?.name || doc.fileName,
            type: frontendType,
            fileName: doc.fileName,
            fileSize: doc.fileSize,
            uploadedAt: doc.uploadedAt,
            status: 'uploaded'
          };
        })
        .filter((doc): doc is ComplianceDocument => doc !== null);
      
      if (mappedDocs.length > 0) {
        dispatch(setComplianceDocuments(mappedDocs));
      }
    }
  }, [backendDocuments, dispatch]);

  const getDocumentForType = (type: ComplianceDocument['type']) => {
    return complianceDocuments.find(doc => doc.type === type);
  };

  const handleFileSelect = async (type: ComplianceDocument['type'], file: File) => {
    setUploadingType(type);

    const result = await upload(file, type);

    if (result.success && result.document) {
      const newDocument: ComplianceDocument = {
        id: result.document.id,
        name: REQUIRED_DOCUMENTS.find(d => d.type === type)?.name || '',
        type,
        fileName: result.document.fileName,
        fileSize: result.document.fileSize,
        uploadedAt: result.document.uploadedAt,
        status: 'uploaded',
      };

      dispatch(addComplianceDocument(newDocument));
      await fetchDocuments();
    }

    setUploadingType(null);
  };

  const handleRemoveDocument = async (id: string) => {
    const result = await deleteDocument(id);
    if (result.success) {
      dispatch(removeComplianceDocument(id));
    }
  };

  const allRequiredUploaded = REQUIRED_DOCUMENTS.filter(d => d.required).every(
    doc => getDocumentForType(doc.type)
  );

  const uploadedCount = complianceDocuments.length;
  const totalRequired = REQUIRED_DOCUMENTS.filter(d => d.required).length;
  const overallProgress = (uploadedCount / totalRequired) * 100;

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Steps for the progress bar
  const onboardingSteps = [
    { number: 1, title: 'Organization Type', completed: true },
    { number: 2, title: 'Create Account', completed: true },
    { number: 3, title: 'Verify OTP', completed: true },
    { number: 4, title: 'Organization Details', completed: true },
    { number: 5, title: 'Compliance Documents', completed: false, active: true },
    { number: 6, title: 'Team Setup', completed: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-indigo-50/10" />
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-10 w-64 h-64 bg-blue-100/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-10 w-64 h-64 bg-indigo-100/20 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-sm">
        <div className="flex items-center gap-2">
          <Logo />
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            BlazeTech
          </span>
        </div>

        <button
          onClick={() => navigate('/organization-details')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
          aria-label="Back to Organization Details"
        >
          <ArrowLeft className="h-4 w-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
          <span className="text-gray-700 group-hover:text-blue-700 text-sm font-medium transition-colors">
            Back
          </span>
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12 pt-24">
        {/* Progress Steps */}
        <div className="w-full max-w-6xl mb-10">
          <div className="flex items-center justify-center mb-8">
            <div className="pt-6 w-full max-w-5xl">
              <div className="flex items-center justify-between">
                {onboardingSteps.map((step, index) => (
                  <div key={step.number} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${step.active ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-500/30' : step.completed ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-white text-gray-400'} font-medium transition-all duration-300`}>
                        {step.completed ? <CheckCircle2 className="h-5 w-5" /> : step.number}
                      </div>
                      <span className={`text-xs font-medium mt-2 ${step.active ? 'text-blue-700 font-semibold' : step.completed ? 'text-blue-700' : 'text-gray-500'} transition-colors`}>
                        {step.title}
                      </span>
                    </div>
                    {index < onboardingSteps.length - 1 && (
                      <div className="w-16 mx-4">
                        <div className={`h-0.5 ${step.completed ? 'bg-blue-600' : 'bg-gray-300'} transition-colors`} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="w-full max-w-4xl">
          <Card className="border border-gray-200 rounded-2xl shadow-xl overflow-visible bg-white">
            {/* Card Header with White Background */}
            <div className="bg-white border-b border-gray-200">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mb-4 border border-blue-200">
                  <FileText className="w-10 h-10 text-blue-600" />
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                  Compliance Documents
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  Upload required documents to complete verification
                </CardDescription>
                
                {/* Overall Progress */}
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Upload Progress</span>
                    <span className="font-bold text-blue-700">{uploadedCount} / {totalRequired}</span>
                  </div>
                  <div className="space-y-1">
                    <Progress value={overallProgress} className="h-2 bg-gray-200" />
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">{Math.round(overallProgress)}% Complete</span>
                      <span className="text-gray-500">{totalRequired - uploadedCount} remaining</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </div>

            <CardContent className="p-8 bg-white">
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-1 bg-blue-500 rounded-r-full" />
                  <h3 className="text-lg font-semibold text-gray-900">Required Documents</h3>
                </div>

                {REQUIRED_DOCUMENTS.map((docConfig) => {
                  const uploadedDoc = getDocumentForType(docConfig.type);
                  const isUploadingDoc = uploadingType === docConfig.type && isUploading;
                  const progress = isUploadingDoc ? singleProgress : 0;

                  return (
                    <div
                      key={docConfig.type}
                      className={`border rounded-xl p-5 transition-all duration-200 ${
                        uploadedDoc 
                          ? 'border-green-500 bg-green-50/50' 
                          : isUploadingDoc
                          ? 'border-blue-300 bg-blue-50/30'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{docConfig.name}</h4>
                            {docConfig.required && (
                              <span className="text-xs px-2 py-0.5 bg-red-50 text-red-700 rounded-full border border-red-200">
                                Required
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {docConfig.description}
                          </p>

                          {uploadedDoc && (
                            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50/70 rounded-lg px-3 py-2 border border-green-200">
                              <Check className="w-4 h-4" />
                              <span className="font-medium">{uploadedDoc.fileName}</span>
                              <span className="text-gray-500 text-xs">
                                ({formatFileSize(uploadedDoc.fileSize)})
                              </span>
                            </div>
                          )}

                          {isUploadingDoc && (
                            <div className="mt-3 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-blue-700">Uploading...</span>
                                <span className="text-xs font-bold text-blue-700">{progress}%</span>
                              </div>
                              <Progress value={progress} className="h-1.5 bg-gray-200" />
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {uploadedDoc ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveDocument(uploadedDoc.id)}
                              className="h-9 px-3 border-red-200 bg-white hover:border-red-400 hover:bg-red-50 text-red-600 hover:text-red-700 shadow-sm"
                            >
                              <X className="w-4 h-4" />
                              <span className="ml-1">Remove</span>
                            </Button>
                          ) : (
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={isUploadingDoc}
                                onClick={() => fileInputRefs.current[docConfig.type]?.click()}
                                className="h-9 px-3 border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50 text-blue-600 hover:text-blue-700 shadow-sm"
                              >
                              {isUploadingDoc ? (
                                <>
                                  <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2" />
                                  Uploading
                                </>
                              ) : (
                                <>
                                  <Upload className="w-4 h-4 mr-1.5" />
                                  Upload
                                </>
                              )}
                            </Button>
                          )}
                          <input
                            ref={(el) => { fileInputRefs.current[docConfig.type] = el }}
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileSelect(docConfig.type, file);
                              e.target.value = '';
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

                {!allRequiredUploaded && (
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">
                        Complete all required uploads to continue
                      </p>
                      <p className="text-xs text-amber-700 mt-0.5">
                        {totalRequired - uploadedCount} document(s) remaining
                      </p>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/organization-details')}
                    className="flex-1 h-12 rounded-lg border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-700 bg-white"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={() => navigate('/team-setup')}
                    disabled={!allRequiredUploaded}
                    className={`flex-1 h-12 rounded-lg ${
                      allRequiredUploaded 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-600/30'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    } transition-all duration-300`}
                  >
                    Continue to Team Setup
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info Note */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              All documents are encrypted and stored securely. {' '}
              <button className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2">
                Learn about our security
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};