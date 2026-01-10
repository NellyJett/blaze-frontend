import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Zap, BarChart3, Lock, ArrowLeft } from 'lucide-react';

export function Welcome() {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/select-organization');
  };

  const handleGoToMainWebsite = () => {
    // Replace with your actual main website URL
    window.open('https://blazetech.com', '_blank');
  };

  return (
    <div className="h-screen bg-slate-50 relative overflow-hidden"> {/* Changed bg-black to bg-slate-50 */}
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: "url('/images/blaze1.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.06,
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm" />
        
        {/* Optional: Add a gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-white/40 to-blue-400/5" />
      </div>

      {/* Background Effects with pulse animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Top Navigation Bar */}
      <div className="relative z-20 w-full px-6 py-4 flex items-center justify-between">
        {/* Logo on the left */}
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center ">
            <img 
              src="/images/blazelogo.png" 
              alt="BlazeTech Logo"
              className="h-7 w-7 object-cover" 
            />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">BlazeTech</span>
        </div>

        {/* "Back to Website" with left arrow - NO BORDER */}
        <button
          onClick={handleGoToMainWebsite}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-transparent hover:bg-gray-100 transition-all hover:scale-105 group"
          aria-label="Back to main website"
        >
          <ArrowLeft className="h-4 w-4 text-gray-600 group-hover:text-blue-600 group-hover:-translate-x-0.5 transition-all" />
          <span className="text-gray-700 group-hover:text-blue-700 text-sm font-medium transition-colors">
            Back to Website
          </span>
        </button>
      </div>

      {/* Main Content Container - Removed min-h-screen and adjusted spacing */}
      <div className="relative z-10 h-screen flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-6xl">
          {/* Hero Content */}
          <div className="text-center max-w-md mx-auto mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">BlazeTech</span>
            </h1>
            <p className="text-sm md:text-base text-gray-600 mb-6 leading-relaxed">
              Your Unified Hub for Financial Data Intelligence, Compliance Automation, and Fraud Detection.
            </p>

            <Button 
              size="lg" 
              onClick={handleNext}
              className="px-6 py-4 text-base font-semibold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-600/30 hover:scale-105 transition-transform bg-blue-600 text-white hover:bg-blue-700"
            >
              Get Started
            </Button>
          </div>

          {/* Feature Cards - Adjusted spacing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-6">
            <FeatureCard 
              icon={Shield}
              title="Compliance Automation"
              description="Automated KYC/AML checks with real-time rule engine"
            />
            <FeatureCard 
              icon={BarChart3}
              title="Data Insights"
              description="Powerful analytics and customer intelligence"
            />
            <FeatureCard 
              icon={Lock}
              title="Fraud Monitoring"
              description="Behavioral fraud detection and alert management"
            />
          </div>

          {/* Bottom Text - Moved up */}
          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <button 
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:text-blue-500 font-medium hover:underline transition-colors"
            >
               Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="backdrop-blur-sm border border-gray-200 rounded-xl p-5 text-center hover:border-blue-500 transition-colors bg-white/60 hover:bg-white shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 mx-auto mb-3">
        <Icon className="h-5 w-5 text-blue-600" />
      </div>
      <h3 className="font-semibold text-gray-900 mb-2 text-sm">{title}</h3>
      <p className="text-xs text-gray-600">{description}</p>
    </div>
  );
}
