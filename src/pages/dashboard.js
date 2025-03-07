/**
 * Patient Dashboard Component
 * Main interface for users to access health services and view their medical information
 * Features:
 * - Quick access to consultations and chat
 * - Health vitals overview
 * - Personalized user information
 */

import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";         // For session management
import { useRouter } from "next/router";           // For navigation
import Nav from "@/components/nav";                // Navigation component
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const PatientDashboard = () => {
  const router = useRouter();
  const [cookies] = useCookies(["username"]);      // Get user session
  const [user, setUser] = useState(null);          // User state

  // Define main action cards for quick access to key features
  const mainActions = [
    {
      title: "Start Consultation",
      description: "Chat with Chiremba",
      icon: "👨‍⚕️",
      link: "/chatbot",
      color: "bg-gradient-to-r from-blue-500 to-cyan-500"
    },
    {
      title: "Chat with Chiremba",
      description: "Get instant AI medical advice",
      icon: "🤖",
      link: "/chatbot",
      color: "bg-gradient-to-r from-violet-500 to-purple-500"
    },
    {
      title: "View Health Records",
      description: "Access your medical history",
      icon: "📋",
      link: "/history",
      color: "bg-gradient-to-r from-emerald-500 to-teal-500"
    }
  ];

  // Sample vital signs data (to be replaced with real data from API)
  const vitalSigns = [
    { name: "Blood Pressure", value: "120/80", unit: "mmHg", status: "normal" },
    { name: "Heart Rate", value: "72", unit: "bpm", status: "normal" },
    { name: "Temperature", value: "36.6", unit: "°C", status: "normal" },
    { name: "SpO2", value: "98", unit: "%", status: "normal" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Navigation Bar */}
      <Nav />

      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Welcome Banner with User Profile */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-8">
          <div className="flex items-center gap-6">
            {/* User Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-3xl">
                {user?.username?.[0]?.toUpperCase() || 'G'}
              </div>
              {/* Online Status Indicator */}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">
                ✓
              </div>
            </div>
            {/* Welcome Message */}
            <div>
              <h1 className="text-3xl font-bold text-white">
                Welcome back, {user?.username || "Guest"}
              </h1>
              <p className="text-gray-300 mt-1">
                Let's check your health status with Chiremba AI
              </p>
            </div>
          </div>
        </div>

        {/* Quick Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {mainActions.map((action, index) => (
            <button
              key={index}
              onClick={() => router.push(action.link)}
              className="group relative overflow-hidden rounded-3xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className={`${action.color} p-6 h-full`}>
                <div className="flex flex-col h-full">
                  {/* Action Icon */}
                  <span className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                    {action.icon}
                  </span>
                  {/* Action Title */}
                  <h3 className="text-xl font-bold text-white mb-2">
                    {action.title}
                  </h3>
                  {/* Action Description */}
                  <p className="text-white/80">
                    {action.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Health Overview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Vital Signs Panel */}
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-md rounded-3xl p-8">
            <h2 className="text-xl font-bold text-white mb-6">Vital Signs</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {vitalSigns.map((vital, index) => (
                <div key={index} className="bg-white/5 rounded-2xl p-4">
                  <h3 className="text-gray-400 text-sm mb-2">{vital.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white">{vital.value}</span>
                    <span className="text-gray-400 text-sm">{vital.unit}</span>
                  </div>
                  <span className="inline-block px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full mt-2">
                    {vital.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Health Score */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8">
            <h2 className="text-xl font-bold text-white mb-6">Health Score</h2>
            <div className="w-48 h-48 mx-auto">
              <CircularProgressbar
                value={85}
                text={`85%`}
                styles={buildStyles({
                  pathColor: `rgba(62, 152, 199)`,
                  textColor: '#fff',
                  trailColor: 'rgba(255,255,255,0.1)',
                  backgroundColor: '#3e98c7',
                })}
              />
            </div>
            <p className="text-center text-gray-300 mt-4">
              Your health is in good condition
            </p>
          </div>
        </div>

        {/* Recent Activity & Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Recent Activity */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8">
            <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {[1,2,3].map((_, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-xl">
                    📊
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Health Check Completed</h3>
                    <p className="text-gray-400 text-sm">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chiremba's Recommendations */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8">
            <h2 className="text-xl font-bold text-white mb-6">Chiremba's Insights</h2>
            <div className="space-y-4">
              {[1,2,3].map((_, index) => (
                <div key={index} className="p-4 bg-white/5 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">💡</span>
                    <div>
                      <p className="text-white">Schedule your next health check-up</p>
                      <p className="text-gray-400 text-sm mt-1">
                        Recommended within 2 weeks
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;