import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/authStore"; // Import your auth store

function NavigationBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore(); // Get auth state
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Courses", href: "/courses" },
    { label: "Assignments", href: "/assignments" },
    { label: "Calendar", href: "/calendar" },
    { label: "Messages", href: "/messages" },
  ];

  const notifications = [
    {
      id: 1,
      title: "Assignment Due",
      message: "Data Structures homework due in 2 hours",
      type: "warning",
      time: "2h",
    },
    {
      id: 2,
      title: "New Course",
      message: "Machine Learning course available",
      type: "info",
      time: "1h",
    },
    {
      id: 3,
      title: "Grade Posted",
      message: "Your exam results are ready",
      type: "success",
      time: "30m",
    },
  ];

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 5px rgba(79, 70, 229, 0.3); }
          50% { box-shadow: 0 0 20px rgba(79, 70, 229, 0.5); }
        }
        
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-glow { animation: glow 2s infinite; }
        
        .nav-item {
          position: relative;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .nav-item:hover {
          transform: translateY(-2px);
          background: rgba(79, 70, 229, 0.1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .nav-item.active {
          background: rgba(79, 70, 229, 0.15);
          color: rgb(79, 70, 229);
          font-weight: 600;
        }
        
        .glass-effect {
          backdrop-filter: blur(12px);
          background: rgba(255, 255, 255, 0.9);
        }
        
        .notification-dot {
          animation: pulse 2s infinite;
        }
      `}</style>

      <div
        className={`navbar sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "glass-effect shadow-lg border-b border-primary/20"
            : "bg-base-100/95 backdrop-blur-sm"
        } min-h-[80px] px-6`}
      >
        {/* Left - Brand */}
        <div className="navbar-start">
          {/* Mobile Menu - Only show if authenticated */}
          {isAuthenticated && (
            <div className="dropdown lg:hidden">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-xl bg-base-100 rounded-2xl w-64 animate-slideDown"
              >
                {navItems.map((item, index) => (
                  <li key={index}>
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                          isActive
                            ? "bg-primary/15 text-primary font-semibold"
                            : "hover:bg-primary/10"
                        }`
                      }
                    >
                      <span className="font-medium">{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Brand */}
          <NavLink
            to="/"
            className="flex items-center gap-3 hover:scale-105 transition-transform duration-300"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center animate-glow">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ClassRoom
            </span>
          </NavLink>
        </div>

        {/* Center - Navigation Items (Only show if authenticated) */}
        {isAuthenticated && (
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal gap-2">
              {navItems.map((item, index) => (
                <li key={index}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      `nav-item px-6 py-3 rounded-xl font-medium text-base ${
                        isActive ? "active" : ""
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Right - User Actions */}
        <div className="navbar-end flex items-center gap-3">
          {/* Theme Toggle */}
          <label className="swap swap-rotate btn btn-ghost btn-circle hover:bg-primary/10 transition-all duration-300">
            <input type="checkbox" className="theme-controller" value="dark" />
            <svg
              className="swap-off fill-current w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>
            <svg
              className="swap-on fill-current w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
          </label>

          {/* Conditional Rendering: Auth Buttons OR User Profile */}
          {!isAuthenticated ? (
            /* Premium Enhanced Login/Register buttons */
            <div className="flex items-center gap-3">
              {/* Login Button */}
              <NavLink
                to="/login"
                className="group relative btn btn-ghost hover:btn-outline hover:btn-primary transition-all duration-300 gap-2 px-6 py-3 rounded-xl border-2 border-transparent hover:border-primary/20"
              >
                <svg
                  className="w-5 h-5 transition-transform group-hover:scale-110"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span className="font-semibold text-base">Login</span>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </NavLink>

              {/* Register Button */}
              <NavLink
                to="/register"
                className="group relative btn btn-primary hover:btn-primary-focus transition-all duration-300 gap-2 px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 bg-gradient-to-r from-primary to-secondary border-0 overflow-hidden"
              >
                <svg
                  className="w-5 h-5 transition-transform group-hover:rotate-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                <span className="font-semibold text-base text-white">
                  Get Started
                </span>

                {/* Animated shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </NavLink>
            </div>
          ) : (
            /* Show authenticated user content */
            <>
              {/* Notifications */}
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle hover:bg-primary/10 transition-all duration-300"
                >
                  <div className="indicator">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 17h5l-5 5v-5zM11 17h4v5l-5-5h1zm-7-5a7 7 0 1114 0v4l2 2v1H2v-1l2-2v-4z"
                      />
                    </svg>
                    <span className="badge badge-xs badge-error indicator-item notification-dot">
                      {notifications.length}
                    </span>
                  </div>
                </div>
                <div
                  tabIndex={0}
                  className="mt-3 z-[1] card card-compact dropdown-content w-80 bg-base-100 shadow-2xl rounded-2xl animate-slideDown"
                >
                  <div className="card-body">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-lg flex items-center gap-2">
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
                            d="M15 17h5l-5 5v-5zM11 17h4v5l-5-5h1zm-7-5a7 7 0 1114 0v4l2 2v1H2v-1l2-2v-4z"
                          />
                        </svg>
                        Notifications
                      </h3>
                      <button className="btn btn-ghost btn-xs">
                        Clear all
                      </button>
                    </div>
                    <div className="space-y-3 max-h-72 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`alert alert-${notif.type} rounded-xl cursor-pointer hover:scale-[1.02] transition-transform duration-200`}
                        >
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">
                              {notif.title}
                            </h4>
                            <p className="text-xs opacity-80">
                              {notif.message}
                            </p>
                            <span className="text-xs opacity-60">
                              {notif.time} ago
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="divider my-2"></div>
                    <button className="btn btn-primary btn-sm w-full">
                      View All Notifications
                    </button>
                  </div>
                </div>
              </div>

              {/* Profile Dropdown with Real User Data */}
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar hover:scale-105 transition-all duration-300"
                >
                  <div className="w-10 rounded-full ring-2 ring-primary/30 hover:ring-primary/60 transition-all duration-300">
                    <img
                      alt="Profile"
                      src={
                        user?.avatar ||
                        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                      }
                    />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 z-[1] p-4 shadow-2xl bg-base-100 rounded-2xl w-72 animate-slideDown"
                >
                  <li className="menu-title">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="avatar">
                        <div className="w-10 rounded-full">
                          <img
                            src={
                              user?.avatar ||
                              "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <span className="font-bold text-base">
                          {user?.firstName} {user?.lastName}
                        </span>
                        <p className="text-sm text-base-content/60">
                          {user?.email}
                        </p>
                        {user?.role && (
                          <p className="text-xs text-primary font-medium capitalize">
                            {user.role}
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                  <div className="divider my-2"></div>
                  <li>
                    <NavLink
                      to="/profile"
                      className="justify-between py-3 hover:bg-primary/10 rounded-xl transition-all duration-300"
                    >
                      <span className="flex items-center gap-3">
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
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Profile
                      </span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/settings"
                      className="justify-between py-3 hover:bg-primary/10 rounded-xl transition-all duration-300"
                    >
                      <span className="flex items-center gap-3">
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
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        Settings
                      </span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard"
                      className="justify-between py-3 hover:bg-primary/10 rounded-xl transition-all duration-300"
                    >
                      <span className="flex items-center gap-3">
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
                      </span>
                    </NavLink>
                  </li>
                  <div className="divider my-2"></div>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="text-error py-3 hover:bg-error/10 rounded-xl transition-all duration-300 w-full text-left"
                    >
                      <span className="flex items-center gap-3">
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
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Logout
                      </span>
                    </button>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default NavigationBar;
