import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { searchDocs, semanticSearch } from "../utils/api";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("text"); // "text" | "semantic"

  const navigate = useNavigate();
  const location = useLocation();

  // Read query param (e.g., /search?q=React&mode=semantic)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    const m = params.get("mode") || "text";

    setQuery(q);
    setMode(m);

    if (q) {
      handleSearch(q, m);
    }
  }, [location.search]);

  const handleSearch = async (q, m = "text") => {
    setLoading(true);
    try {
      let res;
      if (m === "semantic") {
        res = await semanticSearch(q);
        setResults(res.data?.items || []);
      } else {
        res = await searchDocs(q);
        setResults(res.data || []);
      }
    } catch (err) {
      console.error("Search failed:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🔍 Search Documents</h1>
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
          placeholder="Enter search term..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={() => navigate(`/search?q=${query}&mode=text`)}
          className="px-4 py-2 rounded bg-blue-600 text-white"
        >
          Text Search
        </button>

        {/* ✅ Semantic Search button removed */}
      </div>

      {/* Results */}
      {loading ? (
        <p>Searching...</p>
      ) : results.length === 0 ? (
        <p>No documents found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((doc, i) =>
            mode === "semantic" ? (
              <div
                key={i}
                className="bg-white p-4 shadow rounded hover:shadow-md transition"
              >
                <h2 className="text-lg font-semibold">{doc.title}</h2>
                <p className="text-gray-600 mt-2">{doc.reason}</p>
              </div>
            ) : (
              <div
                key={doc._id}
                className="bg-white p-4 shadow rounded hover:shadow-md transition"
              >
                <h2 className="text-lg font-semibold">{doc.title}</h2>
                <p className="text-gray-600 mt-2 line-clamp-3">{doc.summary}</p>

                {/* Tags */}
                <div className="mt-2 flex flex-wrap gap-2">
                  {doc.tags?.map((tag, j) => (
                    <span
                      key={j}
                      onClick={() =>
                        navigate(`/search?q=${tag}&mode=semantic`)
                      }
                      className="bg-gray-200 text-sm px-2 py-1 rounded cursor-pointer hover:bg-gray-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
