import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { OrganizationDetails, ComplianceDocument, TeamMember, OnboardingState } from '@/types/onboarding';

const storedOnboarding = localStorage.getItem('blazetech_onboarding');
const parsedOnboarding = storedOnboarding ? JSON.parse(storedOnboarding) : null;

const initialState: OnboardingState = parsedOnboarding || {
  currentStep: 1,
  organizationDetails: null,
  complianceDocuments: [],
  teamMembers: [],
  isOnboardingComplete: false,
};

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
      localStorage.setItem('blazetech_onboarding', JSON.stringify(state));
    },
    setOrganizationDetails: (state, action: PayloadAction<OrganizationDetails>) => {
      state.organizationDetails = action.payload;
      state.currentStep = 5;
      localStorage.setItem('blazetech_onboarding', JSON.stringify(state));
    },
    setComplianceDocuments: (state, action: PayloadAction<ComplianceDocument[]>) => {
      state.complianceDocuments = action.payload;
      localStorage.setItem('blazetech_onboarding', JSON.stringify(state));
    },
    addComplianceDocument: (state, action: PayloadAction<ComplianceDocument>) => {
      const existingIndex = state.complianceDocuments.findIndex(
        doc => doc.type === action.payload.type
      );
      if (existingIndex >= 0) {
        state.complianceDocuments[existingIndex] = action.payload;
      } else {
        state.complianceDocuments.push(action.payload);
      }
      localStorage.setItem('blazetech_onboarding', JSON.stringify(state));
    },
    removeComplianceDocument: (state, action: PayloadAction<string>) => {
      state.complianceDocuments = state.complianceDocuments.filter(
        doc => doc.id !== action.payload
      );
      localStorage.setItem('blazetech_onboarding', JSON.stringify(state));
    },
    addTeamMember: (state, action: PayloadAction<TeamMember>) => {
      state.teamMembers.push(action.payload);
      localStorage.setItem('blazetech_onboarding', JSON.stringify(state));
    },
    removeTeamMember: (state, action: PayloadAction<string>) => {
      state.teamMembers = state.teamMembers.filter(
        member => member.id !== action.payload
      );
      localStorage.setItem('blazetech_onboarding', JSON.stringify(state));
    },
    updateTeamMember: (state, action: PayloadAction<{ id: string; updates: Partial<TeamMember> }>) => {
      const index = state.teamMembers.findIndex(m => m.id === action.payload.id);
      if (index >= 0) {
        state.teamMembers[index] = { ...state.teamMembers[index], ...action.payload.updates };
      }
      localStorage.setItem('blazetech_onboarding', JSON.stringify(state));
    },
    completeOnboarding: (state) => {
      state.isOnboardingComplete = true;
      state.currentStep = 7;
      localStorage.setItem('blazetech_onboarding', JSON.stringify(state));
    },
    resetOnboarding: (state) => {
      state.currentStep = 1;
      state.organizationDetails = null;
      state.complianceDocuments = [];
      state.teamMembers = [];
      state.isOnboardingComplete = false;
      localStorage.removeItem('blazetech_onboarding');
    },
  },
});

export const {
  setCurrentStep,
  setOrganizationDetails,
  setComplianceDocuments,
  addComplianceDocument,
  removeComplianceDocument,
  addTeamMember,
  removeTeamMember,
  updateTeamMember,
  completeOnboarding,
  resetOnboarding,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;
