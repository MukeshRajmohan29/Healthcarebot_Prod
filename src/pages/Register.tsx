// ...existing code...
import React, { useState, useRef, useEffect } from 'react';
import { generateSessionId } from '../utils/session';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [privacyError, setPrivacyError] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [showPrivacy, setShowPrivacy] = useState(false);
  const navigate = useNavigate();
  const firstNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (firstNameRef.current) firstNameRef.current.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptPrivacy) {
      setPrivacyError('You must accept the privacy policy.');
      return;
    }
    setPrivacyError('');
    const sessionId = generateSessionId(firstName, lastName, dob);
    navigate('/chat', { state: { sessionId } });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50 px-2 py-4" role="main" aria-label="Registration page">
      <section aria-labelledby="register-heading" className="w-full max-w-md p-6 sm:p-8 bg-white/95 rounded-2xl shadow-2xl border border-blue-100 flex flex-col gap-4" role="form">
        <div className="flex flex-col gap-2 items-center mb-2">
              {/* ...no icon, revert to original layout... */}
              <h1 id="register-heading" className="text-2xl sm:text-3xl font-extrabold text-blue-900 tracking-tight">User Registration</h1>
              <p className="text-gray-700 text-base sm:text-lg text-center">Register to use CAPS Healthbot. All fields are required.</p>
        </div>
        <form onSubmit={handleSubmit} autoComplete="off" aria-describedby="register-desc" className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="firstName" className="block text-sm font-medium text-blue-900">First Name</label>
            <input
              ref={firstNameRef}
              id="firstName"
              name="firstName"
              type="text"
              className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base transition"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              required
              aria-required="true"
              aria-label="First Name"
              autoComplete="given-name"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="lastName" className="block text-sm font-medium text-blue-900">Last Name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base transition"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              required
              aria-required="true"
              aria-label="Last Name"
              autoComplete="family-name"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="dob" className="block text-sm font-medium text-blue-900">Date of Birth</label>
            <input
              id="dob"
              name="dob"
              type="date"
              className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base transition"
              value={dob}
              onChange={e => setDob(e.target.value)}
              required
              aria-required="true"
              aria-label="Date of Birth"
              autoComplete="bday"
            />
          </div>
          <div className="flex items-start gap-2">
            <input
              id="acceptPrivacy"
              name="acceptPrivacy"
              type="checkbox"
              checked={acceptPrivacy}
              onChange={e => setAcceptPrivacy(e.target.checked)}
              required
              aria-required="true"
              aria-describedby="privacy-desc"
              className="mt-1 focus:ring-blue-500 focus:ring-2 w-5 h-5 rounded border border-blue-300"
            />
            <label htmlFor="acceptPrivacy" className="text-sm text-blue-900 select-none">
              I accept the{' '}
              <button
                type="button"
                tabIndex={0}
                className="underline text-blue-700 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Show HIPAA privacy measures"
                onClick={() => setShowPrivacy(true)}
              >
                privacy measures (HIPAA)
              </button>
            </label>
          </div>
          <div id="privacy-desc" className="sr-only">You must accept the privacy policy to register.</div>
          {privacyError && (
            <div className="text-red-600 text-sm rounded bg-red-50 border border-red-200 px-3 py-2 mt-1" role="alert" aria-live="assertive">{privacyError}</div>
          )}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 text-base transition"
            aria-label="Register"
          >
            Register
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
              <iframe
                src="https://www.hhs.gov/hipaa/for-professionals/privacy/index.html"
                title="HIPAA Privacy"
                className="w-full h-64 border rounded mb-2"
                aria-label="HIPAA Privacy Information"
              ></iframe>
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
      </section>
    </main>
  );
};

export default Register;