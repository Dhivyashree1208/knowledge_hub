import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getVersions } from "../utils/api";

export default function Versions() {
  const { id } = useParams();
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const res = await getVersions(id);
        setVersions(res.data.versions || []);
      } catch (err) {
        console.error("Error fetching versions:", err);
        alert("Failed to fetch versions ❌");
      } finally {
        setLoading(false);
      }
    };
    fetchVersions();
  }, [id]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📜 Document Versions</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          ⬅ Back
        </button>
      </div>

      {loading ? (
        <p>Loading versions...</p>
      ) : versions.length === 0 ? (
        <p>No version history found.</p>
      ) : (
        <div className="space-y-4">
          {versions.map((v, i) => (
            <div key={i} className="bg-white p-4 shadow rounded">
              <h2 className="font-semibold text-lg">{v.title}</h2>
              <p className="text-gray-700 mt-2">{v.summary}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {v.tags.map((tag, j) => (
                  <span
                    key={j}
                    className="bg-gray-200 text-sm px-2 py-1 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Edited by: {v.editedBy?.name || "Unknown"} |{" "}
                {new Date(v.editedAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
