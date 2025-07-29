import React, { useState } from 'react';
import { User, Calendar, Calculator } from 'lucide-react';
import { cn } from '../utils/cn';

const UserRegistration = ({ onRegister, healthcareContext, privacyStyle }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [privacyError, setPrivacyError] = useState('');
  const [showPrivacy, setShowPrivacy] = useState(false);

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const age = calculateAge(formData.dateOfBirth);
      if (age < 13) {
        newErrors.dateOfBirth = 'You must be at least 13 years old to use this service';
      } else if (age > 120) {
        newErrors.dateOfBirth = 'Please enter a valid date of birth';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    if (!acceptPrivacy) {
      setPrivacyError('You must accept the privacy policy.');
      return;
    }
    setPrivacyError('');
    
    setIsSubmitting(true);
    
    try {
      const age = calculateAge(formData.dateOfBirth);
      const userDetails = {
        ...formData,
        age,
        dateOfBirth: formData.dateOfBirth,
        fullName: `${formData.firstName} ${formData.lastName}`
      };
      await onRegister(userDetails);
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="card">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-primary-900" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to CAPS Healthbot
            </h1>
            <p className="text-gray-900">
              Please provide your information to start your personalized CAPS Healthbot session
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-900 mb-1">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={cn(
                  "input-field",
                  errors.firstName && "border-red-300 focus:ring-red-500 focus:border-red-500"
                )}
                placeholder="Enter your first name"
              />
              {errors.firstName && (
                <p className="text-red-800 text-xs mt-1 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 mr-1 text-red-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" /></svg>{errors.firstName}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-900 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={cn(
                  "input-field",
                  errors.lastName && "border-red-300 focus:ring-red-500 focus:border-red-500"
                )}
                placeholder="Enter your last name"
              />
              {errors.lastName && (
                <p className="text-red-800 text-xs mt-1 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 mr-1 text-red-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" /></svg>{errors.lastName}</p>
              )}
            </div>

            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-900 mb-1">
                Date of Birth *
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className={cn(
                    "input-field pr-10",
                    errors.dateOfBirth && "border-red-300 focus:ring-red-500 focus:border-red-500"
                  )}
                  max={new Date().toISOString().split('T')[0]}
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              {errors.dateOfBirth && (
                <p className="text-red-800 text-xs mt-1 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 mr-1 text-red-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" /></svg>{errors.dateOfBirth}</p>
              )}
              {formData.dateOfBirth && !errors.dateOfBirth && (
                <p className="text-green-800 text-xs mt-1 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 mr-1 text-green-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Age: {calculateAge(formData.dateOfBirth)} years old</p>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
              <h2 className="text-sm font-medium text-primary-900 mb-2">Session Information</h2>
              <div className="text-xs text-primary-900 space-y-1">
                <p className="leading-relaxed"><strong>Healthcare Context:</strong> {healthcareContext && healthcareContext.charAt(0).toUpperCase() + healthcareContext.slice(1)}</p>
                <p className="leading-relaxed"><strong>Privacy Style:</strong> {privacyStyle && privacyStyle.charAt(0).toUpperCase() + privacyStyle.slice(1)}</p>
                <p className="leading-relaxed"><strong>Session ID:</strong> Will be generated based on your information</p>
              </div>
            </div>

            {/* Privacy Policy Checkbox - moved and centered at the end */}
            <div className="flex flex-col items-center justify-center mt-6">
              <div className="flex items-center gap-2 text-center">
                <input
                  id="acceptPrivacy"
                  name="acceptPrivacy"
                  type="checkbox"
                  checked={acceptPrivacy}
                  onChange={e => setAcceptPrivacy(e.target.checked)}
                  required
                  aria-required="true"
                  aria-describedby="privacy-desc"
                  className="focus:ring-blue-500 focus:ring-2 w-5 h-5 rounded border border-blue-300"
                />
                <label htmlFor="acceptPrivacy" className="text-sm text-blue-900 select-none">
                  By clicking <strong>“Agree &amp; continue”</strong> you attest that you are at least 18 years old and agree to the{' '}
                  <a
                    href="/terms.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-primary-900 hover:text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-900"
                  >
                    Terms of Use
                  </a>
                  {' '}and{' '}
                  <a
                    href="/privacy.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-primary-900 hover:text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-900"
                  >
                    Privacy Policy
                  </a>.
                </label>
              </div>
              <div id="privacy-desc" className="sr-only">You must accept the terms and privacy policy to register.</div>
              {privacyError && (
                <div className="text-red-600 text-sm rounded bg-red-50 border border-red-200 px-3 py-2 mt-2 w-full text-center" role="alert" aria-live="assertive">{privacyError}</div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "btn-primary w-full bg-primary-900 hover:bg-primary-900 border border-primary-900 text-white",
                isSubmitting && "opacity-50 cursor-not-allowed"
              )}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Starting Session...
                </div>
              ) : (
                'Start Healthcare Session'
              )}
            </button>
          </form>
        {/* Accessible modal for privacy info */}
        {showPrivacy && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="privacy-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full relative outline-none" tabIndex={-1}>
              <h2 id="privacy-modal-title" className="text-lg font-bold mb-2 text-blue-900">HIPAA Privacy Measures</h2>
              <p className="mb-4 text-blue-900 text-sm">
                For details on how your health information is protected, please see the official HIPAA privacy page below. This will open in a new tab.
              </p>
              <a
                href="https://www.hhs.gov/hipaa/for-professionals/privacy/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-900 rounded hover:bg-blue-200 underline"
              >
                View HIPAA Privacy Policy
              </a>
              <button
                onClick={() => setShowPrivacy(false)}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                aria-label="Close privacy information"
              >
                Close
              </button>
            </div>
          </div>
        )}

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-900 leading-relaxed">
              Your information is used to create a unique session ID and provide personalized care.
              <br />
              All data is encrypted and handled according to our privacy policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegistration; 