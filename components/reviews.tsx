"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Lottie from 'lottie-react';

export default function ReviewsSection() {
  const [currentReview, setCurrentReview] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [flowerAnimation, setFlowerAnimation] = useState(null);
  const [currentPhotoSlide, setCurrentPhotoSlide] = useState(0);

  const photoSlides = ['/g1.png', '/g2.png', '/g3.png', '/g4.png'];

  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      age: 28,
      location: "New York, NY",
      rating: 5,
      text: "Dating changed my life! I found my soulmate through their amazing compatibility system. The journey from signup to finding love was so smooth and enjoyable.",
      image: "💕",
      relationship: "Found love in 3 months"
    },
    {
      id: 2,
      name: "Michael Chen",
      age: 32,
      location: "San Francisco, CA",
      rating: 5,
      text: "The compatibility test was incredibly accurate. I met Emma through Dating and we're getting married next spring! Thank you for bringing us together.",
      image: "🌸",
      relationship: "Engaged after 6 months"
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      age: 26,
      location: "Los Angeles, CA",
      rating: 5,
      text: "I was skeptical about dating apps, but Dating's approach is so different. The preference settings helped me find exactly what I was looking for. Now I'm happier than ever!",
      image: "🌺",
      relationship: "In a relationship for 1 year"
    },
    {
      id: 4,
      name: "David Thompson",
      age: 30,
      location: "Chicago, IL",
      rating: 5,
      text: "The step-by-step process made everything so easy. From profile creation to finding my perfect match, every step was thoughtfully designed. Highly recommend!",
      image: "💖",
      relationship: "Found love in 2 months"
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    
    // Load the flower animation
    fetch('/animations/flower.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load flower animation');
        }
        return response.json();
      })
      .then(data => {
        console.log('Flower animation loaded:', data);
        setFlowerAnimation(data);
      })
      .catch(error => {
        console.error('Error loading flower animation:', error);
      });
    
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 5000);
    
    const photoInterval = setInterval(() => {
      setCurrentPhotoSlide((prev) => (prev + 1) % photoSlides.length);
    }, 3000);
    
    return () => {
      clearInterval(interval);
      clearInterval(photoInterval);
    };
  }, [reviews.length, photoSlides.length]);

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-2xl ${i < rating ? 'text-red-500' : 'text-gray-200'}`} style={{ color: i < rating ? '#DC143C' : undefined }}>
        ⭐
      </span>
    ));
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ 
      background: 'linear-gradient(135deg, #FFE4E1 0%, #FFC0CB 25%, #FFB6C1 50%, #FFCCCB 75%, #FFE4E1 100%)'
    }}>
      {/* Floating Flower Animation */}
      {flowerAnimation && (
        <>
          <div className="absolute top-10 left-10 w-32 h-32 opacity-60">
            <Lottie animationData={flowerAnimation} loop={true} />
          </div>
          <div className="absolute top-20 right-20 w-24 h-24 opacity-50" style={{ animationDelay: '2s' }}>
            <Lottie animationData={flowerAnimation} loop={true} />
          </div>
          <div className="absolute bottom-40 left-1/4 w-28 h-28 opacity-40" style={{ animationDelay: '4s' }}>
            <Lottie animationData={flowerAnimation} loop={true} />
          </div>
          <div className="absolute bottom-20 right-1/3 w-32 h-32 opacity-50" style={{ animationDelay: '1s' }}>
            <Lottie animationData={flowerAnimation} loop={true} />
          </div>
          <div className="absolute top-1/3 right-10 w-20 h-20 opacity-60" style={{ animationDelay: '3s' }}>
            <Lottie animationData={flowerAnimation} loop={true} />
          </div>
        </>
      )}

      {/* Floating Hearts Background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-10 left-10 text-4xl animate-bounce" style={{ color: '#DC143C' }}>💕</div>
        <div className="absolute top-20 right-20 text-3xl animate-pulse" style={{ animationDelay: '1s', color: '#DC143C' }}>💖</div>
        <div className="absolute bottom-40 left-1/4 text-5xl animate-bounce" style={{ animationDelay: '2s', color: '#DC143C' }}>🌸</div>
        <div className="absolute bottom-20 right-1/3 text-4xl animate-pulse" style={{ animationDelay: '0.5s', color: '#DC143C' }}>🌺</div>
        <div className="absolute top-1/3 right-10 text-3xl animate-bounce" style={{ animationDelay: '1.5s', color: '#DC143C' }}>✨</div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-5xl sm:text-6xl font-bold mb-6 animate-bounceIn animate-shimmer" style={{ 
            fontFamily: 'cursive',
            fontStyle: 'italic',
            letterSpacing: '0.05em',
            background: 'linear-gradient(45deg, #DC143C, #B22222, #8B0000)',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            textShadow: '2px 2px 4px rgba(220, 20, 60, 0.1)'
          }}>
            Love Stories & Reviews
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Real people, real connections, real happiness - see what our community says about their Dating journey
          </p>
        </div>

        {/* Main Review Carousel - bbg3.png as background with sliding reviews */}
        <div className="max-w-6xl mx-auto mb-16 relative">
          {/* bbg3.png as main background image - full visibility */}
          <div className="relative w-full h-[600px] rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="/bbg3.png"
              alt="Review Background"
              fill
              className="object-contain" // Changed to contain to show entire image
              priority
            />
            
            {/* Slidable photo boxes on "add photos" areas */}
            {/* Main photo area - top right */}
            <div className="absolute top-16 right-16 w-32 h-24 rounded-lg overflow-hidden shadow-lg bg-white/90 backdrop-blur-sm">
              <div className="relative w-full h-full transition-all duration-500">
                <Image
                  src={photoSlides[currentPhotoSlide]}
                  alt={`Couple Photo ${currentPhotoSlide + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            
            {/* Small corner photo - top right corner */}
            <div className="absolute top-8 right-8 w-16 h-16 rounded-lg overflow-hidden shadow-md bg-white/90 backdrop-blur-sm">
              <div className="relative w-full h-full transition-all duration-500">
                <Image
                  src={photoSlides[(currentPhotoSlide + 1) % photoSlides.length]}
                  alt={`Couple Photo ${((currentPhotoSlide + 1) % photoSlides.length) + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            
            {/* Additional sliding photo areas */}
            <div className="absolute top-20 right-32 w-20 h-16 rounded-lg overflow-hidden shadow-md bg-white/90 backdrop-blur-sm transform rotate-12">
              <div className="relative w-full h-full transition-all duration-500">
                <Image
                  src={photoSlides[(currentPhotoSlide + 2) % photoSlides.length]}
                  alt={`Couple Photo ${((currentPhotoSlide + 2) % photoSlides.length) + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            
            <div className="absolute top-4 right-20 w-18 h-14 rounded-lg overflow-hidden shadow-md bg-white/90 backdrop-blur-sm transform -rotate-6">
              <div className="relative w-full h-full transition-all duration-500">
                <Image
                  src={photoSlides[(currentPhotoSlide + 3) % photoSlides.length]}
                  alt={`Couple Photo ${((currentPhotoSlide + 3) % photoSlides.length) + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            
            {/* Flower animations to enhance the photo area */}
            {flowerAnimation && (
              <>
                {/* Decorative flowers around the photos */}
                <div className="absolute top-12 right-12 w-20 h-20 opacity-60 z-10">
                  <Lottie animationData={flowerAnimation} loop={true} />
                </div>
                <div className="absolute top-8 right-44 w-16 h-16 opacity-50 z-10" style={{ animationDelay: '1s' }}>
                  <Lottie animationData={flowerAnimation} loop={true} />
                </div>
                <div className="absolute top-32 right-8 w-18 h-18 opacity-70 z-10" style={{ animationDelay: '2s' }}>
                  <Lottie animationData={flowerAnimation} loop={true} />
                </div>
              </>
            )}

            {/* Floating Flowers around the image */}
            {flowerAnimation && (
              <>
                <div className="absolute -top-8 -left-8 w-16 h-16 opacity-70 z-20">
                  <Lottie animationData={flowerAnimation} loop={true} />
                </div>
                <div className="absolute -top-8 left-1/3 w-20 h-20 opacity-60 z-20" style={{ animationDelay: '3s' }}>
                  <Lottie animationData={flowerAnimation} loop={true} />
                </div>
                <div className="absolute -bottom-8 -left-8 w-16 h-16 opacity-70 z-20" style={{ animationDelay: '2s' }}>
                  <Lottie animationData={flowerAnimation} loop={true} />
                </div>
                <div className="absolute -bottom-8 -right-8 w-16 h-16 opacity-70 z-20" style={{ animationDelay: '3s' }}>
                  <Lottie animationData={flowerAnimation} loop={true} />
                </div>
                <div className="absolute top-1/2 -left-12 w-24 h-24 opacity-60 z-20" style={{ animationDelay: '4s' }}>
                  <Lottie animationData={flowerAnimation} loop={true} />
                </div>
              </>
            )}

            {/* Light overlay for better text readability - only in center area */}
            <div className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-r from-black/20 via-black/30 to-transparent rounded-l-3xl"></div>

            {/* Sliding Review Content - positioned in center-left area */}
            <div className={`absolute left-8 top-1/2 -translate-y-1/2 w-80 p-6 z-15 transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
              <div className="text-center text-white backdrop-blur-sm bg-black/30 rounded-2xl p-8 shadow-2xl">
                {/* Profile Image/Icon */}
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg backdrop-blur-sm" style={{ background: 'rgba(255, 228, 225, 0.95)', border: '2px solid #DC143C' }}>
                    <span style={{ color: '#DC143C' }}>{reviews[currentReview].image}</span>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex justify-center mb-4">
                  {renderStars(reviews[currentReview].rating)}
                </div>

                {/* Review Text - shorter for better fit */}
                <blockquote className="text-lg text-white text-center mb-6 leading-relaxed font-light italic drop-shadow-lg">
                  &ldquo;{reviews[currentReview].text.substring(0, 120)}...&rdquo;
                </blockquote>

                {/* Reviewer Info */}
                <div className="text-center">
                  <h4 className="text-xl font-bold text-white mb-2 drop-shadow-lg">
                    {reviews[currentReview].name}
                  </h4>
                  <p className="text-white/90 mb-3 drop-shadow-md text-sm">
                    Age {reviews[currentReview].age} • {reviews[currentReview].location}
                  </p>
                  <div className="inline-block px-3 py-1 rounded-full backdrop-blur-sm" style={{ background: 'rgba(255, 228, 225, 0.95)' }}>
                    <span className="text-xs font-semibold" style={{ color: '#DC143C' }}>
                      {reviews[currentReview].relationship}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Arrows - repositioned */}
            <button 
              onClick={prevReview}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center text-white z-20 text-sm"
              style={{ background: 'rgba(220, 20, 60, 0.8)' }}
            >
              ←
            </button>
            <button 
              onClick={nextReview}
              className="absolute left-72 top-1/2 -translate-y-1/2 w-10 h-10 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center text-white z-20 text-sm"
              style={{ background: 'rgba(220, 20, 60, 0.8)' }}
            >
              →
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-3">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentReview(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentReview 
                    ? 'scale-125' 
                    : 'hover:scale-110'
                }`}
                style={{ 
                  backgroundColor: index === currentReview ? '#DC143C' : '#FFCCCB'
                }}
              />
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { number: "10,000+", label: "Happy Couples", icon: "💕" },
            { number: "50,000+", label: "Success Stories", icon: "🌟" },
            { number: "95%", label: "Satisfaction Rate", icon: "😊" }
          ].map((stat, index) => (
            <div 
              key={index}
              className="text-center p-6 rounded-2xl backdrop-blur-sm border hover:shadow-lg transition-all duration-300"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                borderColor: 'rgba(220, 20, 60, 0.3)',
                boxShadow: index === 1 ? '0 10px 15px -3px rgba(220, 20, 60, 0.1)' : undefined
              }}
            >
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-3xl font-bold mb-2" style={{ color: '#DC143C' }}>{stat.number}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}