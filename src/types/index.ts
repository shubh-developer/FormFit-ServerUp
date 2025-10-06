export interface Booking {
  id?: string;
  name: string;
  contact: string;
  email: string;
  address: string;
  serviceType: ServiceType;
  oilType: OilType;
  dateTime: Date;
  injuryNote?: string;
  wellnessAssessment?: WellnessAssessment;
  painAreas?: PainArea[];
  isUrgent?: boolean;
  paymentStatus?: 'pending' | 'paid' | 'cash';
  createdAt?: Date;
}

export interface Inquiry {
  id?: string;
  name: string;
  phone: string;
  message: string;
  createdAt?: Date;
}

export interface Feedback {
  id?: string;
  name: string;
  rating: number;
  comment: string;
  createdAt?: Date;
}

export interface Package {
  id: string;
  name: string;
  sessions: number;
  price: number;
  duration: string;
  description: string;
  originalPrice?: number;
  discount?: number;
}

export interface WellnessAssessment {
  stressLevel: number; // 1-5
  stiffnessLevel: number; // 1-5
  postureIssues: boolean;
  dailyActivity: 'sedentary' | 'moderate' | 'active';
  sleepQuality: number; // 1-5
  goals: ('pain-relief' | 'relaxation' | 'rejuvenation' | 'injury-recovery')[];
}

export interface PainArea {
  area: string;
  intensity: number; // 1-5
  description?: string;
}

export interface OilRecommendation {
  oilType: OilType;
  reason: string;
  benefits: string[];
}

export type ServiceType = 
  | 'full-body'
  | 'upper-body'
  | 'lower-body'
  | 'head-massage'
  | 'injury-therapy'
  | 'full-body-stretching'
  | 'personal-training'
  | 'strength-training'
  | 'cardio-fitness'
  | 'flexibility-mobility'
  | 'weight-loss'
  | 'functional-training'
  | 'muscle-gain';

export type OilType = 
  | 'ayurvedic-herbal'
  | 'pain-relief'
  | 'relaxation'
  | 'coconut'
  | 'therapist-choice';

export interface Service {
  id: ServiceType;
  name: string;
  duration: string;
  price: number;
  description: string;
  benefits: string[];
}

export interface Oil {
  id: OilType;
  name: string;
  description: string;
  benefits: string[];
  bestFor: string[];
} 