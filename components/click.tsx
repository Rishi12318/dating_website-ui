"use client";

import Image from 'next/image';
import { useState } from 'react';

export default function ClickSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
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

  return (
    <section className="relative min-h-screen py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#ffb0d9' }}>
      {/* Smartphone mockup positioned on the left side */}
      <div className="absolute top-20 left-0 bottom-20 w-[300px] bg-white rounded-r-xl shadow-2xl overflow-hidden z-20">
        {/* Smartphone outer frame */}
        <div className="w-full h-full bg-white p-4 rounded-r-xl">
          {/* Smartphone screen with black layout */}
          <div className="w-full h-full bg-black rounded-xl relative overflow-hidden">
            {/* Status bar */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-black flex items-center justify-between px-4">
              <div className="flex items-center space-x-1">
                <div className="w-1 h-1 bg-white rounded-full"></div>
                <div className="w-1 h-1 bg-white rounded-full"></div>
                <div className="w-1 h-1 bg-white rounded-full"></div>
              </div>
              <div className="text-white text-xs">9:41</div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-2 border border-white rounded-sm"></div>
                <div className="w-1 h-1 bg-white rounded-full"></div>
              </div>
            </div>
            
            {/* Notch/camera area */}
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-black rounded-full border border-gray-800"></div>
            
            {/* Home indicator */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full opacity-60"></div>
            
            {/* Screen content area */}
            <div className="mt-10 mb-6 px-4 h-full">
              <div className="text-white text-center">
                <div className="text-lg font-bold mb-2">WinkVibe</div>
                <div className="text-sm opacity-70">Dating App</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Photoframe positioned at the right border */}
      <div className="absolute top-20 right-0 bottom-20 w-[500px] bg-white rounded-l-xl shadow-2xl overflow-hidden z-20">
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
        {/* Main content with heading on left */}
        <div className="flex items-center justify-between">
          {/* Left side - Heading */}
          <div className="flex-1 pr-[520px]">
            <h2 className="text-5xl sm:text-6xl font-bold mb-8" style={{ 
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
        </div>
      </div>
    </section>
  );
}