import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDocs, deleteDoc, updateDoc } from "../utils/api";
import VersionsModal from "../pages/VersionsModal";

export default function Dashboard() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [filterTag, setFilterTag] = useState(null);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const navigate = useNavigate();

  // Fetch documents on load
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await getDocs();
        setDocs(res.data || []);
      } catch (err) {
        console.error("Error fetching docs:", err);
        alert("Failed to fetch documents");
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  // Delete doc
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    try {
      await deleteDoc(id);
      setDocs((prev) => prev.filter((doc) => doc._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete document");
    }
  };

  // Regenerate summary OR tags
  const handleRegenerate = async (id, type) => {
    setUpdatingId(id + type);
    try {
      const res = await updateDoc(id, { regenerate: type });
      setDocs((prev) =>
        prev.map((doc) => (doc._id === id ? res.data : doc))
      );
    } catch (err) {
      console.error("Regenerate failed:", err);
      alert(`Failed to regenerate ${type}`);
    } finally {
      setUpdatingId(null);
    }
  };

  // Collect all unique tags
  const allTags = [...new Set(docs.flatMap((d) => d.tags || []))];

  // Filtered docs based on tag
  const filteredDocs = filterTag
    ? docs.filter((doc) => doc.tags?.includes(filterTag))
    : docs;

  // Prepare Team Activity Feed: last 5 edited docs
  const lastEditedDocs = docs
    .map((doc) => {
      const lastVersion = doc.versions?.[doc.versions.length - 1];
      return lastVersion
        ? {
            _id: doc._id,
            title: doc.title,
            editedAt: lastVersion.editedAt,
            editedBy: lastVersion.editedBy?.name || "Unknown",
          }
        : null;
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.editedAt) - new Date(a.editedAt))
    .slice(0, 5);

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex gap-6">
      {/* Sidebar: Team Activity Feed */}
      <div className="w-1/4 bg-white p-4 shadow rounded">
        <h2 className="text-xl font-semibold mb-4">📝 Team Activity Feed</h2>
        {lastEditedDocs.length === 0 ? (
          <p>No recent edits</p>
        ) : (
          <ul className="space-y-2">
            {lastEditedDocs.map((item) => (
              <li key={item._id} className="border-b pb-2">
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-gray-500">
                  Edited by {item.editedBy} <br />
                  {new Date(item.editedAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1">
        {/* Versions Modal */}
        {selectedDocId && (
          <VersionsModal
            docId={selectedDocId}
            onClose={() => setSelectedDocId(null)}
          />
        )}

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">📚 Knowledge Hub</h1>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/add")}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              ➕ Add Document
            </button>
            <button
              onClick={() => navigate("/search")}
              className="bg-purple-500 text-white px-4 py-2 rounded"
            >
              🔍 Search
            </button>
            <button
              onClick={() => navigate("/qa")}
              className="bg-indigo-500 text-white px-4 py-2 rounded"
            >
              🤖 Q/A
            </button>
          </div>
        </div>

        {/* Dropdown Tag Filter */}
        {allTags.length > 0 && (
          <div className="mb-6">
            <label className="mr-2 font-semibold">Filter by Tag:</label>
            <select
              value={filterTag || ""}
              onChange={(e) => setFilterTag(e.target.value || null)}
              className="border px-3 py-2 rounded"
            >
              <option value="">All Documents</option>
              {allTags.map((tag, i) => (
                <option key={i} value={tag}>
                  #{tag}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Body */}
        {loading ? (
          <p>Loading documents...</p>
        ) : filteredDocs.length === 0 ? (
          <p>No documents found. Try adding one!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocs.map((doc) => (
              <div
                key={doc._id}
                className="bg-white p-4 shadow rounded hover:shadow-md transition"
              >
                <h2 className="text-xl font-semibold">{doc.title}</h2>
                <p className="text-gray-700 mt-2 line-clamp-3">{doc.summary}</p>

                {/* Tags inside card */}
                <div className="mt-2 flex flex-wrap gap-2">
                  {doc.tags?.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-gray-200 text-sm px-2 py-1 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Author */}
                <p className="text-sm text-gray-500 mt-2">
                  By: {doc.createdBy?.name || "Unknown"}
                </p>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    onClick={() => navigate(`/edit/${doc._id}`)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(doc._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setSelectedDocId(doc._id)}
                    className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                  >
                    Versions
                  </button>

                  {/* Regenerate Buttons */}
                  <button
                    onClick={() => handleRegenerate(doc._id, "summary")}
                    disabled={updatingId === doc._id + "summary"}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 disabled:opacity-50"
                  >
                    {updatingId === doc._id + "summary"
                      ? "⏳ Summarizing..."
                      : "📝 Summarize"}
                  </button>
                  <button
                    onClick={() => handleRegenerate(doc._id, "tags")}
                    disabled={updatingId === doc._id + "tags"}
                    className="bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600 disabled:opacity-50"
                  >
                    {updatingId === doc._id + "tags"
                      ? "⏳ Tagging..."
                      : "🏷 Generate Tags"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
