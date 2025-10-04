import { Service, Oil, Package } from '@/types';
import { cacheManager, CACHE_KEYS } from './cache';

export const SERVICES: Service[] = [
  {
    id: 'full-body',
    name: 'Full Body Massage',
    duration: '60 mins',
    price: 999,
    description: 'Complete body relaxation and rejuvenation therapy',
    benefits: [
      'Relieves full body tension',
      'Improves blood circulation',
      'Reduces stress and anxiety',
      'Promotes better sleep',
      'Enhances overall wellness'
    ]
  },
  {
    id: 'upper-body',
    name: 'Upper Body Massage',
    duration: '30 mins',
    price: 499,
    description: 'Focused therapy for neck, shoulders, arms, and back',
    benefits: [
      'Relieves neck and shoulder pain',
      'Reduces upper back tension',
      'Improves posture',
      'Alleviates arm fatigue',
      'Perfect for desk workers'
    ]
  },
  {
    id: 'lower-body',
    name: 'Lower Body Massage',
    duration: '30 mins',
    price: 599,
    description: 'Therapeutic massage for legs, feet, and lower back',
    benefits: [
      'Relieves leg fatigue',
      'Reduces lower back pain',
      'Improves foot circulation',
      'Alleviates muscle soreness',
      'Great for athletes'
    ]
  },
  {
    id: 'head-massage',
    name: 'Head Massage',
    duration: '15-20 mins',
    price: 299,
    description: 'Soothing scalp and head massage for instant relief',
    benefits: [
      'Relieves headaches',
      'Reduces stress',
      'Improves hair health',
      'Promotes relaxation',
      'Quick stress buster'
    ]
  },
  {
    id: 'injury-therapy',
    name: 'Injury-Specific Therapy',
    duration: 'Custom',
    price: 799,
    description: 'Specialized therapy for specific injuries and pain areas',
    benefits: [
      'Targeted pain relief',
      'Faster injury recovery',
      'Professional assessment',
      'Customized treatment',
      'Long-term healing'
    ]
  },
  {
    id: 'full-body-stretching',
    name: 'Full Body Stretching',
    duration: '45 mins',
    price: 499,
    description: 'Comprehensive stretching therapy for improved flexibility and mobility',
    benefits: [
      'Improves flexibility and range of motion',
      'Reduces muscle stiffness and tension',
      'Enhances posture and body alignment',
      'Prevents injuries and muscle strains',
      'Promotes better blood circulation'
    ]
  },
  {
    id: 'personal-training',
    name: 'Personal Training',
    duration: '60 mins',
    price: 1299,
    description: 'One-on-one fitness training tailored to your goals and fitness level',
    benefits: [
      'Customized workout plans',
      'Proper form and technique guidance',
      'Goal-oriented training',
      'Motivation and accountability',
      'Injury prevention'
    ]
  },
  {
    id: 'strength-training',
    name: 'Strength Training',
    duration: '45 mins',
    price: 999,
    description: 'Build muscle strength and endurance with targeted resistance exercises',
    benefits: [
      'Increases muscle mass',
      'Improves bone density',
      'Boosts metabolism',
      'Enhances functional strength',
      'Better posture'
    ]
  },
  {
    id: 'cardio-fitness',
    name: 'Cardio Fitness',
    duration: '45 mins',
    price: 799,
    description: 'High-energy cardiovascular workouts to improve heart health and stamina',
    benefits: [
      'Improves cardiovascular health',
      'Burns calories effectively',
      'Increases stamina',
      'Reduces stress',
      'Better sleep quality'
    ]
  },
  {
    id: 'flexibility-mobility',
    name: 'Flexibility & Mobility',
    duration: '30 mins',
    price: 599,
    description: 'Stretching and mobility exercises to improve flexibility and range of motion',
    benefits: [
      'Improves flexibility',
      'Reduces muscle stiffness',
      'Better range of motion',
      'Injury prevention',
      'Enhanced performance'
    ]
  },
  {
    id: 'weight-loss',
    name: 'Weight Loss Program',
    duration: '60 mins',
    price: 1499,
    description: 'Comprehensive fitness program designed for effective and sustainable weight loss',
    benefits: [
      'Structured weight loss plan',
      'Nutrition guidance',
      'Fat burning workouts',
      'Progress tracking',
      'Long-term results'
    ]
  },
  {
    id: 'functional-training',
    name: 'Functional Training',
    duration: '45 mins',
    price: 899,
    description: 'Real-world movement patterns to improve daily life activities and sports performance',
    benefits: [
      'Improves daily activities',
      'Better balance and coordination',
      'Core strength development',
      'Sport-specific training',
      'Injury rehabilitation'
    ]
  },
  {
    id: 'muscle-gain',
    name: 'Muscle Gain Program',
    duration: '60 mins',
    price: 1399,
    description: 'Specialized training program focused on building lean muscle mass and strength',
    benefits: [
      'Targeted muscle building',
      'Progressive overload training',
      'Nutrition guidance for gains',
      'Supplement recommendations',
      'Body composition tracking'
    ]
  }
];

export const OILS: Oil[] = [
  {
    id: 'ayurvedic-herbal',
    name: 'Ayurvedic Herbal Oil',
    description: 'Traditional Ayurvedic blend for holistic healing',
    benefits: [
      'Natural healing properties',
      'Deep tissue penetration',
      'Anti-inflammatory effects',
      'Balances body energies'
    ],
    bestFor: ['pain-relief', 'injury-recovery', 'general wellness']
  },
  {
    id: 'pain-relief',
    name: 'Pain Relief Oil',
    description: 'Specialized oil for muscle and joint pain relief',
    benefits: [
      'Targeted pain relief',
      'Muscle relaxation',
      'Anti-inflammatory',
      'Quick pain reduction'
    ],
    bestFor: ['pain-relief', 'injury-recovery']
  },
  {
    id: 'relaxation',
    name: 'Relaxation Oil',
    description: 'Lavender and Eucalyptus blend for deep relaxation',
    benefits: [
      'Deep relaxation',
      'Stress reduction',
      'Aromatherapy benefits',
      'Better sleep quality'
    ],
    bestFor: ['relaxation', 'stress-relief']
  },
  {
    id: 'coconut',
    name: 'Coconut Oil',
    description: 'Pure natural coconut oil for gentle massage',
    benefits: [
      'Natural and gentle',
      'Skin nourishment',
      'No artificial additives',
      'Suitable for sensitive skin'
    ],
    bestFor: ['rejuvenation', 'skin-care', 'sensitive-skin']
  },
  {
    id: 'therapist-choice',
    name: 'Therapist Choice',
    description: 'Let our expert therapist choose the best oil for your needs',
    benefits: [
      'Professional recommendation',
      'Tailored to your condition',
      'Optimal results',
      'Expert selection'
    ],
    bestFor: ['all-purposes']
  }
];

export const PACKAGES: Package[] = [
  {
    id: 'weekly-3',
    name: 'Weekly 3 Sessions',
    sessions: 3,
    price: 2599,
    originalPrice: 2997,
    discount: 13,
    duration: '1 Week',
    description: 'Perfect for regular wellness maintenance'
  },
  {
    id: 'monthly-10',
    name: 'Monthly 10 Sessions',
    sessions: 10,
    price: 8499,
    originalPrice: 9990,
    discount: 15,
    duration: '1 Month',
    description: 'Best value for long-term wellness commitment'
  }
];

export const THERAPIST_INFO = {
  name: 'Professional Massage Therapist & Fitness Trainer',
  experience: '5+ years',
  specialization: 'Therapeutic Massage & Personal Fitness Training',
  location: 'Pune, Maharashtra',
  description: 'Certified therapist and professional fitness trainer with expertise in therapeutic massage techniques and personalized fitness coaching. Committed to providing comprehensive wellness solutions including pain relief, stress reduction, muscle tension release, and customized fitness training programs.',
  certifications: [
    'Certified Massage Therapist',
    'Certified Personal Fitness Trainer',
    'Ayurvedic Massage Specialist',
    'Sports Injury Therapy',
    'Stress Management Expert',
    'Fitness & Nutrition Specialist'
  ]
};

export const PAIN_AREAS = [
  'Neck & Shoulders',
  'Upper Back',
  'Lower Back',
  'Arms & Hands',
  'Legs & Feet',
  'Head & Face',
  'Hips & Glutes',
  'Chest & Abdomen'
];

// Cached data getters
export const getCachedServices = (): Service[] => {
  const cached = cacheManager.get(CACHE_KEYS.SERVICES) as Service[] | null;
  if (cached) return cached;
  
  cacheManager.set(CACHE_KEYS.SERVICES, SERVICES, 30 * 60 * 1000); // 30 minutes
  return SERVICES;
};

export const getCachedOils = (): Oil[] => {
  const cached = cacheManager.get(CACHE_KEYS.OILS) as Oil[] | null;
  if (cached) return cached;
  
  cacheManager.set(CACHE_KEYS.OILS, OILS, 30 * 60 * 1000); // 30 minutes
  return OILS;
};

export const getCachedPackages = (): Package[] => {
  const cached = cacheManager.get(CACHE_KEYS.PACKAGES) as Package[] | null;
  if (cached) return cached;
  
  cacheManager.set(CACHE_KEYS.PACKAGES, PACKAGES, 30 * 60 * 1000); // 30 minutes
  return PACKAGES;
}; 