import React, { useState } from "react";
import Nav from "@/components/nav";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#EFE3C2]">
      <Nav />

      {/* Hero Section */}
      <div className="relative min-h-[40vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('/background-pattern.png')] opacity-10"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 pt-20">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-[#EFE3C2] to-[#D4B78F] text-transparent bg-clip-text">
            Contact Us
          </h1>
          <p className="text-xl text-[#EFE3C2]/80">
            Get in touch with our team
          </p>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-[#1E293B]/80 backdrop-blur-sm border border-[#EFE3C2]/20 rounded-3xl p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-[#EFE3C2] mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#0F172A]/50 border border-[#EFE3C2]/20 rounded-xl focus:outline-none focus:border-[#EFE3C2]/40 text-[#EFE3C2]"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-[#EFE3C2] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#0F172A]/50 border border-[#EFE3C2]/20 rounded-xl focus:outline-none focus:border-[#EFE3C2]/40 text-[#EFE3C2]"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-[#EFE3C2] mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#0F172A]/50 border border-[#EFE3C2]/20 rounded-xl focus:outline-none focus:border-[#EFE3C2]/40 text-[#EFE3C2]"
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-[#EFE3C2] mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                className="w-full px-4 py-3 bg-[#0F172A]/50 border border-[#EFE3C2]/20 rounded-xl focus:outline-none focus:border-[#EFE3C2]/40 text-[#EFE3C2]"
                placeholder="Your message..."
              ></textarea>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="px-8 py-3 bg-[#EFE3C2]/10 border border-[#EFE3C2]/20 hover:bg-[#EFE3C2]/20 rounded-full transition-colors text-[#EFE3C2]"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Contact Information */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1E293B]/80 backdrop-blur-sm border border-[#EFE3C2]/20 rounded-3xl p-6 text-center">
            <div className="text-2xl mb-3">📍</div>
            <h3 className="text-lg font-semibold mb-2">Address</h3>
            <p className="text-[#EFE3C2]/60">Harare, Zimbabwe</p>
          </div>
          
          <div className="bg-[#1E293B]/80 backdrop-blur-sm border border-[#EFE3C2]/20 rounded-3xl p-6 text-center">
            <div className="text-2xl mb-3">📧</div>
            <h3 className="text-lg font-semibold mb-2">Email</h3>
            <p className="text-[#EFE3C2]/60">info@chiremba.ai</p>
          </div>
          
          <div className="bg-[#1E293B]/80 backdrop-blur-sm border border-[#EFE3C2]/20 rounded-3xl p-6 text-center">
            <div className="text-2xl mb-3">📱</div>
            <h3 className="text-lg font-semibold mb-2">Phone</h3>
            <p className="text-[#EFE3C2]/60">+263 123 456 789</p>
          </div>
        </div>
      </div>
    </div>
  );
} 