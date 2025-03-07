import Navbar from "@/components/navbar";
import Typewriter from "typewriter-effect";
import { parseCookies } from "nookies";
import Link from 'next/link';

export default function Home({ username }) {
  const cards = [
    {
      title: "Complete Health History",
      description: "Get tailored advice just for you.",
      icon: "📋",
      link: "/medicaldata/activecomplaint",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Chat with AI Doctor",
      description: "Talk to your AI doctor anytime.",
      icon: "🤖",
      link: "/chatbot",
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Disease Prediction",
      description: "Enter symptoms to predict possible conditions.",
      icon: "🔮",
      link: "/diseaseprediction",
      color: "from-green-500 to-green-600"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation Bar */}
      <Navbar />

      {/* Hero Section */}
      <div className="relative">
        <div className="container mx-auto px-4 pt-32 pb-20">
          {/* Main Content Area */}
          <div className="max-w-6xl mx-auto text-center mb-20">
            {/* Floating Label */}
            <div className="inline-block p-2 px-6 bg-blue-500/10 rounded-full text-blue-400 font-medium mb-6">
              Your AI Healthcare Companion
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-8">
              Hi {username}, I am your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">AI Health Assistant</span>
            </h1>

            {/* Animated Typewriter Text */}
            <div className="text-xl md:text-2xl text-slate-300 h-20 mb-10">
              <Typewriter
                options={{
                  strings: [
                    "Transforming healthcare with AI.",
                    "Your virtual doctor, always ready.",
                    "Empowering healthcare with intelligence.",
                    "AI-driven diagnostics for better care.",
                  ],
                  autoStart: true,
                  loop: true,
                  deleteSpeed: 20,
                  delay: 50,
                }}
              />
            </div>
          </div>

          {/* Features Grid Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {cards.map((card, index) => (
              <Link key={index} href={card.link}>
                <div className="group h-full p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                  {/* Feature Icon */}
                  <div className={`w-12 h-12 mb-4 rounded-lg bg-gradient-to-r ${card.color} flex items-center justify-center text-2xl`}>
                    {card.icon}
                  </div>
                  {/* Feature Title */}
                  <h3 className="text-xl font-bold text-white mb-2">
                    {card.title}
                  </h3>
                  {/* Feature Description */}
                  <p className="text-slate-400">
                    {card.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const cookies = parseCookies(context);
  const username = cookies.username || "Guest";
  return {
    props: { username },
  };
}