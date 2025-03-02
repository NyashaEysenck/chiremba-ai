import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { createWorker } from "tesseract.js";
import Nav from "@/components/nav";
import axios from "axios";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content: "Hello! I'm your personal AI Assistant Doctor.",
      timestamp: "10:25",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechResult, setSpeechResult] = useState("");

  const sampleQuestions = [
    "What are the symptoms of pneumonia?",
    "How can I manage sugar spikes after dinner?",
    "What are the early signs before heart attack?",
  ];

  const [showSampleQuestions, setShowSampleQuestions] = useState(true);

  const handleSampleQuestionClick = (question) => {
    setInput(question);
    setShowSampleQuestions(false);
  };

  useEffect(() => {
    setIsTyping(!!input.trim());
  }, [input]);

  const handleSend = async () => {
    if (input.trim()) {
      const newMessage = {
        type: "user",
        content: input.trim(),
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, newMessage]);
      setInput("");
      setIsLoading(true);

      try {
        const response = await axios.post("http://127.0.0.1:8001/generate", {
          prompt: `Assume role of Specialist AI Doctor, Provide a short, precise response for the query: ${input.trim()}`,
        });
        const botResponse = {
          type: "bot",
          content: response.data.response,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prevMessages) => [...prevMessages, botResponse]);
      } catch (error) {
        console.error("Error fetching AI response:", error);
        const botResponse = {
          type: "bot",
          content: "Sorry, I couldn't process your request at the moment.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prevMessages) => [...prevMessages, botResponse]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFileUpload = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async () => {
          const newMessage = {
            type: "user",
            content: reader.result, // Base64 encoded image data
            isImage: true,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
          setMessages((prevMessages) => [...prevMessages, newMessage]);

          const worker = await createWorker();
          await worker.load();
          await worker.loadLanguage("eng");
          await worker.initialize("eng");
          const { data } = await worker.recognize(reader.result);
          const ocrMessage = {
            type: "bot",
            content: data.text,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
          setMessages((prevMessages) => [...prevMessages, ocrMessage]);
          await worker.terminate();
        };
        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  };

  const handleVoiceInput = () => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");
      setSpeechResult(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInput(speechResult); // Set the input value to the speech result
    };

    recognition.start();
  };

  const handleAudioRecord = () => {
    if (isListening) {
      setIsListening(false);
      setInput(speechResult); // Set the input value to the speech result
    } else {
      setSpeechResult("");
      handleVoiceInput();
    }
  };

  const handleTextToSpeech = (text) => {
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      if (text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => setIsSpeaking(false);
        speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    }
  };

  return (
    <>
      <Head>
        <title>Chatbot</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Nav />

        <main className="container mx-auto px-4 py-8">
          {/* Chat Messages */}
          <div className="flex flex-col space-y-4 mb-8">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.type === "bot" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`max-w-md px-6 py-4 rounded-2xl shadow-lg ${
                    message.type === "bot"
                      ? "bg-white/10 backdrop-blur-sm border border-white/10"
                      : "bg-gradient-to-r from-blue-500 to-emerald-500"
                  }`}
                >
                  {message.isImage ? (
                    <>
                      <img
                        src={message.content}
                        alt="Uploaded content"
                        className="rounded-lg max-w-full"
                      />
                      {message.type === "bot" && (
                        <p className="text-slate-400 mt-2">{message.content}</p>
                      )}
                    </>
                  ) : (
                    <p
                      className={`${
                        message.type === "bot" ? "text-slate-300" : "text-white"
                      }`}
                    >
                      {message.content}
                    </p>
                  )}
                  <span className="text-xs text-slate-500">
                    {message.timestamp}
                  </span>
                  {message.type === "bot" && (
                    <button
                      onClick={() => handleTextToSpeech(message.content)}
                      className="absolute bottom-2 right-2 p-1 bg-blue-500/10 backdrop-blur-sm rounded-full hover:bg-blue-500/20 transition"
                    >
                      {isSpeaking ? "Stop" : "🔊"}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="px-6 py-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10">
                  <div className="flex space-x-1">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sample Questions */}
          {showSampleQuestions && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {sampleQuestions.map((question, index) => (
                <div
                  key={index}
                  className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/20 transition cursor-pointer"
                  onClick={() => handleSampleQuestionClick(question)}
                >
                  <p className="text-slate-300">{question}</p>
                </div>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="sticky bottom-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-4">
            <div className="flex items-center space-x-4">
              <button
                className={`p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition ${
                  isListening ? "animate-pulse" : ""
                }`}
                onClick={handleAudioRecord}
              >
                <img src="/mic.svg" alt="Record Audio" className="w-5 h-5" />
              </button>
              <button
                className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition"
                onClick={handleFileUpload}
              >
                <img
                  src="/attachfile.svg"
                  alt="Attach File"
                  className="w-5 h-5"
                />
              </button>
              <input
                type="text"
                placeholder="Take a follow-up on your health by asking queries..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 px-6 py-2 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-2xl hover:opacity-90 transition"
                onClick={handleSend}
              >
                Send
              </button>
            </div>
          </div>
        </main>

        {/* Listening Overlay */}
        {isListening && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
            <div className="bg-slate-800 p-6 rounded-2xl shadow-lg text-center">
              <p className="text-lg font-bold text-slate-300 mb-4">
                Listening...
              </p>
              <p className="text-slate-400">{speechResult}</p>
              <button
                className="mt-4 px-6 py-2 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition"
                onClick={handleAudioRecord}
              >
                Stop
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Chatbot;