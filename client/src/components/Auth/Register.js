import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import { EnvelopeIcon, LockClosedIcon, UserCircleIcon, PhoneIcon, CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';

function RegisterForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    dob: '',
    address: '',
    phoneNumber: '',
    about: '',
    postalCode: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Helper: Compute age from DOB
  const computeAge = (dobString) => {
    const dob = new Date(dobString);
    if (isNaN(dob.getTime())) return '';
    const diffMs = Date.now() - dob.getTime();
    const ageDate = new Date(diffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation: Check if passwords match and dob is valid
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords don't match");
    }
    if (!formData.dob || isNaN(new Date(formData.dob).getTime())) {
      return setError("Please enter a valid date of birth");
    }

    setIsLoading(true);
    
    try {
      // Hash password (or do this on the server)
      // const hashedPassword = await bcrypt.hash(formData.password, 10);
      
      const calculatedAge = computeAge(formData.dob);
      const registrationData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        age: calculatedAge,
        dob: new Date(formData.dob).toISOString(),
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        about: formData.about,
        postalCode: formData.postalCode,

 
      };

      // Save to session storage for OTP verification
      sessionStorage.setItem('userData', JSON.stringify(registrationData));
      
      // Proceed to OTP verification (backend must handle sending OTP)
      navigate('/otp-verification', { state: { email: formData.email } });
      
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-purple-600 p-6">
          <h2 className="text-3xl font-bold text-white text-center">
            Create Your Account
          </h2>
        </div>

        <div className="p-8 space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Username */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-800">Username</label>
              <div className="relative">
                <UserCircleIcon className="h-5 w-5 absolute left-3 top-3 text-purple-400" />
                <input
                  type="text"
                  name="username"
                  onChange={handleChange}
                  value={formData.username}
                  placeholder="Enter username"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-purple-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-800">Email</label>
              <div className="relative">
                <EnvelopeIcon className="h-5 w-5 absolute left-3 top-3 text-purple-400" />
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  value={formData.email}
                  placeholder="Enter email"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-purple-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-800">Password</label>
              <div className="relative">
                <LockClosedIcon className="h-5 w-5 absolute left-3 top-3 text-purple-400" />
                <input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  value={formData.password}
                  placeholder="Create password"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-purple-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-800">Confirm Password</label>
              <div className="relative">
                <LockClosedIcon className="h-5 w-5 absolute left-3 top-3 text-purple-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  onChange={handleChange}
                  value={formData.confirmPassword}
                  placeholder="Confirm password"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-purple-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* First Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-800">First Name</label>
              <input
                type="text"
                name="firstName"
                onChange={handleChange}
                value={formData.firstName}
                placeholder="John"
                className="w-full px-4 py-3 rounded-lg border-2 border-purple-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                required
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-800">Last Name</label>
              <input
                type="text"
                name="lastName"
                onChange={handleChange}
                value={formData.lastName}
                placeholder="Doe"
                className="w-full px-4 py-3 rounded-lg border-2 border-purple-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                required
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-800">Phone Number</label>
              <div className="relative">
                <PhoneIcon className="h-5 w-5 absolute left-3 top-3 text-purple-400" />
                <input
                  type="tel"
                  name="phoneNumber"
                  onChange={handleChange}
                  value={formData.phoneNumber}
                  placeholder="+91 123 456 7890"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-purple-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-800">Date of Birth</label>
              <div className="relative">
                <CalendarIcon className="h-5 w-5 absolute left-3 top-3 text-purple-400" />
                <input
                  type="date"
                  name="dob"
                  onChange={handleChange}
                  value={formData.dob}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-purple-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  required
                />
              </div>
              {formData.dob && (
                <div className="text-sm text-gray-600 mt-1">
                  Your Age: {computeAge(formData.dob)}
                </div>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-800">Address</label>
              <div className="relative">
                <MapPinIcon className="h-5 w-5 absolute left-3 top-3 text-purple-400" />
                <input
                  type="text"
                  name="address"
                  onChange={handleChange}
                  value={formData.address}
                  placeholder="Enter your address"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-purple-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Postal Code */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-800">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                onChange={handleChange}
                value={formData.postalCode}
                placeholder="411041"
                className="w-full px-4 py-3 rounded-lg border-2 border-purple-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                required
              />
            </div>


            {/* Submit Button */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all 
                  ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-lg'}`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  'Register Now'
                )}
              </button>
            </div>
          </form>

          <p className="text-center text-gray-600">
            Already have an account?{' '}
            <a href="/" className="text-purple-600 hover:text-purple-800 font-semibold">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
