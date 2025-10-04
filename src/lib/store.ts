import { create } from 'zustand';
import { Booking, Inquiry, Feedback } from '@/types';

interface AppState {
  bookings: Booking[];
  inquiries: Inquiry[];
  feedback: Feedback[];
  isLoading: boolean;
  toast: {
    message: string;
    type: 'success' | 'error' | 'info';
    show: boolean;
  };
  
  // Actions
  addBooking: (booking: Booking) => void;
  addInquiry: (inquiry: Inquiry) => void;
  addFeedback: (feedback: Feedback) => void;
  setLoading: (loading: boolean) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  bookings: [],
  inquiries: [],
  feedback: [],
  isLoading: false,
  toast: {
    message: '',
    type: 'info',
    show: false,
  },

  addBooking: (booking) =>
    set((state) => ({
      bookings: [...state.bookings, { ...booking, id: Date.now().toString(), createdAt: new Date() }],
    })),

  addInquiry: (inquiry) =>
    set((state) => ({
      inquiries: [...state.inquiries, { ...inquiry, id: Date.now().toString(), createdAt: new Date() }],
    })),

  addFeedback: (feedback) =>
    set((state) => ({
      feedback: [...state.feedback, { ...feedback, id: Date.now().toString(), createdAt: new Date() }],
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  showToast: (message, type) =>
    set({
      toast: { message, type, show: true },
    }),

  hideToast: () =>
    set((state) => ({
      toast: { ...state.toast, show: false },
    })),
})); 