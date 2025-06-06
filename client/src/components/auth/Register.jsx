import React, { useState } from 'react'

function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    agreeToTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNextStep = () => {
    if (currentStep < 2) setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log('Registration attempt:', formData);
    }, 2000);
  };

  const isStep1Valid = formData.firstName && formData.lastName && formData.email;
  const isStep2Valid = formData.password && formData.confirmPassword && formData.agreeToTerms;

  return (
    <>
      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
        
        .animate-fade-in-left {
          animation: fade-in-left 0.5s ease-out;
        }
        
        .animate-fade-in-right {
          animation: fade-in-right 0.5s ease-out;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
      
      <div className="min-h-screen bg-gradient-to-br from-secondary/20 via-base-100 to-accent/20 flex items-center justify-center p-4">
        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-secondary/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/5 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
        </div>

        {/* Registration Card */}
        <div className="card w-full max-w-lg bg-base-100 shadow-2xl relative z-10 animate-slide-up">
          <div className="card-body">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="bg-secondary text-secondary-content rounded-full w-20 h-20 animate-float flex items-center justify-center">
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-base-content">Join ClassRoom</h1>
              <p className="text-base-content/70 mt-2">Create your learning account</p>
            </div>

            {/* Progress Steps */}
            <div className="flex justify-center mb-8">
              <ul className="steps steps-horizontal">
                <li className={`step ${currentStep >= 1 ? 'step-primary' : ''}`}>Personal Info</li>
                <li className={`step ${currentStep >= 2 ? 'step-primary' : ''}`}>Account Setup</li>
              </ul>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in-left">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">First Name</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="firstName"
                          placeholder="Enter first name"
                          className="input input-bordered w-full pl-12 focus:input-secondary transition-all duration-300"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                        />
                        <svg className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                      </div>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Last Name</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="lastName"
                          placeholder="Enter last name"
                          className="input input-bordered w-full pl-12 focus:input-secondary transition-all duration-300"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                        />
                        <svg className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Email Address</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        className="input input-bordered w-full pl-12 focus:input-secondary transition-all duration-300"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                      <svg className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                      </svg>
                    </div>
                  </div>

                  {/* Role Selection */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">I am a</span>
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="label cursor-pointer">
                        <input
                          type="radio"
                          name="role"
                          value="student"
                          className="radio radio-secondary"
                          checked={formData.role === 'student'}
                          onChange={handleInputChange}
                        />
                        <span className="label-text">Student</span>
                      </label>
                      <label className="label cursor-pointer">
                        <input
                          type="radio"
                          name="role"
                          value="instructor"
                          className="radio radio-secondary"
                          checked={formData.role === 'instructor'}
                          onChange={handleInputChange}
                        />
                        <span className="label-text">Instructor</span>
                      </label>
                    </div>
                  </div>

                  {/* Next Button */}
                  <button
                    type="button"
                    className={`btn btn-secondary w-full text-white transition-all duration-300 hover:scale-[1.02] ${!isStep1Valid ? 'btn-disabled' : ''}`}
                    onClick={handleNextStep}
                    disabled={!isStep1Valid}
                  >
                    Continue
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              )}

              {/* Step 2: Account Setup */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in-right">
                  {/* Password Field */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Password</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Create a password"
                        className="input input-bordered w-full pl-12 pr-12 focus:input-secondary transition-all duration-300"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                      <svg className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                      </svg>
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-base-content transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Confirm Password</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        className="input input-bordered w-full pl-12 pr-12 focus:input-secondary transition-all duration-300"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                      />
                      <svg className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-base-content transition-colors"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                          </svg>
                        )}
                      </button>
                    </div>
                    {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <label className="label">
                        <span className="label-text-alt text-error">Passwords don't match</span>
                      </label>
                    )}
                  </div>

                  {/* Terms Agreement */}
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        className="checkbox checkbox-secondary checkbox-sm"
                        checked={formData.agreeToTerms}
                        onChange={handleInputChange}
                      />
                      <span className="label-text ml-2">
                        I agree to the{' '}
                        <a href="/terms" className="link link-secondary hover:link-hover">Terms of Service</a>
                        {' '}and{' '}
                        <a href="/privacy" className="link link-secondary hover:link-hover">Privacy Policy</a>
                      </span>
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      type="button"
                      className="btn btn-outline flex-1 transition-all duration-300 hover:scale-[1.02]"
                      onClick={handlePrevStep}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                      </svg>
                      Back
                    </button>
                    <button
                      type="submit"
                      className={`btn btn-secondary flex-1 text-white ${isLoading ? 'loading' : ''} transition-all duration-300 hover:scale-[1.02] ${!isStep2Valid ? 'btn-disabled' : ''}`}
                      disabled={isLoading || !isStep2Valid}
                    >
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>
                  </div>
                </div>
              )}
            </form>

            {/* Sign In Link */}
            <div className="text-center mt-6">
              <p className="text-base-content/70">
                Already have an account?{' '}
                <a href="/login" className="link link-secondary hover:link-hover font-medium">
                  Sign in here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register