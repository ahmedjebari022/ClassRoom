import React, { useState, useEffect } from 'react'

function Testimonial({ isActive }) {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Computer Science Student",
      university: "Stanford University",
      image: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
      rating: 5,
      text: "ClassRoom transformed my learning experience completely. The interactive features and collaborative environment helped me excel in my studies. I've never been more engaged in learning!",
      course: "Advanced Algorithms",
      achievement: "4.0 GPA Maintained"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Data Science Major",
      university: "MIT",
      image: "https://img.daisyui.com/images/stock/photo-1507003211169-0a1dd7228f2d.webp",
      rating: 5,
      text: "The analytics and progress tracking features are incredible. I can see exactly where I need to improve and the AI recommendations are spot on. It's like having a personal tutor.",
      course: "Machine Learning",
      achievement: "Top 5% of Class"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Teaching Assistant",
      university: "Harvard University",
      image: "https://img.daisyui.com/images/stock/photo-1494790108755-2616c57103d8.webp",
      rating: 5,
      text: "As an educator, ClassRoom provides all the tools I need to create engaging content and track student progress. The platform is intuitive and powerful.",
      course: "Web Development",
      achievement: "95% Student Satisfaction"
    },
    {
      id: 4,
      name: "David Kim",
      role: "Physics Student",
      university: "UC Berkeley",
      image: "https://img.daisyui.com/images/stock/photo-1472099645785-5658abf4ff4e.webp",
      rating: 5,
      text: "The mobile learning feature is a game-changer. I can study during my commute and sync everything seamlessly. The offline mode saved me during internet outages!",
      course: "Quantum Physics",
      achievement: "Dean's List 3 Semesters"
    },
    {
      id: 5,
      name: "Lisa Wang",
      role: "Graduate Student",
      university: "Princeton University",
      image: "https://img.daisyui.com/images/stock/photo-1508214751196-bcfd4ca60f91.webp",
      rating: 5,
      text: "The collaborative features helped me connect with study groups and work on research projects effectively. ClassRoom made remote learning feel personal and engaging.",
      course: "Research Methods",
      achievement: "Published 2 Papers"
    }
  ]

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slideOut {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(-50px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: calc(200px + 100%) 0; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .animate-slideIn { animation: slideIn 0.8s ease-out forwards; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 2s linear infinite; }
        .animate-pulse-slow { animation: pulse 3s ease-in-out infinite; }
        
        .testimonial-card {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .glass-effect {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .star-rating {
          filter: drop-shadow(0 0 8px rgba(255, 193, 7, 0.6));
        }
      `}</style>

      <section className="w-full h-full bg-gradient-to-br from-base-100 via-primary/5 to-secondary/5 relative overflow-hidden flex items-center">
        <div className="w-full py-10">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
            
            {/* Floating Icons */}
            <div className="absolute top-20 right-1/4 text-primary/10 animate-float">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>
            <div className="absolute bottom-1/3 left-1/4 text-secondary/10 animate-float" style={{animationDelay: '2s'}}>
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"/>
              </svg>
            </div>
          </div>

          <div className="container mx-auto px-6 relative z-10">
            {/* Header */}
            <div className={`text-center mb-16 ${isVisible ? 'animate-slideIn' : 'opacity-0'}`}>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                <svg className="w-4 h-4 star-rating" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                Student Stories
              </div>
              
              <h2 className="text-4xl lg:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  What Our Students
                </span>
                <br />
                Are Saying
              </h2>
              
              <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
                Join thousands of students who have transformed their learning experience with ClassRoom.
                Here's what they have to say about their journey.
              </p>
            </div>

            {/* Main Testimonial */}
            <div className="max-w-6xl mx-auto mb-16">
              <div className="testimonial-card glass-effect rounded-3xl p-8 lg:p-12 shadow-2xl">
                <div className="grid lg:grid-cols-3 gap-8 items-center">
                  
                  {/* Student Info */}
                  <div className="text-center lg:text-left">
                    <div className="avatar mb-6">
                      <div className="w-24 h-24 rounded-full ring-4 ring-primary/20 ring-offset-4 ring-offset-base-100">
                        <img 
                          src={testimonials[currentTestimonial].image} 
                          alt={testimonials[currentTestimonial].name}
                          className="object-cover"
                        />
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-2">
                      {testimonials[currentTestimonial].name}
                    </h3>
                    
                    <p className="text-primary font-semibold mb-1">
                      {testimonials[currentTestimonial].role}
                    </p>
                    
                    <p className="text-base-content/60 mb-4">
                      {testimonials[currentTestimonial].university}
                    </p>
                    
                    {/* Rating */}
                    <div className="flex justify-center lg:justify-start gap-1 mb-4">
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-400 star-rating" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      ))}
                    </div>
                    
                    {/* Achievement Badge */}
                    <div className="badge badge-primary badge-outline px-3 py-2">
                      {testimonials[currentTestimonial].achievement}
                    </div>
                  </div>
                  
                  {/* Testimonial Content */}
                  <div className="lg:col-span-2">
                    <div className="relative">
                      {/* Quote Icon */}
                      <svg className="absolute -top-4 -left-2 w-12 h-12 text-primary/20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                      </svg>
                      
                      <blockquote className="text-xl lg:text-2xl leading-relaxed text-base-content/80 pl-8">
                        "{testimonials[currentTestimonial].text}"
                      </blockquote>
                      
                      <div className="mt-6 flex items-center gap-4">
                        <div className="badge badge-secondary badge-outline">
                          📚 {testimonials[currentTestimonial].course}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-center items-center gap-6 mb-12">
              <button 
                onClick={prevTestimonial}
                className="btn btn-circle btn-primary btn-outline hover:btn-primary group"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              
              {/* Dots Indicator */}
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial 
                        ? 'bg-primary scale-125' 
                        : 'bg-base-content/20 hover:bg-base-content/40'
                    }`}
                    onClick={() => setCurrentTestimonial(index)}
                  />
                ))}
              </div>
              
              <button 
                onClick={nextTestimonial}
                className="btn btn-circle btn-primary btn-outline hover:btn-primary group"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>

            {/* Stats Section */}
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div className="glass-effect rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
                <div className="text-3xl font-bold text-primary mb-2">50K+</div>
                <div className="text-base-content/60">Happy Students</div>
              </div>
              <div className="glass-effect rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
                <div className="text-3xl font-bold text-secondary mb-2">4.9</div>
                <div className="text-base-content/60">Average Rating</div>
              </div>
              <div className="glass-effect rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
                <div className="text-3xl font-bold text-accent mb-2">95%</div>
                <div className="text-base-content/60">Success Rate</div>
              </div>
              <div className="glass-effect rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
                <div className="text-3xl font-bold text-info mb-2">24/7</div>
                <div className="text-base-content/60">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Testimonial