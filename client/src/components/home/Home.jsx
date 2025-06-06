import React, { useState, useEffect, useRef } from 'react'
import Hero from './Hero'
import Features from './Features'
import Testimonial from './Testimonial'

function Home() {
  const [currentSection, setCurrentSection] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const homeRef = useRef(null)
  
  const sections = [
    { id: 'hero', component: Hero },
    { id: 'features', component: Features },
    { id: 'testimonials', component: Testimonial }
  ]

  useEffect(() => {
    const handleWheel = (e) => {
      if (isScrolling) return
      
      e.preventDefault()
      setIsScrolling(true)
      
      if (e.deltaY > 0 && currentSection < sections.length - 1) {
        // Scroll down
        setCurrentSection(prev => prev + 1)
      } else if (e.deltaY < 0 && currentSection > 0) {
        // Scroll up
        setCurrentSection(prev => prev - 1)
      }
      
      setTimeout(() => setIsScrolling(false), 1000)
    }

    const handleKeyDown = (e) => {
      if (isScrolling) return
      
      if (e.key === 'ArrowDown' && currentSection < sections.length - 1) {
        setIsScrolling(true)
        setCurrentSection(prev => prev + 1)
        setTimeout(() => setIsScrolling(false), 1000)
      } else if (e.key === 'ArrowUp' && currentSection > 0) {
        setIsScrolling(true)
        setCurrentSection(prev => prev - 1)
        setTimeout(() => setIsScrolling(false), 1000)
      }
    }

    const container = homeRef.current
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false })
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel)
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [currentSection, isScrolling, sections.length])

  const scrollToSection = (index) => {
    if (isScrolling) return
    setIsScrolling(true)
    setCurrentSection(index)
    setTimeout(() => setIsScrolling(false), 1000)
  }

  return (
    <>
      <style>{`
        .fullpage-container {
          height: 100vh;
          overflow: hidden;
          position: relative;
        }
        
        .sections-wrapper {
          height: 100vh;
          transform: translateY(-${currentSection * 100}vh);
          transition: transform 1s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .section {
          height: 100vh;
          width: 100%;
          position: relative;
        }
        
        .nav-dots {
          position: fixed;
          right: 2rem;
          top: 50%;
          transform: translateY(-50%);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .nav-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          border: 2px solid rgba(255, 255, 255, 0.6);
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }
        
        .nav-dot.active {
          background: #667eea;
          border-color: #667eea;
          transform: scale(1.3);
          box-shadow: 0 0 20px rgba(102, 126, 234, 0.6);
        }
        
        .nav-dot:hover {
          background: rgba(255, 255, 255, 0.8);
          transform: scale(1.1);
        }
        
        .scroll-indicator {
          position: fixed;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.875rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          animation: bounce 2s infinite;
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
          40% { transform: translateX(-50%) translateY(-10px); }
          60% { transform: translateX(-50%) translateY(-5px); }
        }
        
        .section-counter {
          position: fixed;
          top: 50%;
          left: 2rem;
          transform: translateY(-50%);
          z-index: 1000;
          color: rgba(255, 255, 255, 0.8);
          font-size: 1.5rem;
          font-weight: bold;
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.1);
          padding: 1rem;
          border-radius: 50%;
          min-width: 60px;
          min-height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        @media (max-width: 768px) {
          .nav-dots {
            right: 1rem;
          }
          
          .section-counter {
            left: 1rem;
            font-size: 1rem;
            min-width: 40px;
            min-height: 40px;
            padding: 0.5rem;
          }
          
          .scroll-indicator {
            bottom: 1rem;
            font-size: 0.75rem;
          }
        }
      `}</style>

      <div ref={homeRef} className="fullpage-container">
        {/* Section Counter */}
        <div className="section-counter">
          {String(currentSection + 1).padStart(2, '0')}
        </div>

        {/* Navigation Dots */}
        <div className="nav-dots">
          {sections.map((_, index) => (
            <button
              key={index}
              className={`nav-dot ${index === currentSection ? 'active' : ''}`}
              onClick={() => scrollToSection(index)}
              aria-label={`Go to section ${index + 1}`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        {currentSection < sections.length - 1 && (
          <div className="scroll-indicator">
            <span>Scroll</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
            </svg>
          </div>
        )}

        {/* Sections Wrapper */}
        <div className="sections-wrapper">
          {sections.map((section, index) => {
            const Component = section.component
            return (
              <div key={section.id} className="section">
                <Component isActive={index === currentSection} />
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default Home