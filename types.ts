export enum GenerationStatus {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}

export interface VideoState {
  status: GenerationStatus;
  url: string | null;
  error: string | null;
}

export interface SoftwareItem {
  name: string;
  type: 'Free' | 'Paid' | 'Freemium';
  bestFor: string;
  description: string;
}

export interface SoftwareRecommendation {
  platform: string; // e.g., "Desktop (PC/Mac)", "Mobile (iOS/Android)"
  apps: SoftwareItem[];
}

export interface MonetizationMethod {
  title: string;
  potentialEarnings: string;
  difficulty: 'Low' | 'Medium' | 'High';
  strategy: string;
}

export interface EditingStep {
  phase: string;
  action: string;
  tips: string;
}

export interface CreatorGuide {
  titles: string[];
  hook: string;
  thumbnail: string;
  monetization: MonetizationMethod[];
  software: SoftwareRecommendation[];
  editingWorkflow: EditingStep[];
  equipment: string[];
}

export interface AppState {
  status: GenerationStatus;
  data: CreatorGuide | null;
  error: string | null;
}

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}