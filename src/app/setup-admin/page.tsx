'use client';

import { useState } from 'react';

export default function SetupAdmin() {
  const [formData, setFormData] = useState({
    username: 'masteradmin',
    password: 'MasterAdmin@2024!',
    email: 'master@formafit.com',
    fullName: 'Master Administrator'
  });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/admin/create-master', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setMessage(data.message);
      
      if (data.success) {
        setTimeout(() => {
          window.location.href = '/master-login';
        }, 2000);
      }
    } catch (error) {
      setMessage('Network error: ' + error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">Setup Master Admin</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            className="w-full p-3 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full p-3 border rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full p-3 border rounded"
          />
          <input
            type="text"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            className="w-full p-3 border rounded"
          />
          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded">
            Create Admin
          </button>
        </form>
        
        {message && <p className="mt-4 text-center">{message}</p>}
      </div>
    </div>
  );
}