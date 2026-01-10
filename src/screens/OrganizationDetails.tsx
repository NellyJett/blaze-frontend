import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Building2, Globe, MapPin, Users, Calendar, FileText, ArrowRight, ArrowLeft, CheckCircle2, Zap, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { setOrganizationDetails } from '@/store/slices/onboardingSlice';
import { useOrganization } from '@/hooks/useOrganization';
import { CUSTOMER_SIZE_OPTIONS, COUNTRY_OPTIONS, type OrganizationDetails as OrgDetails } from '@/types/onboarding';
import Logo from '@/components/icons/logo';

export const OrganizationDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { saveOrganizationDetails, isLoading } = useOrganization();
  
  const [formData, setFormData] = useState<OrgDetails>({
    registeredBusinessName: '',
    countriesOfOperation: [],
    headquarterAddress: '',
    estimatedCustomerSize: '',
    websiteUrl: '',
    rcLicenseNumber: '',
    taxIdentificationNumber: '',
    yearIncorporated: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof OrgDetails, string>>>({});

  const handleInputChange = (field: keyof OrgDetails, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCountryChange = (country: string) => {
    setFormData(prev => ({
      ...prev,
      countriesOfOperation: prev.countriesOfOperation.includes(country)
        ? prev.countriesOfOperation.filter(c => c !== country)
        : [...prev.countriesOfOperation, country],
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof OrgDetails, string>> = {};

    if (!formData.registeredBusinessName.trim()) {
      newErrors.registeredBusinessName = 'Required';
    }
    if (formData.countriesOfOperation.length === 0) {
      newErrors.countriesOfOperation = 'Select at least one country';
    }
    if (!formData.headquarterAddress.trim()) {
      newErrors.headquarterAddress = 'Required';
    }
    if (!formData.estimatedCustomerSize) {
      newErrors.estimatedCustomerSize = 'Required';
    }
    if (!formData.rcLicenseNumber.trim()) {
      newErrors.rcLicenseNumber = 'Required';
    }
    if (!formData.taxIdentificationNumber.trim()) {
      newErrors.taxIdentificationNumber = 'Required';
    }
    if (!formData.yearIncorporated.trim()) {
      newErrors.yearIncorporated = 'Required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const result = await saveOrganizationDetails(formData);
      if (result.success) {
        dispatch(setOrganizationDetails(formData));
        navigate('/compliance-documents');
      }
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  // Steps for the progress bar
  const onboardingSteps = [
    { number: 1, title: 'Organization Type', completed: true },
    { number: 2, title: 'Create Account', completed: true },
    { number: 3, title: 'Verify OTP', completed: true },
    { number: 4, title: 'Organization Details', completed: false, active: true },
    { number: 5, title: 'Compliance Documents', completed: false },
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
        <div className="flex items-center gap-1">
          <Logo />
          <span className="text-xl font-bold text-[#3F6F5E]">BlazeTech</span>
        </div>

        <button
          onClick={() => navigate('/verify-otp')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
          aria-label="Back to OTP verification"
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

        {/* Main Form Card - Pure white background */}
        <div className="w-full max-w-4xl">
          <Card className="border border-gray-200 rounded-2xl shadow-xl overflow-visible bg-white">
            {/* Card Header with White Background */}
            <div className="bg-white border-b border-gray-200">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mb-4 border border-blue-200">
                  <Building2 className="w-10 h-10 text-blue-600" />
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                  Organization Details
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  Complete your organization profile to proceed with setup
                </CardDescription>
              </CardHeader>
            </div>

            <CardContent className="p-8 bg-white">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Business Names Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-8 w-1 bg-blue-500 rounded-r-full" />
                    <h3 className="text-lg font-semibold text-gray-900">Business Information</h3>
                  </div>
                  
                  {/* Registered Business Name - Full Width */}
                  <div className="space-y-3">
                    <Label htmlFor="registeredBusinessName" className="text-gray-700 font-medium">
                      Registered Business Name *
                    </Label>
                    <Input
                      id="registeredBusinessName"
                      value={formData.registeredBusinessName}
                      onChange={(e) => handleInputChange('registeredBusinessName', e.target.value)}
                      placeholder="e.g., Tech Solutions Inc."
                      className={`h-12 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 bg-white text-gray-900 placeholder:text-gray-500 ${errors.registeredBusinessName ? 'border-red-500' : ''}`}
                    />
                    {errors.registeredBusinessName && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <span className="text-xs">⚠</span> {errors.registeredBusinessName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Geographic Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-8 w-1 bg-blue-500 rounded-r-full" />
                    <h3 className="text-lg font-semibold text-gray-900">Geographic Information</h3>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-gray-700 font-medium flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Countries of Operation *
                    </Label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      {COUNTRY_OPTIONS.map((country) => (
                        <button
                          key={country}
                          type="button"
                          onClick={() => handleCountryChange(country)}
                          className={`px-3 py-2 text-sm rounded-lg border transition-all duration-200 flex items-center justify-center gap-2 ${
                            formData.countriesOfOperation.includes(country)
                              ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-sm'
                              : 'bg-white text-gray-900 border-gray-300 hover:border-blue-300 hover:bg-blue-50 hover:text-gray-900'
                          }`}
                        >
                          {formData.countriesOfOperation.includes(country) && (
                            <CheckCircle2 className="w-3 h-3 text-blue-600" />
                          )}
                          <span className={`${formData.countriesOfOperation.includes(country) ? 'font-medium' : ''}`}>
                            {country}
                          </span>
                        </button>
                      ))}
                    </div>
                    {errors.countriesOfOperation && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <span className="text-xs">⚠</span> {errors.countriesOfOperation}
                      </p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="headquarterAddress" className="text-gray-700 font-medium flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Headquarter Address *
                      </Label>
                      <Input
                        id="headquarterAddress"
                        value={formData.headquarterAddress}
                        onChange={(e) => handleInputChange('headquarterAddress', e.target.value)}
                        placeholder="123 Business Ave, City, Country"
                        className={`h-12 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 bg-white text-gray-900 placeholder:text-gray-500 ${errors.headquarterAddress ? 'border-red-500' : ''}`}
                      />
                      {errors.headquarterAddress && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <span className="text-xs">⚠</span> {errors.headquarterAddress}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label className="text-gray-700 font-medium flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Estimated Customer Size *
                      </Label>
                      <div className="relative">
                        <Select
                          value={formData.estimatedCustomerSize}
                          onValueChange={(value) => handleInputChange('estimatedCustomerSize', value)}
                        >
                          <SelectTrigger className={`h-12 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 bg-white text-gray-900 ${errors.estimatedCustomerSize ? 'border-red-500' : ''} ${formData.estimatedCustomerSize ? 'text-gray-900' : 'text-gray-500'}`}>
                            <SelectValue placeholder="Select customer size range">
                              {formData.estimatedCustomerSize ? (
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4 text-blue-600" />
                                  <span className="text-gray-900">{formData.estimatedCustomerSize}</span>
                                </div>
                              ) : (
                                <span className="text-gray-500">Select customer size range</span>
                              )}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="bg-white border border-gray-300 shadow-lg z-50">
                            {CUSTOMER_SIZE_OPTIONS.map((size) => (
                              <SelectItem 
                                key={size} 
                                value={size} 
                                className="flex items-center py-3 px-4 text-gray-900 hover:bg-blue-50 cursor-pointer"
                              >
                                <Users className="w-3 h-3 mr-2 text-gray-500 flex-shrink-0" />
                                <span className="text-gray-900">{size}</span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {errors.estimatedCustomerSize && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <span className="text-xs">⚠</span> {errors.estimatedCustomerSize}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-8 w-1 bg-blue-500 rounded-r-full" />
                    <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="websiteUrl" className="text-gray-700 font-medium">
                      Website URL (Optional)
                    </Label>
                    <div className="relative">
                      <Input
                        id="websiteUrl"
                        type="url"
                        value={formData.websiteUrl}
                        onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                        placeholder="https://example.com"
                        className="h-12 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 bg-white text-gray-900 placeholder:text-gray-500 pl-10"
                      />
                      <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="rcLicenseNumber" className="text-gray-700 font-medium flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        RC / License Number *
                      </Label>
                      <Input
                        id="rcLicenseNumber"
                        value={formData.rcLicenseNumber}
                        onChange={(e) => handleInputChange('rcLicenseNumber', e.target.value)}
                        placeholder="RC123456"
                        className={`h-12 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 bg-white text-gray-900 placeholder:text-gray-500 ${errors.rcLicenseNumber ? 'border-red-500' : ''}`}
                      />
                      {errors.rcLicenseNumber && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <span className="text-xs">⚠</span> {errors.rcLicenseNumber}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="taxIdentificationNumber" className="text-gray-700 font-medium">
                        Tax ID Number *
                      </Label>
                      <Input
                        id="taxIdentificationNumber"
                        value={formData.taxIdentificationNumber}
                        onChange={(e) => handleInputChange('taxIdentificationNumber', e.target.value)}
                        placeholder="TIN12345678"
                        className={`h-12 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 bg-white text-gray-900 placeholder:text-gray-500 ${errors.taxIdentificationNumber ? 'border-red-500' : ''}`}
                      />
                      {errors.taxIdentificationNumber && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <span className="text-xs">⚠</span> {errors.taxIdentificationNumber}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label className="text-gray-700 font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Year Incorporated *
                      </Label>
                      <div className="relative">
                        <Select
                          value={formData.yearIncorporated}
                          onValueChange={(value) => handleInputChange('yearIncorporated', value)}
                        >
                          <SelectTrigger className={`h-12 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 bg-white ${errors.yearIncorporated ? 'border-red-500' : ''} ${formData.yearIncorporated ? 'text-gray-900' : 'text-gray-500'}`}>
                            <SelectValue placeholder="Select year">
                              {formData.yearIncorporated ? (
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-blue-600" />
                                  <span className="text-gray-900">{formData.yearIncorporated}</span>
                                </div>
                              ) : (
                                <span className="text-gray-500">Select year</span>
                              )}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="bg-white border border-gray-300 shadow-lg z-50 max-h-60">
                            {years.map((year) => (
                              <SelectItem 
                                key={year} 
                                value={year.toString()} 
                                className="flex items-center py-3 px-4 text-gray-900 hover:bg-blue-50 cursor-pointer"
                              >
                                <Calendar className="w-3 h-3 mr-2 text-gray-500 flex-shrink-0" />
                                <span className="text-gray-900">{year}</span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {errors.yearIncorporated && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <span className="text-xs">⚠</span> {errors.yearIncorporated}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/verify-otp')}
                    className="flex-1 h-12 rounded-lg border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-700 bg-white"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="flex-1 h-12 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-600/30 transition-all duration-300"
                  >
                    {isLoading ? 'Saving...' : 'Continue'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Info Note */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              All information provided is secured with 256-bit encryption. {' '}
              <button className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2">
                Learn more
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};