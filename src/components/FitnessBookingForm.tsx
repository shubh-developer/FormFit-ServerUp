'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DatePicker from 'react-datepicker';
import { phoneSchema, nameSchema, addressSchema, emailSchema } from '@/lib/validation';
import 'react-datepicker/dist/react-datepicker.css';
import { Clock, User, MessageSquare, AlertTriangle } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import { useAppStore } from '@/lib/store';
import { useRouter, useSearchParams } from 'next/navigation';
import WhatsAppButton from './WhatsAppButton';
import { useCreateBooking } from '@/lib/hooks';

const FITNESS_SERVICES = [
  {
    id: 'personal-training',
    name: 'Personal Training',
    duration: '60 mins',
    price: 1299,
    description: 'One-on-one fitness training tailored to your goals'
  },
  {
    id: 'strength-training',
    name: 'Strength Training',
    duration: '45 mins',
    price: 999,
    description: 'Build muscle strength and endurance'
  },
  {
    id: 'cardio-fitness',
    name: 'Cardio Fitness',
    duration: '45 mins',
    price: 799,
    description: 'High-energy cardiovascular workouts'
  },
  {
    id: 'flexibility-mobility',
    name: 'Flexibility & Mobility',
    duration: '30 mins',
    price: 599,
    description: 'Stretching and mobility exercises'
  },
  {
    id: 'weight-loss',
    name: 'Weight Loss Program',
    duration: '60 mins',
    price: 1499,
    description: 'Comprehensive fitness program for weight loss'
  },
  {
    id: 'functional-training',
    name: 'Functional Training',
    duration: '45 mins',
    price: 899,
    description: 'Real-world movement patterns training'
  }
];

const fitnessBookingSchema = z.object({
  name: nameSchema,
  contact: phoneSchema,
  email: emailSchema,
  address: addressSchema,
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  height: z.string().min(1, 'Height is required'),
  weight: z.string().min(1, 'Weight is required'),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  serviceType: z.enum(['personal-training', 'strength-training', 'cardio-fitness', 'flexibility-mobility', 'weight-loss', 'functional-training']),
  dateTime: z.date().min(new Date(), 'Please select a future date and time'),
  fitnessGoals: z.string().optional(),
  nutritionGuide: z.enum(['none', 'vegetarian', 'non-vegetarian', 'both']).optional(),
});

type FitnessBookingFormData = z.infer<typeof fitnessBookingSchema>;

const FitnessBookingForm = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isUrgent, setIsUrgent] = useState(false);
  const [nutritionGuide, setNutritionGuide] = useState('none');
  const { addBooking, showToast } = useAppStore();
  const router = useRouter();
  const createBookingMutation = useCreateBooking();
  const searchParams = useSearchParams();
  const preSelectedService = searchParams.get('service');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FitnessBookingFormData>({
    resolver: zodResolver(fitnessBookingSchema),
    defaultValues: {
      serviceType: (preSelectedService as any) || 'personal-training',
    },
  });

  const selectedService = watch('serviceType');
  const currentService = FITNESS_SERVICES.find(s => s.id === selectedService);
  const nutritionFee = nutritionGuide !== 'none' ? 1500 : 0;

  const onSubmit = async (data: FitnessBookingFormData) => {
    if (!selectedDate) {
      showToast('Please select a date and time', 'error');
      return;
    }

    const bookingData = {
      ...data,
      dateTime: selectedDate,
      isUrgent,
      nutritionGuide,
      amount: (currentService?.price || 0) + (isUrgent ? 200 : 0) + nutritionFee,
      paymentStatus: 'pending' as const,
      serviceType: 'fitness-training',
      fitnessService: data.serviceType,
    };

    createBookingMutation.mutate(bookingData, {
      onSuccess: (result) => {
        addBooking({ ...data, dateTime: selectedDate, oilType: 'therapist-choice' as const });
        showToast(result.message || 'Fitness training booking submitted successfully!', 'success');
        
        setTimeout(() => {
          router.push('/success');
        }, 2000);
      },
      onError: (error) => {
        console.error('Booking submission error:', error);
        showToast('Something went wrong. Please try again.', 'error');
      },
    });
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      setValue('dateTime', date);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen" suppressHydrationWarning>
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-8">
        <h2 className="text-3xl font-light text-white mb-6 text-center tracking-wide">Book Your Fitness Training</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" suppressHydrationWarning>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-4 border-2 border-white/20 rounded-lg p-6 bg-white/10 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <User className="w-5 h-5 mr-2 text-orange-300" />
                  Personal Information
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    {...register('name')}
                    className="w-full px-4 py-3 border-2 border-white/20 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 font-medium"
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    {...register('contact')}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500 font-medium"
                    placeholder="Enter your 10-digit phone number"
                  />
                  {errors.contact && (
                    <p className="text-red-500 text-sm mt-1">{errors.contact.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500 font-medium"
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Address *
                  </label>
                  <textarea
                    {...register('address')}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500 font-medium resize-none"
                    placeholder="Enter your complete address"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      {...register('dateOfBirth')}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 font-medium"
                    />
                    {errors.dateOfBirth && (
                      <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Blood Group *
                    </label>
                    <select
                      {...register('bloodGroup')}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 font-medium"
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                    {errors.bloodGroup && (
                      <p className="text-red-500 text-sm mt-1">{errors.bloodGroup.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Height (cm) *
                    </label>
                    <input
                      type="number"
                      {...register('height')}
                      min="100"
                      max="250"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 font-medium"
                      placeholder="Enter height in cm"
                    />
                    {errors.height && (
                      <p className="text-red-500 text-sm mt-1">{errors.height.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Weight (kg) *
                    </label>
                    <input
                      type="number"
                      {...register('weight')}
                      min="30"
                      max="200"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 font-medium"
                      placeholder="Enter weight in kg"
                    />
                    {errors.weight && (
                      <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Service Selection */}
              <div className="space-y-4 border-2 border-green-100 rounded-lg p-6 bg-green-50">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-orange-600" />
                  Select Training Service
                </h3>
                
                <div>
                  <select
                    {...register('serviceType')}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 font-medium appearance-none cursor-pointer shadow-sm hover:border-gray-400 transition-colors"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 0.5rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em',
                      paddingRight: '2.5rem'
                    }}
                  >
                    {FITNESS_SERVICES.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name} - {service.duration} - ₹{service.price}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Duration Display */}
                {currentService && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-700">Duration:</span>
                      <span className="text-sm font-semibold text-blue-900">{currentService.duration}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Date and Time Selection */}
              <div className="space-y-4 border-2 border-purple-100 rounded-lg p-6 bg-purple-50">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Select Date & Time
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Date & Time *
                  </label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={30}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    minDate={new Date()}
                    minTime={new Date(new Date().setHours(6, 0, 0, 0))}
                    maxTime={new Date(new Date().setHours(21, 0, 0, 0))}
                    placeholderText="Select date and time"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500 font-medium"
                    wrapperClassName="w-full"
                    popperClassName="z-50"
                  />
                  {errors.dateTime && (
                    <p className="text-red-500 text-sm mt-1">{errors.dateTime.message}</p>
                  )}
                </div>
              </div>

              {/* Urgent Booking */}
              <div className="space-y-4">
                <div className="flex items-center p-4 border border-orange-200 rounded-lg bg-orange-50">
                  <AlertTriangle className="w-5 h-5 text-orange-600 mr-3" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-orange-900">Urgent Booking</h3>
                    <p className="text-sm text-orange-700">Mark as urgent for immediate attention (₹200 extra)</p>
                  </div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isUrgent}
                      onChange={(e) => setIsUrgent(e.target.checked)}
                      className="w-5 h-5 text-orange-600 bg-white border-2 border-orange-300 rounded focus:ring-orange-500 focus:ring-2 mr-3"
                    />
                    <span className="text-sm font-medium text-orange-900">Urgent</span>
                  </label>
                </div>
              </div>

              {/* Fitness Goals */}
              <div className="space-y-4 border-2 border-gray-100 rounded-lg p-6 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-gray-600" />
                  Fitness Goals (Optional)
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Fitness Goals & Requirements
                  </label>
                  <textarea
                    {...register('fitnessGoals')}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500 font-medium resize-none"
                    placeholder="Please mention your fitness goals, current fitness level, any health conditions, or special requirements..."
                  />
                </div>
              </div>

              {/* Nutrition Guide */}
              <div className="space-y-4 border-2 border-blue-100 rounded-lg p-6 bg-blue-50">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <span className="text-blue-600 mr-2">🥗</span>
                  Add Nutrition Guide (₹1500)
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Nutrition Plan
                  </label>
                  <select
                    {...register('nutritionGuide')}
                    value={nutritionGuide}
                    onChange={(e) => setNutritionGuide(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium"
                  >
                    <option value="none">No Nutrition Guide</option>
                    <option value="vegetarian">Vegetarian Plan</option>
                    <option value="non-vegetarian">Non-Vegetarian Plan</option>
                    <option value="both">Both Plans</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          {currentService && (
            <div className="border-2 border-orange-100 rounded-lg p-6 bg-orange-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-orange-600 mr-2">📋</span>
                Booking Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-orange-200">
                  <span className="text-gray-700 font-medium">Training Service:</span>
                  <span className="font-semibold text-gray-900">{currentService.name} - ₹{currentService.price}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-orange-200">
                  <span className="text-gray-700 font-medium">Duration:</span>
                  <span className="font-semibold text-gray-900">{currentService.duration}</span>
                </div>
                {isUrgent && (
                  <div className="flex justify-between items-center py-2 border-b border-orange-200">
                    <span className="text-gray-700 font-medium">Urgent Fee:</span>
                    <span className="font-semibold text-orange-600">₹200</span>
                  </div>
                )}
                {nutritionGuide !== 'none' && (
                  <div className="flex justify-between items-center py-2 border-b border-orange-200">
                    <span className="text-gray-700 font-medium">Nutrition Guide ({nutritionGuide}):</span>
                    <span className="font-semibold text-blue-600">₹1500</span>
                  </div>
                )}
                <div className="pt-3 mt-3 border-t-2 border-orange-300">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total:</span>
                    <span className="text-2xl font-bold text-green-600">₹{currentService.price + (isUrgent ? 200 : 0) + nutritionFee}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* WhatsApp Quick Contact */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">Need Immediate Assistance?</h3>
            <p className="text-green-700 text-sm mb-3">
              Have questions or need to discuss your fitness training? Contact us directly on WhatsApp.
            </p>
            <WhatsAppButton
              phoneNumber="917875671417"
              message={`Hi! I'd like to discuss my fitness training booking for ${currentService?.name || 'fitness training'}.`}
              className="w-full"
            >
              Chat on WhatsApp
            </WhatsAppButton>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={createBookingMutation.isPending}
            className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createBookingMutation.isPending ? (
              <LoadingSpinner text="Booking..." />
            ) : (
              'Book Fitness Training'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FitnessBookingForm;