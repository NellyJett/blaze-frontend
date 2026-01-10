import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setOrganizationType, OrganizationType } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import Logo  from '@/components/icons/logo';
import { 
  Building2, 
  Wallet, 
  Globe,
  TrendingUp,
  FileText,
  Shield, 
  Landmark,
  CreditCard,
  ArrowLeft,
  Zap
} from 'lucide-react';

const organizationTypes: { type: OrganizationType; label: string; icon: React.ElementType; description: string }[] = [
  { type: 'fintech_lending', label: 'Fintech Company', icon: Building2, description: 'Digital lending and credit platforms' },
  { type: 'microfinance_bank', label: 'Microfinance Bank', icon: Wallet, description: 'Micro-lending and community banking' },
  { type: 'digital_lender', label: 'Digital / Online Lender', icon: Globe, description: 'Online-first lending services' },
  { type: 'investment_trading', label: 'Investment / Trading App', icon: TrendingUp, description: 'Investment and trading platforms' },
  { type: 'credit_bureau', label: 'Credit Bureau', icon: FileText, description: 'Credit reporting and scoring agencies' },
  { type: 'insurance', label: 'Insurance', icon: Shield, description: 'Insurance companies and underwriters' },
  { type: 'pfi', label: 'PFI', icon: Landmark, description: 'Participating Financial Institution' },
  { type: 'bnpl_provider', label: 'BNPL Provider', icon: CreditCard, description: 'Buy Now Pay Later services' },
];

export function SelectOrganization() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSelect = (type: OrganizationType) => {
    dispatch(setOrganizationType(type));
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Light gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      {/* Subtle background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl opacity-30" />
      </div>

      {/* Top Navigation Bar - Light theme */}
      <div className="relative z-20 w-full px-6 py-4 flex items-center justify-between bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center gap-2">
          < Logo />
          <span className="text-xl font-bold text-gray-900">BlazeTech</span>
        </div>

        <button
          onClick={() => navigate('/welcome')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:border-primary hover:bg-primary/5 transition-all hover:scale-105 group"
          aria-label="Back to welcome"
        >
          <ArrowLeft className="h-4 w-4 text-gray-600 group-hover:text-primary group-hover:-translate-x-0.5 transition-all" />
          <span className="text-gray-700 group-hover:text-primary text-sm font-medium transition-colors">
            Back
          </span>
        </button>
      </div>

      {/* Main Content - Light theme */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Select Your Organization Type
          </h1>
          <p className="text-gray-600">
            Choose the industry that best describes your organization to customize your experience.
          </p>
        </div>

        {/* Cards - Light theme */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto w-full px-4">
          {organizationTypes.map(({ type, label, icon: Icon, description }) => (
            <button
              key={type}
              onClick={() => handleSelect(type)}
              className="bg-white border border-gray-200 rounded-xl p-6 text-left hover:border-primary hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-300 group hover:-translate-y-1 active:scale-[0.98]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <Icon className="h-6 w-6 text-primary group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm group-hover:text-primary transition-colors duration-300">{label}</h3>
              <p className="text-xs text-gray-600 line-clamp-2">{description}</p>
            </button>
          ))}
        </div>

        <p className="mt-10 text-sm text-gray-600">
          Already have an account?{' '}
          <button 
            onClick={() => navigate('/login')}
            className="text-primary hover:underline font-medium"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}