import { useState } from "react";
import { askQuestion } from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function QA() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAsk = async () => {
    if (!question.trim()) return alert("Please enter a question!");
    setLoading(true);
    try {
      const res = await askQuestion(question);

      // ✅ Don't override backend message
      setAnswer(res.data.answer?.trim() || "❌ Failed: empty response");
    } catch (err) {
      console.error("Q/A failed:", err);
      setAnswer("❌ Failed to get answer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🤖 Team Q/A</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          ⬅ Back
        </button>
      </div>

      {/* Input */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Ask a question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={handleAsk}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Ask
        </button>
      </div>

      {/* Answer */}
      {loading ? (
        <p>🤔 Thinking...</p>
      ) : (
        answer && (
          <div className="bg-white p-4 shadow rounded">
            <h2 className="font-semibold">Answer:</h2>
            <p className="mt-2">{answer}</p>
          </div>
        )
      )}
    </div>
  );
}
