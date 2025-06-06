import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

function Hero({ isActive }) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const dynamicWords = ["Learning", "Teaching", "Growing", "Succeeding"];

  useEffect(() => {
    if (isActive) {
      setIsVisible(true);
    }

    // Animate dynamic words
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % dynamicWords.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-fadeInLeft { animation: fadeInLeft 0.8s ease-out forwards; }
        .animate-fadeInRight { animation: fadeInRight 0.8s ease-out forwards; }
        .animate-scaleIn { animation: scaleIn 0.6s ease-out forwards; }
        .animate-pulse-slow { animation: pulse 3s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce 2s infinite; }
        
        .text-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .card-glass {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .hero-blob {
          border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
          animation: float 8s ease-in-out infinite;
        }
      `}</style>

      <section className="hero w-full h-full bg-gradient-to-br from-base-100 via-base-200 to-base-300 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          {/* Animated Blobs */}
          <div className="hero-blob absolute top-20 left-10 w-32 h-32 bg-primary/20 animate-float"></div>
          <div
            className="hero-blob absolute top-40 right-20 w-24 h-24 bg-secondary/20 animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="hero-blob absolute bottom-20 left-1/4 w-40 h-40 bg-accent/20 animate-float"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>

        <div className="hero-content text-center relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            {/* Left Side - Content */}
            <div
              className={`text-left space-y-8 ${
                isVisible ? "animate-fadeInLeft" : "opacity-0"
              }`}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium animate-scaleIn">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                #1 Online Learning Platform
              </div>

              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  <span className="text-gradient">Transform</span>
                  <br />
                  Your
                  <span className="inline-block ml-4 text-primary animate-pulse-slow">
                    {dynamicWords[currentWordIndex]}
                  </span>
                  <br />
                  Experience
                </h1>

                <p className="text-xl lg:text-2xl text-base-content/70 leading-relaxed max-w-2xl">
                  Join thousands of students and educators in our modern,
                  interactive learning environment. Where knowledge meets
                  innovation.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <NavLink
                  to="/register"
                  className="btn btn-primary btn-lg text-white px-8 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 animate-scaleIn"
                  style={{ animationDelay: "0.3s" }}
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Get Started Free
                </NavLink>

                <button
                  className="btn btn-outline btn-lg px-8 py-4 rounded-2xl hover:bg-base-content hover:text-base-100 transform hover:scale-105 transition-all duration-300 animate-scaleIn group"
                  style={{ animationDelay: "0.5s" }}
                >
                  <svg
                    className="w-5 h-5 mr-2 group-hover:animate-bounce"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Watch Demo
                </button>
              </div>

              {/* Stats */}
              <div
                className="grid grid-cols-3 gap-6 pt-8 animate-fadeInUp"
                style={{ animationDelay: "0.7s" }}
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">50K+</div>
                  <div className="text-sm text-base-content/60">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary">1K+</div>
                  <div className="text-sm text-base-content/60">Courses</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">98%</div>
                  <div className="text-sm text-base-content/60">
                    Success Rate
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Visual */}
            <div
              className={`relative ${
                isVisible ? "animate-fadeInRight" : "opacity-0"
              }`}
              style={{ animationDelay: "0.2s" }}
            >
              {/* Main Card */}
              <div className="card-glass rounded-3xl p-8 shadow-2xl animate-float">
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center gap-4">
                    <div className="avatar">
                      <div className="w-12 rounded-full">
                        <img
                          src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                          alt="Student"
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold">Sarah Wilson</h3>
                      <p className="text-sm text-base-content/60">
                        Computer Science
                      </p>
                    </div>
                    <div className="ml-auto">
                      <div className="badge badge-success gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          />
                        </svg>
                        Online
                      </div>
                    </div>
                  </div>

                  {/* Course Progress */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>React Development</span>
                        <span className="text-primary">78%</span>
                      </div>
                      <progress
                        className="progress progress-primary w-full"
                        value="78"
                        max="100"
                      ></progress>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Data Structures</span>
                        <span className="text-secondary">92%</span>
                      </div>
                      <progress
                        className="progress progress-secondary w-full"
                        value="92"
                        max="100"
                      ></progress>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Algorithm Design</span>
                        <span className="text-accent">65%</span>
                      </div>
                      <progress
                        className="progress progress-accent w-full"
                        value="65"
                        max="100"
                      ></progress>
                    </div>
                  </div>

                  {/* Achievement */}
                  <div className="bg-primary/10 rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-primary"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-primary">
                          Achievement Unlocked!
                        </p>
                        <p className="text-sm text-base-content/60">
                          Complete 10 assignments
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-xl animate-bounce-slow">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>

              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center shadow-xl animate-pulse-slow">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Hero;
