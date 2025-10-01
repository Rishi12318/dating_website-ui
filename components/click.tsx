"use client";

import Image from 'next/image';
import { useState } from 'react';

export default function ClickSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [phoneScreen, setPhoneScreen] = useState('home'); // 'home', 'signup', 'details', 'compatibility', 'profile'
  
  const photos = [
    { src: '/p1.png', alt: 'Photo 1' },
    { src: '/p2.png', alt: 'Photo 2' },
    { src: '/p3.png', alt: 'Photo 3' },
    { src: '/p4.png', alt: 'Photo 4' },
    { src: '/p5.png', alt: 'Photo 5' },
    { src: '/p6.png', alt: 'Photo 6' }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % photos.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleNextScreen = () => {
    if (phoneScreen === 'home') setPhoneScreen('signup');
    else if (phoneScreen === 'signup') setPhoneScreen('details');
    else if (phoneScreen === 'details') setPhoneScreen('compatibility');
    else if (phoneScreen === 'compatibility') setPhoneScreen('profile');
    else setPhoneScreen('home');
  };

  const renderPhoneScreen = () => {
    switch (phoneScreen) {
      case 'home':
        return (
          <div className="mt-16 mb-8 px-6 h-full flex flex-col items-center justify-center" style={{ backgroundColor: '#ffffff' }}>
            <div className="text-center">
              {/* Hearts animation */}
              <div className="flex justify-center space-x-4 mb-6">
                <span className="text-4xl animate-pulse">💕</span>
                <span className="text-4xl animate-bounce">💖</span>
                <span className="text-4xl animate-pulse" style={{ animationDelay: '1s' }}>💕</span>
              </div>
              
              <div className="text-3xl font-bold mb-8" style={{ color: '#DC143C' }}>Dating</div>
              
              <button 
                onClick={handleNextScreen}
                className="hover:bg-red-700 text-white px-8 py-3 rounded-full font-semibold transition-colors duration-200"
                style={{ backgroundColor: '#DC143C' }}
              >
                Next
              </button>
            </div>
          </div>
        );
        
      case 'signup':
        return (
          <div className="mt-16 mb-8 px-6 h-full flex flex-col items-center justify-center relative overflow-hidden" style={{ backgroundColor: '#fce7f3' }}>
            {/* Pink flowers background */}
            <div className="absolute inset-0 opacity-20">
              <span className="absolute top-10 left-4 text-3xl">🌸</span>
              <span className="absolute top-20 right-6 text-2xl">🌺</span>
              <span className="absolute bottom-32 left-6 text-3xl">🌸</span>
              <span className="absolute bottom-20 right-4 text-2xl">🌺</span>
              <span className="absolute top-32 left-1/2 text-2xl">🌸</span>
            </div>
            
            <div className="text-center relative z-10">
              <div className="text-2xl font-bold mb-6" style={{ color: '#DC143C' }}>Sign Up</div>
              <div className="text-sm mb-8" style={{ color: '#DC143C' }}>Join Dating Today!</div>
              
              <button 
                onClick={handleNextScreen}
                className="hover:bg-red-700 text-white px-8 py-3 rounded-full font-semibold transition-colors duration-200"
                style={{ backgroundColor: '#DC143C' }}
              >
                Sign Up
              </button>
            </div>
          </div>
        );
        
      case 'details':
        return (
          <div className="mt-16 mb-8 px-6 h-full flex flex-col" style={{ backgroundColor: '#ffffff' }}>
            <div className="text-center mb-6">
              <div className="text-xl font-bold mb-4" style={{ color: '#DC143C' }}>Details</div>
            </div>
            
            <div className="space-y-4 flex-1">
              <div className="border rounded-lg p-3" style={{ borderColor: '#DC143C' }}>
                <label className="text-sm font-semibold" style={{ color: '#DC143C' }}>Name</label>
                <input className="w-full mt-1 p-2 border-none rounded text-sm" style={{ backgroundColor: '#FFE4E1' }} placeholder="Your name" />
              </div>
              
              <div className="border rounded-lg p-3" style={{ borderColor: '#DC143C' }}>
                <label className="text-sm font-semibold" style={{ color: '#DC143C' }}>Age</label>
                <input className="w-full mt-1 p-2 border-none rounded text-sm" style={{ backgroundColor: '#FFE4E1' }} placeholder="Your age" />
              </div>
              
              <div className="border rounded-lg p-3" style={{ borderColor: '#DC143C' }}>
                <label className="text-sm font-semibold" style={{ color: '#DC143C' }}>Location</label>
                <input className="w-full mt-1 p-2 border-none rounded text-sm" style={{ backgroundColor: '#FFE4E1' }} placeholder="Your location" />
              </div>
              
              <div className="border rounded-lg p-3" style={{ borderColor: '#DC143C' }}>
                <label className="text-sm font-semibold" style={{ color: '#DC143C' }}>Bio</label>
                <textarea className="w-full mt-1 p-2 border-none rounded text-sm" style={{ backgroundColor: '#FFE4E1' }} placeholder="Tell us about yourself" rows={3}></textarea>
              </div>
            </div>
            
            <div className="flex space-x-2 mt-4">
              <button 
                onClick={handleNextScreen}
                className="flex-1 hover:bg-red-700 text-white px-6 py-2 rounded-full font-semibold transition-colors duration-200"
                style={{ backgroundColor: '#DC143C' }}
              >
                Submit
              </button>
            </div>
          </div>
        );
        
      case 'compatibility':
        return (
          <div className="mt-16 mb-8 px-6 h-full flex flex-col" style={{ backgroundColor: '#ffffff' }}>
            <div className="text-center mb-6">
              <div className="text-xl font-bold mb-4" style={{ color: '#DC143C' }}>Compatibility Test</div>
            </div>
            
            <div className="space-y-4 flex-1 overflow-y-auto">
              <div className="border rounded-lg p-4" style={{ borderColor: '#DC143C', backgroundColor: '#FFE4E1' }}>
                <div className="text-sm font-semibold mb-3" style={{ color: '#DC143C' }}>What's your ideal date?</div>
                <div className="grid grid-cols-2 gap-2">
                  <button className="p-2 rounded-lg text-xs transition-colors" style={{ backgroundColor: '#FFCCCB', color: '#DC143C' }}>🍽️ Dinner</button>
                  <button className="p-2 rounded-lg text-xs transition-colors" style={{ backgroundColor: '#FFCCCB', color: '#DC143C' }}>🎬 Movies</button>
                  <button className="p-2 rounded-lg text-xs transition-colors" style={{ backgroundColor: '#FFCCCB', color: '#DC143C' }}>🏃‍♂️ Adventure</button>
                  <button className="p-2 rounded-lg text-xs transition-colors" style={{ backgroundColor: '#FFCCCB', color: '#DC143C' }}>☕ Coffee</button>
                </div>
              </div>
              
              <div className="border rounded-lg p-4" style={{ borderColor: '#DC143C', backgroundColor: '#FFE4E1' }}>
                <div className="text-sm font-semibold mb-3" style={{ color: '#DC143C' }}>Your personality type:</div>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="personality" className="mr-2" style={{ accentColor: '#DC143C' }} />
                    <span className="text-sm">🌟 Outgoing & Social</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="personality" className="mr-2" style={{ accentColor: '#DC143C' }} />
                    <span className="text-sm">📚 Thoughtful & Reserved</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="personality" className="mr-2" style={{ accentColor: '#DC143C' }} />
                    <span className="text-sm">🎯 Adventurous & Bold</span>
                  </label>
                </div>
              </div>
              
              <div className="border rounded-lg p-4" style={{ borderColor: '#DC143C', backgroundColor: '#FFE4E1' }}>
                <div className="text-sm font-semibold mb-3" style={{ color: '#DC143C' }}>Your interests:</div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full text-xs border" style={{ backgroundColor: '#FFCCCB', color: '#DC143C', borderColor: '#DC143C' }}>🎵 Music</span>
                  <span className="px-3 py-1 rounded-full text-xs border" style={{ backgroundColor: '#FFCCCB', color: '#DC143C', borderColor: '#DC143C' }}>✈️ Travel</span>
                  <span className="px-3 py-1 rounded-full text-xs border" style={{ backgroundColor: '#FFCCCB', color: '#DC143C', borderColor: '#DC143C' }}>🍕 Food</span>
                  <span className="px-3 py-1 rounded-full text-xs border" style={{ backgroundColor: '#FFCCCB', color: '#DC143C', borderColor: '#DC143C' }}>📸 Photography</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2 mt-4">
              <button 
                onClick={handleNextScreen}
                className="flex-1 hover:bg-red-700 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-200 shadow-lg"
                style={{ backgroundColor: '#DC143C' }}
              >
                Submit & Find Matches 💕
              </button>
            </div>
          </div>
        );
        
      case 'profile':
        return (
          <div className="mt-16 mb-8 px-6 h-full flex flex-col" style={{ backgroundColor: '#ffffff' }}>
            <div className="text-center mb-4">
              <div className="text-xl font-bold mb-2" style={{ color: '#DC143C' }}>Perfect Match Found! 💕</div>
              <div className="text-sm" style={{ color: '#DC143C' }}>Based on your compatibility test</div>
            </div>
            
            <div className="flex-1 flex flex-col items-center">
              {/* Profile Card */}
              <div className="bg-gradient-to-b rounded-2xl p-6 shadow-lg border mb-4 w-full max-w-sm" style={{ background: 'linear-gradient(to bottom, #FFE4E1, #ffffff)', borderColor: '#DC143C' }}>
                <div className="w-40 h-40 rounded-full overflow-hidden mb-4 border-4 mx-auto shadow-md" style={{ borderColor: '#DC143C' }}>
                  <Image
                    src="/p5.png"
                    alt="Match Profile"
                    width={160}
                    height={160}
                    className="object-cover w-full h-full"
                  />
                </div>
                
                <div className="text-center mb-4">
                  <div className="text-gray-800 font-bold text-xl">Ryan, 26 👨‍💼</div>
                  <div className="text-gray-600 text-sm mb-2">📍 New York, NY</div>
                  <div className="text-white text-sm px-3 py-1 rounded-full inline-block" style={{ backgroundColor: '#DC143C' }}>
                    💖 97% Compatible
                  </div>
                </div>
                
                {/* Quick Info */}
                <div className="rounded-lg p-3 mb-4 text-center" style={{ backgroundColor: '#FFE4E1' }}>
                  <div className="text-xs mb-1" style={{ color: '#DC143C' }}>Shared Interests</div>
                  <div className="flex justify-center gap-2 flex-wrap">
                    <span className="px-2 py-1 rounded-full text-xs" style={{ backgroundColor: '#FFCCCB', color: '#DC143C' }}>🎵 Music</span>
                    <span className="px-2 py-1 rounded-full text-xs" style={{ backgroundColor: '#FFCCCB', color: '#DC143C' }}>✈️ Travel</span>
                    <span className="px-2 py-1 rounded-full text-xs" style={{ backgroundColor: '#FFCCCB', color: '#DC143C' }}>🍕 Food</span>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-6 mb-4">
                <button 
                  onClick={() => alert('Pass! Looking for more matches... 👋')}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl border-2 border-gray-200"
                >
                  <span className="text-2xl">👎</span>
                </button>
                <button 
                  onClick={() => alert('It\'s a Match! 💕 Start chatting now!')}
                  className="text-white w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110"
                  style={{ background: 'linear-gradient(to right, #DC143C, #B22222)' }}
                >
                  <span className="text-2xl">💖</span>
                </button>
                <button 
                  onClick={() => alert('Super Like sent! ⭐ You really caught their attention!')}
                  className="bg-blue-500 hover:bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:rotate-12"
                >
                  <span className="text-2xl">⭐</span>
                </button>
              </div>
              
              <div className="text-center text-xs text-gray-500 mb-2">
                Tap 💖 to like • Tap ⭐ for super like • Tap 👎 to pass
              </div>
            </div>
            
            <button 
              onClick={() => setPhoneScreen('home')}
              className="hover:bg-red-700 text-white px-6 py-2 rounded-full font-semibold transition-colors duration-200 mt-2"
              style={{ backgroundColor: '#DC143C' }}
            >
              Find More Matches
            </button>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <section className="relative min-h-screen py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#ffb0d9' }}>
      {/* Photoframe positioned at the right border */}
      <div className="absolute top-20 right-0 bottom-20 w-[500px] bg-white rounded-l-xl shadow-2xl overflow-hidden z-20 animate-slideInRight animate-delay-600">
        <Image
          src="/photoframe.png"
          alt="Photo frame"
          fill
          className="object-cover"
        />
        
        {/* Three slidable photo boxes adjusted to hide black boxes while keeping bow visible */}
        {/* Image #1 (top right) - positioned to avoid the bow area */}
        <div className="absolute top-[18%] right-[8%] w-[42%] h-[38%] overflow-hidden rounded-sm shadow-lg transform rotate-[22deg] origin-center">
          <Image
            src={photos[currentSlide % 6].src}
            alt={photos[currentSlide % 6].alt}
            fill
            className="object-cover transition-all duration-500"
          />
        </div>
        
        {/* Image #2 (bottom left) - positioned to cover left black box without touching bow */}
        <div className="absolute bottom-[28%] left-[2%] w-[43%] h-[48%] overflow-hidden rounded-sm shadow-lg transform rotate-[-15deg] origin-center">
          <Image
            src={photos[(currentSlide + 1) % 6].src}
            alt={photos[(currentSlide + 1) % 6].alt}
            fill
            className="object-cover transition-all duration-500"
          />
        </div>
        
        {/* Image #3 (bottom right) - positioned to cover bottom black box */}
        <div className="absolute bottom-[2%] right-[6%] w-[46%] h-[40%] overflow-hidden rounded-sm shadow-lg transform rotate-[18deg] origin-center">
          <Image
            src={photos[(currentSlide + 2) % 6].src}
            alt={photos[(currentSlide + 2) % 6].alt}
            fill
            className="object-cover transition-all duration-500"
          />
        </div>
        
        {/* Navigation controls for sliding */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          <button
            onClick={prevSlide}
            className="bg-white/80 hover:bg-white text-black rounded-full w-8 h-8 flex items-center justify-center shadow-md transition-all duration-200 text-sm"
          >
            ←
          </button>
          <button
            onClick={nextSlide}
            className="bg-white/80 hover:bg-white text-black rounded-full w-8 h-8 flex items-center justify-center shadow-md transition-all duration-200 text-sm"
          >
            →
          </button>
        </div>
      </div>

      {/* Love1.svg in bottom right corner with click section bg color */}
      <div className="absolute bottom-8 right-8 w-64 h-64 z-10 opacity-90">
        <Image
          src="/love1.svg"
          alt="Love decoration"
          fill
          className="object-cover rounded-xl shadow-2xl"
          style={{
            filter: 'brightness(0) saturate(100%) invert(89%) sepia(35%) saturate(1234%) hue-rotate(288deg) brightness(102%) contrast(96%)',
            mixBlendMode: 'multiply'
          }}
        />
      </div>

      {/* Content area */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Main content with heading and phone underneath */}
        <div className="flex flex-col items-start">
          {/* Heading */}
          <div className="mb-12">
            <h2 className="text-5xl sm:text-6xl font-bold mb-8 animate-slideInLeft animate-textGlow" style={{ 
              fontFamily: 'cursive',
              fontStyle: 'italic',
              fontWeight: 'bold',
              letterSpacing: '0.05em',
              color: '#f8d7da',
              textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 2px 2px 4px rgba(248, 215, 218, 0.3)',
              WebkitTextStroke: '1px #000'
            }}>
              Click the Like, Wink the Vibe
            </h2>
          </div>

          {/* Smartphone mockup positioned under heading with increased width and tilt */}
          <div className="w-[400px] h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden z-20 animate-slideInLeft animate-delay-400 transform rotate-[-8deg] ml-16">
            {/* Smartphone outer frame */}
            <div className="w-full h-full bg-white p-4 rounded-3xl">
              {/* Smartphone screen with black layout */}
              <div className="w-full h-full bg-black rounded-2xl relative overflow-hidden">
                {/* Status bar */}
                <div className="absolute top-0 left-0 right-0 h-10 bg-black flex items-center justify-between px-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="text-white text-sm font-medium">9:41</div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-3 border-2 border-white rounded-sm"></div>
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                
                {/* Notch/camera area */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-20 h-6 bg-black rounded-full border border-gray-700"></div>
                
                {/* Home indicator */}
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-40 h-2 bg-white rounded-full opacity-60"></div>
                
                {/* Screen content area */}
                {renderPhoneScreen()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}