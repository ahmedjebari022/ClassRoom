import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/authStore";
import authService from "../../services/authService";
import {
  profileUpdateSchema,
  passwordChangeSchema,
} from "../../utils/userValidationSchema";

function Profile() {
  const { user, isAuthenticated, isLoading, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
    website: "",
  });
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Initialize form data when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
        location: user.location || "",
        website: user.website || "",
      });
    }
  }, [user]);

  // ✅ UPDATED: Validate form data before saving
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

  // ✅ ADD: Handle input changes for profile form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // ✅ ADD: Handle input changes for password form
  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // ✅ UPDATED: Handle save with validation
  const handleSave = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    // Validate form data
    const { isValid, errors } = await validateForm(
      formData,
      profileUpdateSchema
    );
    setFormErrors(errors);

    if (!isValid) {
      showToast("Please fix the errors in the form", "error");
      return;
    }

    setIsLoadingSave(true);
    try {
      console.log("🚀 Current user before update:", user);
      console.log("📝 Form data being sent:", formData);

      const result = await authService.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        bio: formData.bio,
        location: formData.location,
        website: formData.website,
      });

      console.log("📥 API Response:", result);

      if (result.success) {
        console.log("🔄 Updating store with:", result.data);

        // Update the store
        updateUser(result.data);

        console.log("✅ Store updated, new user should be:", result.data);

        setIsEditing(false);
        setFormErrors({});
        showToast("Profile updated successfully!", "success");
      } else {
        // Handle server validation errors
        if (result.error && result.error.errors) {
          const serverErrors = {};
          result.error.errors.forEach((err) => {
            serverErrors[err.field] = err.message;
          });
          setFormErrors(serverErrors);
        }
        showToast(result.message || "Failed to update profile", "error");
      }
    } catch (error) {
      console.error("💥 Profile update error:", error);
      showToast("Network error. Please try again.", "error");
    } finally {
      setIsLoadingSave(false);
    }
  };

  // ✅ UPDATED: Handle password change with validation
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // Validate password data
    const { isValid, errors } = await validateForm(
      passwordData,
      passwordChangeSchema
    );
    setPasswordErrors(errors);

    if (!isValid) {
      showToast("Please fix the errors in the password form", "error");
      return;
    }

    setIsLoadingPassword(true);
    try {
      const result = await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });

      if (result.success) {
        showToast("Password changed successfully!", "success");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setPasswordErrors({});
      } else {
        // Handle server validation errors
        if (result.error && result.error.errors) {
          const serverErrors = {};
          result.error.errors.forEach((err) => {
            serverErrors[err.field] = err.message;
          });
          setPasswordErrors(serverErrors);
        }
        showToast(result.message || "Failed to change password", "error");
      }
    } catch (error) {
      console.error("Error changing password:", error);

      if (error.response?.status === 400) {
        showToast("Current password is incorrect", "error");
      } else if (error.response?.status === 401) {
        showToast("Session expired. Please login again.", "error");
      } else {
        showToast("Network error. Please try again.", "error");
      }
    } finally {
      setIsLoadingPassword(false);
    }
  };

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

  const tabs = [
    {
      id: "profile",
      label: "Profile Info",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    },
    {
      id: "security",
      label: "Security",
      icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
    },
    {
      id: "preferences",
      label: "Preferences",
      icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <style>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-slideInUp { animation: slideInUp 0.6s ease-out; }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-slideInLeft { animation: slideInLeft 0.4s ease-out; }
        
        .profile-card {
          background: linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(147, 51, 234, 0.05) 100%);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(79, 70, 229, 0.2);
        }
        
        .tab-active {
          background: linear-gradient(135deg, rgb(79, 70, 229) 0%, rgb(147, 51, 234) 100%);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(79, 70, 229, 0.3);
        }
        
        .avatar-glow {
          box-shadow: 0 0 30px rgba(79, 70, 229, 0.4);
        }

        .custom-toast {
          animation: slideInRight 0.3s ease-out;
          transition: all 0.3s ease-out;
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
        
        .alert {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300 p-6 pt-24">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fadeIn">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              My Profile
            </h1>
            <p className="text-base-content/60 text-lg">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Profile Summary Card */}
            <div className="lg:col-span-4 animate-slideInLeft">
              <div className="profile-card rounded-3xl p-8 text-center sticky top-6">
                {/* Avatar Section */}
                <div className="relative mb-6">
                  <div className="avatar online">
                    <div className="w-32 h-32 rounded-full ring-4 ring-primary ring-offset-base-100 ring-offset-4 avatar-glow">
                      <img
                        src={
                          user.avatar ||
                          "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                        }
                        alt="Profile"
                        className="rounded-full"
                      />
                    </div>
                  </div>
                  <button className="btn btn-circle btn-primary btn-sm absolute bottom-2 right-8 shadow-lg hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </button>
                </div>

                {/* User Info */}
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-base-content">
                      {user.firstName} {user.lastName}
                    </h2>
                    <p className="text-base-content/60">{user.email}</p>
                    <div className="badge badge-primary badge-lg mt-2 capitalize">
                      {user.role || "Student"}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="stat bg-base-100/50 rounded-xl p-4">
                      <div className="stat-value text-2xl text-primary">5</div>
                      <div className="stat-title text-xs">Courses</div>
                    </div>
                    <div className="stat bg-base-100/50 rounded-xl p-4">
                      <div className="stat-value text-2xl text-secondary">
                        12
                      </div>
                      <div className="stat-title text-xs">Assignments</div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-3 mt-6">
                    <button className="btn btn-outline btn-primary w-full rounded-xl hover:scale-105 transition-all duration-300">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      Message
                    </button>
                    <button className="btn btn-outline btn-secondary w-full rounded-xl hover:scale-105 transition-all duration-300">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                      Dashboard
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-8 animate-slideInUp">
              {/* Tabs */}
              <div className="tabs tabs-boxed bg-base-100/80 backdrop-blur-sm rounded-2xl p-2 mb-6 shadow-lg">
                {tabs.map((tab, index) => (
                  <button
                    key={tab.id}
                    className={`tab tab-lg flex-1 rounded-xl transition-all duration-300 ${
                      activeTab === tab.id
                        ? "tab-active"
                        : "hover:bg-primary/10"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d={tab.icon}
                      />
                    </svg>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="bg-base-100/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                {/* Profile Tab */}
                {activeTab === "profile" && (
                  <div className="animate-fadeIn">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-bold">
                        Profile Information
                      </h3>
                      <button
                        onClick={handleSave}
                        disabled={isLoadingSave}
                        className={`btn ${
                          isEditing ? "btn-success" : "btn-primary"
                        } rounded-xl hover:scale-105 transition-all duration-300`}
                      >
                        {isLoadingSave ? (
                          <>
                            <span className="loading loading-spinner loading-sm"></span>
                            Saving...
                          </>
                        ) : isEditing ? (
                          <>
                            <svg
                              className="w-4 h-4"
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
                            Save Changes
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            Edit Profile
                          </>
                        )}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="form-control w-full">
                        <label className="label">
                          <span className="label-text font-semibold text-base">
                            First Name
                          </span>
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`input input-bordered w-full rounded-xl focus:input-primary transition-all duration-300 ${
                            formErrors.firstName ? "input-error" : ""
                          }`}
                        />
                        {formErrors.firstName && (
                          <label className="label">
                            <span className="label-text-alt text-error">
                              {formErrors.firstName}
                            </span>
                          </label>
                        )}
                      </div>

                      <div className="form-control w-full">
                        <label className="label">
                          <span className="label-text font-semibold text-base">
                            Last Name
                          </span>
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`input input-bordered w-full rounded-xl focus:input-primary transition-all duration-300 ${
                            formErrors.lastName ? "input-error" : ""
                          }`}
                        />
                        {formErrors.lastName && (
                          <label className="label">
                            <span className="label-text-alt text-error">
                              {formErrors.lastName}
                            </span>
                          </label>
                        )}
                      </div>

                      <div className="form-control w-full md:col-span-2">
                        <label className="label">
                          <span className="label-text font-semibold text-base">
                            Email Address
                          </span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`input input-bordered w-full rounded-xl focus:input-primary transition-all duration-300 ${
                            formErrors.email ? "input-error" : ""
                          }`}
                        />
                        {formErrors.email && (
                          <label className="label">
                            <span className="label-text-alt text-error">
                              {formErrors.email}
                            </span>
                          </label>
                        )}
                      </div>

                      <div className="form-control w-full">
                        <label className="label">
                          <span className="label-text font-semibold text-base">
                            Phone Number
                          </span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="Enter your phone number"
                          className={`input input-bordered w-full rounded-xl focus:input-primary transition-all duration-300 ${
                            formErrors.phone ? "input-error" : ""
                          }`}
                        />
                        {formErrors.phone && (
                          <label className="label">
                            <span className="label-text-alt text-error">
                              {formErrors.phone}
                            </span>
                          </label>
                        )}
                      </div>

                      <div className="form-control w-full">
                        <label className="label">
                          <span className="label-text font-semibold text-base">
                            Location
                          </span>
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="City, Country"
                          className={`input input-bordered w-full rounded-xl focus:input-primary transition-all duration-300 ${
                            formErrors.location ? "input-error" : ""
                          }`}
                        />
                        {formErrors.location && (
                          <label className="label">
                            <span className="label-text-alt text-error">
                              {formErrors.location}
                            </span>
                          </label>
                        )}
                      </div>

                      <div className="form-control w-full md:col-span-2">
                        <label className="label">
                          <span className="label-text font-semibold text-base">
                            Bio
                          </span>
                        </label>
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="Tell us about yourself..."
                          className="textarea textarea-bordered w-full rounded-xl focus:textarea-primary transition-all duration-300 min-h-[100px] resize-none"
                        />
                      </div>

                      <div className="form-control w-full md:col-span-2">
                        <label className="label">
                          <span className="label-text font-semibold text-base">
                            Website
                          </span>
                        </label>
                        <input
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="https://yourwebsite.com"
                          className={`input input-bordered w-full rounded-xl focus:input-primary transition-all duration-300 ${
                            formErrors.website ? "input-error" : ""
                          }`}
                        />
                        {formErrors.website && (
                          <label className="label">
                            <span className="label-text-alt text-error">
                              {formErrors.website}
                            </span>
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Cancel button when editing */}
                    {isEditing && (
                      <div className="flex gap-4 mt-6 animate-slideInUp">
                        <button
                          onClick={() => {
                            setFormData({
                              firstName: user.firstName || "",
                              lastName: user.lastName || "",
                              email: user.email || "",
                              phone: user.phone || "",
                              bio: user.bio || "",
                              location: user.location || "",
                              website: user.website || "",
                            });
                            setIsEditing(false);
                          }}
                          className="btn btn-outline flex-1 rounded-xl hover:scale-105 transition-all duration-300"
                          disabled={isLoadingSave}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === "security" && (
                  <div className="animate-fadeIn">
                    <h3 className="text-2xl font-bold mb-6">
                      Security Settings
                    </h3>
                    <div className="space-y-6">
                      <div className="card bg-base-200 rounded-xl p-6">
                        <h4 className="font-semibold text-lg mb-6">
                          Change Password
                        </h4>
                        <form
                          onSubmit={handlePasswordChange}
                          className="grid grid-cols-1 gap-4"
                        >
                          <div className="form-control w-full">
                            <label className="label">
                              <span className="label-text font-semibold text-base">
                                Current Password
                              </span>
                            </label>
                            <input
                              type="password"
                              name="currentPassword"
                              value={passwordData.currentPassword}
                              onChange={handlePasswordInputChange}
                              className={`input input-bordered w-full rounded-xl focus:input-primary transition-all duration-300 ${
                                passwordErrors.currentPassword
                                  ? "input-error"
                                  : ""
                              }`}
                              placeholder="Enter current password"
                              
                              
                            />
                            {passwordErrors.currentPassword && (
                              <label className="label">
                                <span className="label-text-alt text-error">
                                  {passwordErrors.currentPassword}
                                </span>
                              </label>
                            )}
                          </div>

                          <div className="form-control w-full">
                            <label className="label">
                              <span className="label-text font-semibold text-base">
                                New Password
                              </span>
                            </label>
                            <input
                              type="password"
                              name="newPassword"
                              value={passwordData.newPassword}
                              onChange={handlePasswordInputChange}
                              className={`input input-bordered w-full rounded-xl focus:input-primary transition-all duration-300 ${
                                passwordErrors.newPassword ? "input-error" : ""
                              }`}
                              placeholder="Enter new password"
                              
                              
                              
                            />
                            <label className="label">
                              <span className="label-text-alt text-base-content/60">
                                Must be at least 6 characters with uppercase,
                                lowercase, and number
                              </span>
                            </label>
                            {passwordErrors.newPassword && (
                              <label className="label">
                                <span className="label-text-alt text-error">
                                  {passwordErrors.newPassword}
                                </span>
                              </label>
                            )}
                          </div>

                          <div className="form-control w-full">
                            <label className="label">
                              <span className="label-text font-semibold text-base">
                                Confirm New Password
                              </span>
                            </label>
                            <input
                              type="password"
                              name="confirmPassword"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordInputChange}
                              className={`input input-bordered w-full rounded-xl focus:input-primary transition-all duration-300 ${
                                passwordErrors.confirmPassword
                                  ? "input-error"
                                  : ""
                              }`}
                              placeholder="Confirm new password"
                             
                            />
                            {passwordErrors.confirmPassword && (
                              <label className="label">
                                <span className="label-text-alt text-error">
                                  {passwordErrors.confirmPassword}
                                </span>
                              </label>
                            )}
                          </div>

                          <div className="pt-4">
                            <button
                              type="submit"
                              className="btn btn-primary w-full md:w-auto rounded-xl hover:scale-105 transition-all duration-300"
                              disabled={isLoadingPassword}
                            >
                              {isLoadingPassword ? (
                                <>
                                  <span className="loading loading-spinner loading-sm"></span>
                                  Updating...
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
                                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    />
                                  </svg>
                                  Update Password
                                </>
                              )}
                            </button>
                          </div>
                        </form>
                      </div>

                      <div className="card bg-base-200 rounded-xl p-6">
                        <h4 className="font-semibold text-lg mb-4">
                          Two-Factor Authentication
                        </h4>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex-1">
                            <p className="text-base-content/80 text-base">
                              Add an extra layer of security to your account
                            </p>
                            <p className="text-sm text-base-content/60 mt-1">
                              Protect your account with 2FA verification
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium">
                              Disabled
                            </span>
                            <input
                              type="checkbox"
                              className="toggle toggle-primary toggle-lg"
                            />
                            <span className="text-sm font-medium">Enabled</span>
                          </div>
                        </div>
                      </div>

                      <div className="card bg-base-200 rounded-xl p-6">
                        <h4 className="font-semibold text-lg mb-4">
                          Login Sessions
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-base-100 rounded-lg">
                            <div>
                              <p className="font-medium">Current Session</p>
                              <p className="text-sm text-base-content/60">
                                Chrome on Windows • Active now
                              </p>
                            </div>
                            <div className="badge badge-success">Active</div>
                          </div>
                          <button className="btn btn-outline btn-error w-full rounded-xl hover:scale-105 transition-all duration-300">
                            Sign out of all other sessions
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Preferences Tab */}
                {activeTab === "preferences" && (
                  <div className="animate-fadeIn">
                    <h3 className="text-2xl font-bold mb-6">Preferences</h3>
                    <div className="space-y-6">
                      <div className="card bg-base-200 rounded-xl p-6">
                        <h4 className="font-semibold text-lg mb-6">
                          Notifications
                        </h4>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-base-100 rounded-lg">
                            <div>
                              <span className="font-medium">
                                Email notifications
                              </span>
                              <p className="text-sm text-base-content/60">
                                Receive updates via email
                              </p>
                            </div>
                            <input
                              type="checkbox"
                              className="toggle toggle-primary"
                              defaultChecked
                            />
                          </div>
                          <div className="flex items-center justify-between p-3 bg-base-100 rounded-lg">
                            <div>
                              <span className="font-medium">
                                Assignment reminders
                              </span>
                              <p className="text-sm text-base-content/60">
                                Get notified about upcoming deadlines
                              </p>
                            </div>
                            <input
                              type="checkbox"
                              className="toggle toggle-primary"
                              defaultChecked
                            />
                          </div>
                          <div className="flex items-center justify-between p-3 bg-base-100 rounded-lg">
                            <div>
                              <span className="font-medium">
                                Course updates
                              </span>
                              <p className="text-sm text-base-content/60">
                                Stay informed about course changes
                              </p>
                            </div>
                            <input
                              type="checkbox"
                              className="toggle toggle-primary"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="card bg-base-200 rounded-xl p-6">
                        <h4 className="font-semibold text-lg mb-6">
                          Language & Region
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="form-control w-full">
                            <label className="label">
                              <span className="label-text font-semibold text-base">
                                Language
                              </span>
                            </label>
                            <select className="select select-bordered w-full rounded-xl focus:select-primary transition-all duration-300">
                              <option>English</option>
                              <option>Spanish</option>
                              <option>French</option>
                              <option>Arabic</option>
                            </select>
                          </div>
                          <div className="form-control w-full">
                            <label className="label">
                              <span className="label-text font-semibold text-base">
                                Timezone
                              </span>
                            </label>
                            <select className="select select-bordered w-full rounded-xl focus:select-primary transition-all duration-300">
                              <option>UTC-5 (Eastern)</option>
                              <option>UTC-8 (Pacific)</option>
                              <option>UTC+0 (GMT)</option>
                              <option>UTC+1 (CET)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
