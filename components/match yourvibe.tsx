"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Lottie from 'lottie-react';

export default function MatchYourVibe() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [birdsAnimation, setBirdsAnimation] = useState(null);

  useEffect(() => {
    // Load the birds animation dynamically
    fetch('/animations/birds.json')
      .then((response) => response.json())
      .then((data) => setBirdsAnimation(data));
  }, []);

  const vibes = [
    {
      id: 1,
      title: "Old School Romance",
      description: "Classic courtship, timeless love",
      icon: "💕",
      svgPath: "/oldschool.png",
    },
    {
      id: 2,
      title: "Friendship",
      description: "Strong bonds, lasting connections",
      icon: "🤝",
      svgPath: "/friendship.png",
    },
    {
      id: 3,
      title: "Opposites Attract",
      description: "Different paths, perfect match",
      icon: "🧲",
      svgPath: "/opposite.png",
    },
    {
      id: 4,
      title: "No Labels",
      description: "Free spirits, authentic connections",
      icon: "�",
      svgPath: "/nolabel.png",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % vibes.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + vibes.length) % vibes.length);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative" style={{ backgroundColor: '#b33965' }}>
      {/* Left Side Background Image */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 -rotate-12 scale-125 w-64 h-80 opacity-95 z-0 hidden lg:block">
        <Image
          src="/bg1.png"
          alt="Background decoration"
          fill
          className="object-cover rounded-2xl shadow-2xl"
        />
      </div>

      {/* Right Side Background Image */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 rotate-12 scale-125 w-64 h-80 opacity-95 z-0 hidden lg:block">
        <Image
          src="/bg2.png"
          alt="Background decoration"
          fill
          className="object-cover rounded-2xl shadow-2xl"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Title */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4">            
            <h2 className="text-5xl sm:text-6xl font-bold animate-slideInLeft animate-float" style={{ 
              color: 'white',
              fontFamily: 'cursive',
              fontStyle: 'italic',
              letterSpacing: '0.1em',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}>
              Match Your Vibe
            </h2>
            
            {/* Right love.svg with matching background */}
            <div className="w-12 h-12 transform rotate-12 opacity-90 rounded-full p-2 animate-bounceIn animate-delay-400" style={{ backgroundColor: '#DC143C' }}>
              <Image
                src="/love.svg"
                alt="Love decoration"
                width={48}
                height={48}
                className="object-contain drop-shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Slidable Rectangular Cards Container */}
        <div className="relative max-w-2xl mx-auto">
          {/* Slider Container */}
          <div className="overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {vibes.map((vibe, index) => (
                <div key={vibe.id} className="w-full flex-shrink-0 flex justify-center px-4">
                  <div 
                    className="bg-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 relative overflow-hidden"
                    style={{ 
                      aspectRatio: '4/5',
                      width: '480px',
                      maxWidth: '90vw',
                      height: 'auto'
                    }}
                  >
                    {/* Background Image */}
                    <div 
                      className="absolute inset-0 opacity-30"
                      style={{
                        backgroundImage: `url(${index % 2 === 0 ? '/bg1.png' : '/bg2.png'})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                      }}
                    ></div>

                    {/* Birds Animation for First Box Only */}
                    {index === 0 && birdsAnimation && (
                      <>
                        {/* Top-left diagonal corner bird */}
                        <div className="absolute top-4 left-4 w-32 h-32 z-5 opacity-80 transform -rotate-12 scale-150">
                          <Lottie
                            animationData={birdsAnimation}
                            loop={true}
                            autoplay={true}
                            style={{ width: '100%', height: '100%' }}
                          />
                        </div>
                        
                        {/* Bottom-right diagonal corner bird */}
                        <div className="absolute bottom-4 right-4 w-32 h-32 z-5 opacity-80 transform rotate-12 scale-150 -scale-x-100">
                          <Lottie
                            animationData={birdsAnimation}
                            loop={true}
                            autoplay={true}
                            style={{ width: '100%', height: '100%' }}
                          />
                        </div>
                      </>
                    )}
                    
                    <div className="pt-3 px-6 pb-3 flex flex-col text-center relative z-10">
                      {/* PNG Image */}
                      <div className="w-full max-w-[400px] mx-auto mb-1">
                        <div className="relative w-full h-[350px]">
                          <Image
                            src={vibe.svgPath}
                            alt={vibe.title}
                            fill
                            className="object-cover rounded-xl"
                          />
                        </div>
                      </div>
                      
                      {/* Text Content - Directly Below Image */}
                      <div className="mt-1">
                        {/* Title in Bold Italic */}
                        <h3 className="text-2xl font-bold mb-1 text-gray-800 italic font-extrabold">
                          {vibe.title}
                        </h3>
                        
                        {/* Description in Italic */}
                        <p className="text-gray-600 text-lg leading-relaxed italic mb-2">
                          {vibe.description}
                        </p>
                        
                        {/* Decorative element */}
                        <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Slide Indicators */}
          <div className="flex justify-center mt-8 space-x-3">
            {vibes.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-pink-400 scale-125' 
                    : 'bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
