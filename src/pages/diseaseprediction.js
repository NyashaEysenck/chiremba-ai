import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import Nav from "@/components/nav";

export default function DiseasePrediction() {
  const [symptom, setSymptom] = useState("");
  const [symptoms, setSymptoms] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");

  const handleAddSymptom = () => {
    if (symptom.trim() && !symptoms.includes(symptom)) {
      setSymptoms([...symptoms, symptom]);
      setSymptom("");
    }
  };

  const handleRemoveSymptom = (symptomToRemove) => {
    setSymptoms(symptoms.filter((s) => s !== symptomToRemove));
  };

  const handlePredict = async () => {
    if (symptoms.length === 0) return;
    setLoading(true);
    setError("");
    setWarning("");
    setResult(null);

    const prompt = `You are a medical AI that provides disease predictions based on symptoms.

    Given these symptoms: "${symptoms.join(", ")}", return a JSON object with **only** the following structure:
    
    {
      "condition": "Most likely condition (or a general response if symptoms are insufficient)",
      "confidence": 0.00, 
      "probability": "Probability description, including advice.",
      "note": "If symptoms are too few, say 'Insufficient symptoms for precise diagnosis'. If input is invalid (not symptoms), say 'Invalid input: Please enter real disease symptoms'."
    }
    
    **Strict rules:**
    - Return **only** valid JSON.
    - Use a confidence score between **0.00 and 1.00**.
    - Format probability with a descriptive range like **'Low to Moderate'** with a brief medical suggestion.
    - If symptoms are insufficient, make a general assessment of common scenarios (Nothing technical at all, keep it simple) but add "note": "Insufficient symptoms for precise diagnosis".
    - If the input is invalid, return "note": "Invalid input: Please enter real disease symptoms" and "condition": "N/A".
    - Do NOT include markdown formatting (\`\`\`json or \`\`\`).
    - Do NOT add any explanations, forward slashes, or additional text.
    
    Only output the JSON object.`;

    try {
      const response = await fetch("http://127.0.0.1:8001/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const text = await response.text();
      console.log("Raw API Response:", text);

      try {
        const outerJson = JSON.parse(text);
        const data = JSON.parse(outerJson.response);
        console.log(data);

        if (data.note === "Insufficient symptoms for precise diagnosis") {
          setWarning("⚠️ Not enough symptoms for a precise prediction. Here's a general assessment:");
          setResult(data);
        } else if (data.note === "Invalid input: Please enter real disease symptoms") {
          setError("❌ Invalid input. Please enter real disease symptoms.");
        } else {
          setResult(data);
        }
      } catch (jsonError) {
        setError("Invalid JSON format from server.");
      }
    } catch (error) {
      setError("Failed to fetch prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Nav />
      <main className="container mx-auto px-4 py-8">
        <Card className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 max-w-lg mx-auto mt-10">
          <h2 className="text-2xl font-bold text-white mb-4">Disease Prediction</h2>

          {/* Symptom Input */}
          <div className="flex space-x-2 mb-4">
            <Input
              value={symptom}
              onChange={(e) => setSymptom(e.target.value)}
              placeholder="Enter a symptom"
              className="flex-1 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              onClick={handleAddSymptom}
              className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-2xl hover:opacity-90 transition"
            >
              Add
            </Button>
          </div>

          {/* Symptoms List */}
          <div className="mt-4 flex flex-wrap gap-2">
            {symptoms.map((s, index) => (
              <Badge
                key={index}
                className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold rounded-lg px-3 py-1 cursor-pointer hover:bg-opacity-80 transition"
                onClick={() => handleRemoveSymptom(s)}
              >
                {s} ✕
              </Badge>
            ))}
          </div>

          {/* Predict Button */}
          <Button
            className="mt-6 w-full py-2 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-2xl hover:opacity-90 transition"
            onClick={handlePredict}
            disabled={loading || symptoms.length === 0}
          >
            {loading ? "Predicting..." : "Predict Condition"}
          </Button>

          {/* Error and Warning Messages */}
          {error && (
            <Alert className="mt-4 bg-red-500/10 backdrop-blur-sm text-red-400 rounded-2xl p-3">
              {error}
            </Alert>
          )}
          {warning && (
            <Alert className="mt-4 bg-yellow-500/10 backdrop-blur-sm text-yellow-400 rounded-2xl p-3">
              {warning}
            </Alert>
          )}

          {/* Prediction Result */}
          {result && (
            <CardContent className="mt-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
              <div className="space-y-2">
                <p className="text-slate-300 font-semibold">
                  Condition: <span className="text-white">{result.condition}</span>
                </p>
                <p className="text-slate-300">
                  Confidence: <span className="text-white">{result.confidence}</span>
                </p>
                <p className="text-slate-300">
                  Probability: <span className="text-white">{result.probability}</span>
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </main>
    </div>
  );
}
