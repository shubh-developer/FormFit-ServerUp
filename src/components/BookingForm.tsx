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
import { SERVICES, OILS } from '@/lib/data';
import { useAppStore } from '@/lib/store';
import { useRouter, useSearchParams } from 'next/navigation';
import { ServiceType, PainArea } from '@/types';
import PainAreaSelector from './PainAreaSelector';
import WhatsAppButton from './WhatsAppButton';
import { useCreateBooking } from '@/lib/hooks';

const bookingSchema = z.object({
  name: nameSchema,
  contact: phoneSchema,
  email: emailSchema,
  address: addressSchema,
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  height: z.string().min(1, 'Height is required'),
  weight: z.string().min(1, 'Weight is required'),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  serviceType: z.enum(['full-body', 'upper-body', 'lower-body', 'head-massage', 'injury-therapy', 'full-body-stretching', 'personal-training', 'strength-training', 'cardio-fitness', 'flexibility-mobility', 'weight-loss', 'functional-training', 'muscle-gain']),
  oilType: z.enum(['ayurvedic-herbal', 'pain-relief', 'relaxation', 'coconut', 'therapist-choice']),
  dateTime: z.date().min(new Date(), 'Please select a future date and time'),
  injuryNote: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const BookingForm = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [painAreas, setPainAreas] = useState<PainArea[]>([]);
  const [isUrgent, setIsUrgent] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [isPackageBooking, setIsPackageBooking] = useState(false);
  const { addBooking, showToast } = useAppStore();
  const router = useRouter();
  const createBookingMutation = useCreateBooking();
  const searchParams = useSearchParams();
  const preSelectedService = searchParams.get('service');
  const preSelectedPackage = searchParams.get('package');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceType: (preSelectedService as ServiceType) || 'full-body',
      oilType: 'ayurvedic-herbal',
    },
  });

  useEffect(() => {
    if (preSelectedService) {
      setValue('serviceType', preSelectedService as ServiceType);
    }
  }, [preSelectedService, setValue]);

  useEffect(() => {
    if (preSelectedPackage) {
      fetchPackageDetails(preSelectedPackage);
      setIsPackageBooking(true);
    }
  }, [preSelectedPackage, setValue]);

  const fetchPackageDetails = async (packageId: string) => {
    try {
      const response = await fetch('/api/packages');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const pkg = data.packages.find((p: any) => p.id.toString() === packageId);
          if (pkg) {
            setSelectedPackage(pkg);
            setValue('serviceType', 'full-body');
          }
        }
      }
    } catch (error) {
      console.error('Error fetching package details:', error);
    }
  };

  const selectedService = watch('serviceType');
  const selectedOil = watch('oilType');

  const currentService = SERVICES.find(s => s.id === selectedService);
  const currentOil = OILS.find(o => o.id === selectedOil);

  const onSubmit = async (data: BookingFormData) => {
    if (!selectedDate) {
      showToast('Please select a date and time', 'error');
      return;
    }

    const currentService = SERVICES.find(s => s.id === data.serviceType);
    const totalAmount = (currentService?.price || 0) + (isUrgent ? 200 : 0);

    const finalAmount = isPackageBooking && selectedPackage 
      ? selectedPackage.discounted_price + (isUrgent ? 200 : 0)
      : totalAmount;

    const bookingData = {
      name: data.name,
      contact: data.contact,
      email: data.email,
      address: data.address,
      dateOfBirth: data.dateOfBirth,
      height: data.height,
      weight: data.weight,
      bloodGroup: data.bloodGroup,
      service: isPackageBooking && selectedPackage ? `Package: ${selectedPackage.title}` : currentService?.name || data.serviceType,
      serviceType: data.serviceType,
      oilType: data.oilType,
      date: selectedDate.toISOString().split('T')[0],
      time: selectedDate.toTimeString().split(' ')[0].substring(0, 5),
      status: 'Pending',
      payment: 'Pending',
      amount: finalAmount,
      isPackageBooking,
      packageId: selectedPackage?.id || null,
      injuryNote: data.injuryNote,
      painAreas,
      isUrgent
    };

    createBookingMutation.mutate(bookingData, {
      onSuccess: (result) => {
        addBooking({ ...data, dateTime: selectedDate });
        showToast(result.message || 'Booking submitted successfully!', 'success');
        
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
        <h2 className="text-3xl font-light text-white mb-6 text-center tracking-wide">Book Your Appointment</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-4 border-2 border-white/20 rounded-lg p-6 bg-white/10 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <User className="w-5 h-5 mr-2 text-amber-300" />
                  Personal Information
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    {...register('name')}
                    className="w-full px-4 py-3 border-2 border-white/20 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 font-medium"
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
                    maxLength={10}
                    onInput={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.value = target.value.replace(/[^0-9]/g, '').slice(0, 10);
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500 font-medium"
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500 font-medium"
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500 font-medium resize-none"
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
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium"
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
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium"
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
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium"
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
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium"
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
                  <Clock className="w-5 h-5 mr-2 text-green-600" />
                  Select Service
                </h3>
                
                {isPackageBooking && selectedPackage ? (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-blue-900">{selectedPackage.title}</h4>
                        <p className="text-sm text-blue-700">{selectedPackage.sessions} sessions • {selectedPackage.validity_days} days validity</p>
                      </div>
                      <div className="text-right">
                        {selectedPackage.original_price && (
                          <span className="text-sm text-gray-500 line-through block">₹{selectedPackage.original_price}</span>
                        )}
                        <span className="text-lg font-bold text-blue-600">₹{selectedPackage.discounted_price}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <select
                      {...register('serviceType')}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium appearance-none cursor-pointer shadow-sm hover:border-gray-400 transition-colors"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 0.5rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em',
                        paddingRight: '2.5rem'
                      }}
                    >
                      {SERVICES.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name} - {service.duration} - ₹{service.price}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
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

              {/* Oil Selection */}
              <div className="space-y-4 border-2 border-amber-100 rounded-lg p-6 bg-amber-50">
                <h3 className="text-lg font-semibold text-gray-900">Select Oil</h3>
                
                <div>
                  <select
                    {...register('oilType')}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium appearance-none cursor-pointer shadow-sm hover:border-gray-400 transition-colors"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 0.5rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em',
                      paddingRight: '2.5rem'
                    }}
                  >
                    {OILS.map((oil) => (
                      <option key={oil.id} value={oil.id}>
                        {oil.name} - {oil.description}
                      </option>
                    ))}
                  </select>
                </div>
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
                    minTime={new Date(new Date().setHours(8, 0, 0, 0))}
                    maxTime={new Date(new Date().setHours(22, 0, 0, 0))}
                    placeholderText="Select date and time"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500 font-medium"
                    wrapperClassName="w-full"
                    popperClassName="z-50"
                  />
                  {errors.dateTime && (
                    <p className="text-red-500 text-sm mt-1">{errors.dateTime.message}</p>
                  )}
                </div>
              </div>

              {/* Pain Areas */}
              <div className="border-2 border-red-100 rounded-lg p-6 bg-red-50">
                <PainAreaSelector
                  onPainAreasChange={setPainAreas}
                  selectedPainAreas={painAreas}
                />
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

              {/* Injury Notes */}
              <div className="space-y-4 border-2 border-gray-100 rounded-lg p-6 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-gray-600" />
                  Additional Notes (Optional)
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Injury Notes or Special Requirements
                  </label>
                  <textarea
                    {...register('injuryNote')}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500 font-medium resize-none"
                    placeholder="Please mention any injuries, pain areas, or special requirements..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Full Width Sections */}
          {/* Summary */}
          {((currentService && currentOil) || selectedPackage) && (
            <div className="border-2 border-orange-100 rounded-lg p-6 bg-orange-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-orange-600 mr-2">📋</span>
                Booking Summary
              </h3>
              <div className="space-y-3">
                {isPackageBooking && selectedPackage ? (
                  <>
                    <div className="flex justify-between items-center py-2 border-b border-orange-200">
                      <span className="text-gray-700 font-medium">Package:</span>
                      <span className="font-semibold text-gray-900">{selectedPackage.title}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-orange-200">
                      <span className="text-gray-700 font-medium">Sessions:</span>
                      <span className="font-semibold text-gray-900">{selectedPackage.sessions} sessions</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-orange-200">
                      <span className="text-gray-700 font-medium">Validity:</span>
                      <span className="font-semibold text-gray-900">{selectedPackage.validity_days} days</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between items-center py-2 border-b border-orange-200">
                    <span className="text-gray-700 font-medium">Service:</span>
                    <span className="font-semibold text-gray-900">{currentService?.name} - ₹{currentService?.price}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-2 border-b border-orange-200">
                  <span className="text-gray-700 font-medium">Oil:</span>
                  <span className="font-semibold text-gray-900">{currentOil.name}</span>
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
                <div className="pt-3 mt-3 border-t-2 border-orange-300">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">{isPackageBooking ? 'Package Price:' : 'Total:'}</span>
                    {isPackageBooking && selectedPackage ? (
                      <div className="text-right">
                        {selectedPackage.original_price && (
                          <span className="text-sm text-gray-500 line-through block">₹{selectedPackage.original_price}</span>
                        )}
                        <span className="text-2xl font-bold text-green-600">₹{selectedPackage.discounted_price + (isUrgent ? 200 : 0)}</span>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-green-600">₹{(currentService?.price || 0) + (isUrgent ? 200 : 0)}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cancellation Policy */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Cancellation Policy
            </h3>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Free cancellation up to 2 hours before appointment</li>
              <li>• 50% fee if canceled less than 1 hour before</li>
              <li>• Full refund if therapist cancels due to emergencies</li>
            </ul>
          </div>

          {/* WhatsApp Quick Contact */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">Need Immediate Assistance?</h3>
            <p className="text-green-700 text-sm mb-3">
              Have questions or need to discuss your booking? Contact us directly on WhatsApp.
            </p>
            <WhatsAppButton
              phoneNumber="917875671417"
              message={`Hi! I'd like to discuss my massage booking for ${currentService?.name || 'massage service'}.`}
              className="w-full"
            >
              Chat on WhatsApp
            </WhatsAppButton>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={createBookingMutation.isPending}
            data-track="booking"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createBookingMutation.isPending ? (
              <LoadingSpinner text="Booking..." />
            ) : (
              'Book Appointment'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;