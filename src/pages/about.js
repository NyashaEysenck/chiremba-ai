import React from "react";
import Nav from "@/components/nav";
import Link from "next/link";

const About = () => {
  const features = [
    {
      title: "AI Diagnostics",
      description: "Advanced health assessments powered by artificial intelligence",
      icon: "🤖"
    },
    {
      title: "Medical Imaging",
      description: "Accurate disease detection through image analysis",
      icon: "🔬"
    },
    {
      title: "Virtual Care",
      description: "Connect with healthcare professionals remotely",
      icon: "👨‍⚕️"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <Nav />

      {/* Hero Section with Animated Background */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-gradient"></div>
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-7xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#EFE3C2] to-white">
            About Chiremba
          </h1>
          <p className="text-2xl text-[#EFE3C2]/80 max-w-3xl mx-auto">
            Revolutionizing Healthcare Through AI
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-[#EFE3C2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* Mission Section */}
      <div className="relative bg-[#1E293B] py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-[#EFE3C2]">Our Mission</h2>
              <p className="text-xl text-[#EFE3C2]/80 leading-relaxed">
                Chiremba is an innovative AI-driven health diagnosis system designed to enhance 
                healthcare accessibility and efficiency, particularly for individuals in remote, 
                rural, and underserved areas of Zimbabwe.
              </p>
              <div className="flex gap-4">
                <div className="h-2 w-20 bg-blue-600 rounded-full"></div>
                <div className="h-2 w-12 bg-purple-600 rounded-full"></div>
                <div className="h-2 w-8 bg-pink-600 rounded-full"></div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl transform rotate-3"></div>
              <div className="relative bg-[#0F172A] border border-[#EFE3C2]/20 rounded-3xl p-8 -rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="space-y-6">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="text-3xl">{feature.icon}</div>
                      <div>
                        <h3 className="text-lg font-semibold text-[#EFE3C2]">{feature.title}</h3>
                        <p className="text-[#EFE3C2]/60">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vision Section */}
      <div className="relative bg-[#0F172A] py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="grid grid-cols-2 gap-4">
                {[
                  "Reducing travel time",
                  "Cutting costs",
                  "24/7 availability",
                  "AI-powered care"
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="bg-[#1E293B] border border-[#EFE3C2]/20 rounded-2xl p-6 hover:bg-[#1E293B]/80 transition-colors"
                  >
                    <p className="text-[#EFE3C2] font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 md:order-2 space-y-8">
              <h2 className="text-4xl font-bold text-[#EFE3C2]">Our Vision</h2>
              <p className="text-xl text-[#EFE3C2]/80 leading-relaxed">
                We envision a future where healthcare services are universally accessible, 
                regardless of geographic location or financial constraints.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-[#1E293B] py-32">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-[#EFE3C2] mb-8">
            Join Us in Transforming Healthcare
          </h2>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;