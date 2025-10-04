import Link from 'next/link';
import { Clock, Star, CheckCircle, ArrowRight, MapPin, Shield } from 'lucide-react';

const FITNESS_SERVICES = [
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

export default function FitnessPage({ searchParams }: { searchParams: { type?: string } }) {
  const trainingType = searchParams?.type;
  
  const getPrice = (originalPrice: number) => {
    return trainingType === 'online' ? Math.round(originalPrice * 0.7) : originalPrice;
  };
  
  if (trainingType === 'online') {
    return (
      <div className="min-h-[100vh] relative -mt-16" style={{backgroundImage: 'url(/images/pair-gloves-boxing-sport.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'scroll'}}>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Online Fitness Training</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Transform your fitness journey with our professional online personal training services via video calls.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {FITNESS_SERVICES.map((service) => (
              <div key={service.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">{service.name}</h3>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-600">₹{getPrice(service.price)}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {service.duration}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Benefits:</h4>
                    <ul className="space-y-1">
                      {service.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t pt-4">
                    <Link
                      href={`/book?service=${service.id}&type=fitness&mode=online`}
                      className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
                    >
                      Book Online Training
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-[100vh] relative -mt-16" style={{backgroundImage: 'url(/images/pair-gloves-boxing-sport.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'scroll'}}>
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            {trainingType === 'offline' ? 'Offline Fitness Training Services' : 'Our Fitness Training Services'}
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Transform your fitness journey with our professional personal training services. 
            All sessions are conducted by our certified fitness trainer at your home or preferred location.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {FITNESS_SERVICES.map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">{service.name}</h3>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-600">₹{getPrice(service.price)}</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {service.duration}
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{service.description}</p>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Benefits:</h4>
                  <ul className="space-y-1">
                    {service.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t pt-4">
                  <Link
                    href={`/book?service=${service.id}&type=fitness`}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    Book This Training
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Why Choose Us Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Why Choose Our Fitness Training?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Certified Trainer</h3>
              <p className="text-gray-600">Professional fitness trainer with certifications and years of experience.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Home Training</h3>
              <p className="text-gray-600">Convenient training sessions at your home or preferred outdoor location.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Personalized Plans</h3>
              <p className="text-gray-600">Customized workout plans based on your fitness goals and current level.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
     
      </div>
    </div>
  );
}