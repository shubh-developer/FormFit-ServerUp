// Simple test script to verify package booking API
const testPackageBooking = async () => {
  const testData = {
    name: "Test User",
    contact: "9876543210",
    email: "test@example.com",
    packageId: "weekly-3",
    packageName: "Weekly 3 Sessions",
    date: "2024-01-25",
    time: "10:00",
    status: "Pending",
    payment: "Pending",
    amount: 2599
  };

  try {
    console.log('🧪 Testing package booking API...');
    console.log('📤 Sending data:', testData);
    
    const response = await fetch('http://localhost:3000/api/package-bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    console.log('📥 Response status:', response.status);
    console.log('📥 Response data:', result);

    if (result.success) {
      console.log('✅ Package booking API test PASSED');
      console.log('🆔 Booking ID:', result.bookingId);
    } else {
      console.log('❌ Package booking API test FAILED');
      console.log('💬 Error message:', result.message);
    }
  } catch (error) {
    console.log('❌ Test failed with error:', error.message);
  }
};

// Run the test if this file is executed directly
if (typeof window === 'undefined') {
  testPackageBooking();
}

module.exports = { testPackageBooking };