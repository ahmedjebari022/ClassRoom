import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../../stores/authStore";
import { loginSchema } from "../../utils/userValidationSchema"; // ✅ Import login schema

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({}); // ✅ Add form errors state
  const navigate = useNavigate();

  const { login } = useAuthStore();

  // ✅ ADD: Validate form data
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

    // ✅ ADD: Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ UPDATED: Use Yup validation instead of basic validation
    const { isValid, errors } = await validateForm(formData, loginSchema);
    setFormErrors(errors);

    if (!isValid) {
      showToast("Please fix the errors in the form", "error");
      return;
    }

    setIsLoading(true);

    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        console.log("Login successful");
        showToast("Login successful! Welcome back.", "success");
        navigate("/dashboard");
      } else {
        showToast(result.message || "Login failed", "error");
      }
    } catch (error) {
      console.error("Login error:", error);
      showToast("Network error. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ ADD: Toast function
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

        {/* Login Card */}
        <div className="card w-full max-w-md bg-base-100 shadow-2xl relative z-10 animate-fade-in">
          <div className="card-body">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="bg-primary text-primary-content rounded-full w-20 h-20 animate-bounce-slow flex items-center justify-center">
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
                Welcome Back
              </h1>
              <p className="text-base-content/70 mt-2">
                Sign in to your ClassRoom account
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
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
                {/* ✅ ADD: Error message */}
                {formErrors.email && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {formErrors.email}
                    </span>
                  </label>
                )}
              </div>

              {/* Password Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
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
                {/* ✅ ADD: Error message */}
                {formErrors.password && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {formErrors.password}
                    </span>
                  </label>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="label cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    className="checkbox checkbox-primary checkbox-sm"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                  />
                  <span className="label-text ml-2">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="link link-primary text-sm hover:link-hover"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button - FIXED */}
              <button
                type="submit"
                className={`btn btn-primary w-full text-white transition-all duration-300 ${
                  isLoading
                    ? "opacity-80 cursor-not-allowed"
                    : "hover:scale-[1.02] active:scale-95"
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm mr-2"></span>
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="divider">or continue with</div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <button className="btn btn-outline hover:btn-primary transition-all duration-300 hover:scale-[1.02]">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>
              <button className="btn btn-outline hover:btn-primary transition-all duration-300 hover:scale-[1.02]">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
                Facebook
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center mt-6">
              <p className="text-base-content/70">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="link link-primary hover:link-hover font-medium"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
