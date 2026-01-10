import { Check } from 'lucide-react';
import { ONBOARDING_STEPS } from '@/types/onboarding';

interface OnboardingProgressProps {
  currentStep: number;
}

export const OnboardingProgress = ({ currentStep }: OnboardingProgressProps) => {
  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Desktop view */}
      <div className="hidden md:flex items-center justify-between">
        {ONBOARDING_STEPS.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    isCompleted
                      ? 'bg-primary text-primary-foreground'
                      : isCurrent
                      ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : step.id}
                </div>
                <span
                  className={`mt-2 text-xs text-center max-w-[80px] ${
                    isCurrent ? 'text-primary font-medium' : 'text-muted-foreground'
                  }`}
                >
                  {step.name}
                </span>
              </div>
              
              {index < ONBOARDING_STEPS.length - 1 && (
                <div
                  className={`h-0.5 w-12 lg:w-20 mx-2 transition-colors ${
                    isCompleted ? 'bg-primary' : 'bg-border'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile view */}
      <div className="md:hidden flex items-center justify-center gap-2">
        <span className="text-sm font-medium text-primary">
          Step {currentStep} of {ONBOARDING_STEPS.length}
        </span>
        <span className="text-sm text-muted-foreground">
          — {ONBOARDING_STEPS[currentStep - 1]?.name}
        </span>
      </div>
    </div>
  );
};
