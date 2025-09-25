"use client";

import { useState, useEffect } from 'react';

export default function ReviewsSection() {
  const [currentReview, setCurrentReview] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      age: 28,
      location: "New York, NY",
      rating: 5,
      text: "WinkVibe changed my life! I found my soulmate through their amazing compatibility system. The journey from signup to finding love was so smooth and enjoyable.",
      image: "💕",
      relationship: "Found love in 3 months"
    },
    {
      id: 2,
      name: "Michael Chen",
      age: 32,
      location: "San Francisco, CA",
      rating: 5,
      text: "The compatibility test was incredibly accurate. I met Emma through WinkVibe and we're getting married next spring! Thank you for bringing us together.",
      image: "🌸",
      relationship: "Engaged after 6 months"
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      age: 26,
      location: "Los Angeles, CA",
      rating: 5,
      text: "I was skeptical about dating apps, but WinkVibe's approach is so different. The preference settings helped me find exactly what I was looking for. Now I'm happier than ever!",
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
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-2xl ${i < rating ? 'text-pink-400' : 'text-gray-200'}`}>
        ⭐
      </span>
    ));
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ 
      background: 'linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 25%, #fce7f3 50%, #f8fafc 75%, #fdf2f8 100%)'
    }}>
      {/* Floating Hearts Background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-10 left-10 text-4xl text-pink-300 animate-bounce">💕</div>
        <div className="absolute top-20 right-20 text-3xl text-rose-300 animate-pulse" style={{ animationDelay: '1s' }}>💖</div>
        <div className="absolute bottom-40 left-1/4 text-5xl text-pink-200 animate-bounce" style={{ animationDelay: '2s' }}>🌸</div>
        <div className="absolute bottom-20 right-1/3 text-4xl text-rose-200 animate-pulse" style={{ animationDelay: '0.5s' }}>🌺</div>
        <div className="absolute top-1/3 right-10 text-3xl text-pink-400 animate-bounce" style={{ animationDelay: '1.5s' }}>✨</div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-5xl sm:text-6xl font-bold mb-6" style={{ 
            fontFamily: 'cursive',
            fontStyle: 'italic',
            letterSpacing: '0.05em',
            background: 'linear-gradient(45deg, #ec4899, #f43f5e, #be185d)',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            textShadow: '2px 2px 4px rgba(236, 72, 153, 0.1)'
          }}>
            Love Stories & Reviews
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Real people, real connections, real happiness - see what our community says about their WinkVibe journey
          </p>
        </div>

        {/* Main Review Carousel */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 sm:p-12 border border-pink-200/50 overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-pink-200/30 to-transparent rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-rose-200/30 to-transparent rounded-full blur-2xl"></div>

            <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {/* Profile Image/Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-300 to-rose-300 rounded-full flex items-center justify-center text-4xl shadow-lg">
                  {reviews[currentReview].image}
                </div>
              </div>

              {/* Rating Stars */}
              <div className="flex justify-center mb-6">
                {renderStars(reviews[currentReview].rating)}
              </div>

              {/* Review Text */}
              <blockquote className="text-xl sm:text-2xl text-gray-700 text-center mb-8 leading-relaxed font-light italic">
                "{reviews[currentReview].text}"
              </blockquote>

              {/* Reviewer Info */}
              <div className="text-center">
                <h4 className="text-2xl font-bold text-gray-800 mb-2">
                  {reviews[currentReview].name}
                </h4>
                <p className="text-gray-600 mb-2">
                  Age {reviews[currentReview].age} • {reviews[currentReview].location}
                </p>
                <div className="inline-block px-4 py-2 bg-gradient-to-r from-pink-200 to-rose-200 rounded-full">
                  <span className="text-sm font-semibold text-pink-800">
                    {reviews[currentReview].relationship}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button 
              onClick={prevReview}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center text-pink-600 hover:text-pink-700"
            >
              ←
            </button>
            <button 
              onClick={nextReview}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center text-pink-600 hover:text-pink-700"
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
                    ? 'bg-pink-500 scale-125' 
                    : 'bg-pink-200 hover:bg-pink-300'
                }`}
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
              className="text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-pink-200/50 hover:border-pink-300/70 transition-all duration-300 hover:shadow-lg"
            >
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-3xl font-bold text-pink-600 mb-2">{stat.number}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}