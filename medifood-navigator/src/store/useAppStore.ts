import { create } from 'zustand';

interface AppState {
  hasAgreedDisclaimer: boolean;
  selectedDiseases: string[];
  searchQuery: string;
  setHasAgreedDisclaimer: (agreed: boolean) => void;
  toggleDisease: (disease: string) => void;
  setSearchQuery: (query: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  hasAgreedDisclaimer: false,
  selectedDiseases: [],
  searchQuery: '',
  
  setHasAgreedDisclaimer: (agreed) => set({ hasAgreedDisclaimer: agreed }),
  
  toggleDisease: (disease) => set((state) => {
    const isSelected = state.selectedDiseases.includes(disease);
    if (isSelected) {
      return { selectedDiseases: state.selectedDiseases.filter(d => d !== disease) };
    } else {
      return { selectedDiseases: [...state.selectedDiseases, disease] };
    }
  }),
  
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
