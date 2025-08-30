// src/components/VersionsModal.js
import { useEffect, useState } from "react";
import { getVersions } from "../utils/api";

export default function VersionsModal({ docId, onClose }) {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!docId) return;
    const fetchVersions = async () => {
      try {
        const res = await getVersions(docId);
        setVersions(res.data.versions || []);
      } catch (err) {
        console.error("Error fetching versions:", err);
        alert("❌ Failed to fetch versions");
      } finally {
        setLoading(false);
      }
    };
    fetchVersions();
  }, [docId]);

  if (!docId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">📜 Version History</h2>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-700 font-semibold"
          >
            ✖ Close
          </button>
        </div>

        {loading ? (
          <p>Loading versions...</p>
        ) : versions.length === 0 ? (
          <p>No version history found.</p>
        ) : (
          <div className="space-y-4">
            {versions.map((v, i) => (
              <div key={i} className="bg-gray-50 p-4 rounded border">
                <h3 className="font-semibold text-lg">{v.title}</h3>
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
    </div>
  );
}
