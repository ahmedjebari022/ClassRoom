import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../../stores/authStore";
import { registrationSchema } from "../../utils/userValidationSchema";

function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    agreeToTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const { register } = useAuthStore();

 
  const validateForm = async (data, schema) => {
    try {
      await schema.validate(data, { abortEarly: false });
      return { isValid: true, errors: {} };
    } catch (error) {
      const errors = {};
      error.inner.forEach((err) => {
        errors[err.path] = err.message;
      });
      return { isValid: false, errors };
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    const dataToValidate = {
      ...formData,
      confirmPassword: formData.confirmPassword,
    };

    
    const { isValid, errors } = await validateForm(
      dataToValidate,
      registrationSchema
    );

    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreeToTerms) {
      errors.agreeToTerms = "You must agree to the terms and conditions";
    }

    setFormErrors(errors);

    if (!isValid || Object.keys(errors).length > 0) {
      showToast("Please fix the errors in the form", "error");
      return;
    }

    setIsLoading(true);

    try {
      const result = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      if (result.success) {
        showToast("Registration successful! Welcome to ClassRoom.", "success");
        navigate("/");
      } else {
        // Handle server validation errors
        if (result.error && result.error.errors) {
          const serverErrors = {};
          result.error.errors.forEach((err) => {
            serverErrors[err.field] = err.message;
          });
          setFormErrors(serverErrors);
        }
        showToast(result.message || "Registration failed", "error");
      }
    } catch (error) {
      console.error("Registration error:", error);
      showToast("Network error. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Toast function
  const showToast = (message, type = "info") => {
    const existingToasts = document.querySelectorAll(".custom-toast");
    existingToasts.forEach((toast) => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    });

    const toast = document.createElement("div");
    toast.className = "toast toast-top toast-end custom-toast z-50";
    toast.innerHTML = `
      <div class="alert alert-${
        type === "error" ? "error" : type === "success" ? "success" : "info"
      } shadow-lg min-w-[300px]">
        <div class="flex items-center gap-2">
          ${
            type === "success"
              ? `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
             </svg>`
              : type === "error"
              ? `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
             </svg>`
              : `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m-1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
             </svg>`
          }
          <span class="text-sm font-medium">${message}</span>
        </div>
      </div>
    `;

    document.body.appendChild(toast);

    const dismissTime = type === "error" ? 6000 : 4000;
    setTimeout(() => {
      if (document.body.contains(toast)) {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(100%)";
        setTimeout(() => {
          if (document.body.contains(toast)) {
            document.body.removeChild(toast);
          }
        }, 300);
      }
    }, dismissTime);
  };

  return (
    <>
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce-slow {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
        
        @keyframes slideInRight {
          from { 
            opacity: 0; 
            transform: translateX(100%); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }

        .custom-toast {
          animation: slideInRight 0.3s ease-out;
          transition: all 0.3s ease-out;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-base-100 to-secondary/20 flex items-center justify-center p-4">
        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        </div>

        {/* Register Card */}
        <div className="card w-full max-w-lg bg-base-100 shadow-2xl relative z-10 animate-fade-in">
          <div className="card-body">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="bg-secondary text-secondary-content rounded-full w-20 h-20 animate-bounce-slow flex items-center justify-center">
                  <svg
                    className="w-10 h-10"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                    <path d="M3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762z" />
                  </svg>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-base-content">
                Join ClassRoom
              </h1>
              <p className="text-base-content/70 mt-2">
                Create your account to get started
              </p>
            </div>

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">First Name</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Enter your first name"
                    className={`input input-bordered w-full focus:input-primary transition-all duration-300 ${
                      formErrors.firstName ? "input-error" : ""
                    }`}
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                  {formErrors.firstName && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {formErrors.firstName}
                      </span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Last Name</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Enter your last name"
                    className={`input input-bordered w-full focus:input-primary transition-all duration-300 ${
                      formErrors.lastName ? "input-error" : ""
                    }`}
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                  {formErrors.lastName && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {formErrors.lastName}
                      </span>
                    </label>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email Address</span>
                </label>
                <div className="relative">
                  <input
                    name="email"
                    placeholder="Enter your email"
                    className={`input input-bordered w-full pl-12 focus:input-primary transition-all duration-300 ${
                      formErrors.email ? "input-error" : ""
                    }`}
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  <svg
                    className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
                {formErrors.email && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {formErrors.email}
                    </span>
                  </label>
                )}
              </div>

              {/* Role Selection */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">I am a...</span>
                </label>
                <select
                  name="role"
                  className={`select select-bordered w-full focus:select-primary transition-all duration-300 ${
                    formErrors.role ? "select-error" : ""
                  }`}
                  value={formData.role}
                  onChange={handleInputChange}
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                </select>
                {formErrors.role && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {formErrors.role}
                    </span>
                  </label>
                )}
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Create password"
                      className={`input input-bordered w-full pl-12 pr-12 focus:input-primary transition-all duration-300 ${
                        formErrors.password ? "input-error" : ""
                      }`}
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    <svg
                      className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-base-content transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  {formErrors.password && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {formErrors.password}
                      </span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Confirm Password
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm password"
                      className={`input input-bordered w-full pl-12 pr-12 focus:input-primary transition-all duration-300 ${
                        formErrors.confirmPassword ? "input-error" : ""
                      }`}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                    />
                    <svg
                      className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-base-content transition-colors"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  {formErrors.confirmPassword && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {formErrors.confirmPassword}
                      </span>
                    </label>
                  )}
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="form-control">
                <label className="label cursor-pointer justify-start">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    className={`checkbox checkbox-primary checkbox-sm ${
                      formErrors.agreeToTerms ? "checkbox-error" : ""
                    }`}
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                  />
                  <span className="label-text ml-3">
                    I agree to the{" "}
                    <Link to="/terms" className="link link-primary">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="link link-primary">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {formErrors.agreeToTerms && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {formErrors.agreeToTerms}
                    </span>
                  </label>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`btn btn-secondary w-full text-white transition-all duration-300 ${
                  !formData.agreeToTerms || isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:scale-[1.02] hover:shadow-lg active:scale-95"
                }`}
                disabled={isLoading || !formData.agreeToTerms}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <span className="loading loading-spinner loading-sm mr-2"></span>
                    Creating Account...
                  </div>
                ) : !formData.agreeToTerms ? (
                  <>
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.99-.833-2.46 0L3.354 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    Agree to Terms Required
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Create Account
                  </>
                )}
              </button>
            </form>

            {/* Sign In Link */}
            <div className="text-center mt-6">
              <p className="text-base-content/70">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="link link-primary hover:link-hover font-medium"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
