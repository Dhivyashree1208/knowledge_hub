import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDoc, updateDoc } from "../utils/api";

export default function EditDoc() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // fetch existing doc
  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const data = await getDoc(id);
        setTitle(data.title);
        setContent(data.content);
      } catch (err) {
        console.error("Fetch doc error:", err);
        alert("Failed to load document");
      } finally {
        setLoading(false);
      }
    };
    fetchDoc();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateDoc(id, { title, content, regenerate: true }); // regenerate summary/tags
      navigate("/dashboard");
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update document");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-4">✏️ Edit Document</h2>

        <label className="block mb-2 font-medium">Title</label>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded mb-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="block mb-2 font-medium">Content</label>
        <textarea
          className="w-full border px-3 py-2 rounded mb-4 h-40"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          {saving ? "Updating..." : "Update Document"}
        </button>
      </form>
    </div>
  );
}
