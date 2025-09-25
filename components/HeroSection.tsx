"use client";

import Image from "next/image";
import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();
  const [cherryAnimation, setCherryAnimation] = useState(null);

  useEffect(() => {
    // Load the animation data
    fetch('/animations/cherry.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load animation');
        }
        return response.json();
      })
      .then(data => {
        console.log('Cherry animation loaded:', data);
        setCherryAnimation(data);
      })
      .catch(error => {
        console.error('Error loading cherry animation:', error);
      });
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pink-gradient-bg">
      {/* Full background couple image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/couple1.svg"
          alt="Couple illustration"
          fill
          className="object-cover object-bottom opacity-60"
          style={{ 
            filter: 'hue-rotate(340deg) saturate(1.2) brightness(1.1)',
            mixBlendMode: 'overlay'
          }}
        />
      </div>

      {/* Background decorative elements with subtle glow */}
      <div className="absolute inset-0 overflow-hidden z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-200/10 rounded-full blur-3xl"></div>
        {/* Additional subtle texture overlay */}
        <div className="absolute inset-0 opacity-30" 
             style={{
               backgroundImage: `
                 radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                 radial-gradient(circle at 75% 75%, rgba(248, 187, 208, 0.1) 0%, transparent 50%)
               `
             }}>
        </div>
      </div>

      {/* Cherry animations positioned at 2 positions */}
      {cherryAnimation && (
        <>
          {/* Position 2 - Top center area - moved up */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-[600px] h-[400px] pointer-events-none z-30 rotate-5">
            <Lottie 
              animationData={cherryAnimation}
              style={{ 
                width: '100%', 
                height: '100%'
              }}
              loop={true}
              autoplay={true}
            />
          </div>

          {/* Position 3 - Right side area - moved up */}
          <div className="absolute -top-6 right-8 w-[550px] h-[350px] pointer-events-none z-30 transform rotate-12">
            <Lottie 
              animationData={cherryAnimation}
              style={{ 
                width: '100%', 
                height: '100%'
              }}
              loop={true}
              autoplay={true}
            />
          </div>
        </>
      )}

      {/* Logo moved to top-right corner */}
      <div className="absolute top-8 right-8 z-10">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl p-2">
          <span className="text-white font-bold text-2xl">W</span>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
        <div className="flex items-center justify-center min-h-screen">
          {/* Content - positioned in the center empty space */}
          <div className="text-center relative left-12 sm:left-24 lg:left-32">
            {/* WinkVibe Brand Name */}
            <div className="mb-16 flex flex-col items-center">
              <h1 className="text-6xl sm:text-7xl font-bold italic tracking-wide whitespace-nowrap" style={{ color: '#DC143C' }}>
                WinkV<span className="relative inline-block">i<span className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-3xl">❤️</span></span>be
              </h1>
              <button
                type="button"
                aria-label="Let's Wink"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 px-8 py-3 text-lg font-semibold text-white shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:from-pink-600 hover:via-rose-600 hover:to-red-600 focus:outline-none focus:ring-4 focus:ring-pink-300 active:scale-[0.97] transition"
                onClick={() => {
                  router.push('/signup');
                }}
              >
                <span>Let&apos;s Wink</span>
                <span className="text-2xl">😉</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-purple-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-purple-500 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}