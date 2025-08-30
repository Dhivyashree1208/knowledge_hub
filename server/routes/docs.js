import express from "express";
import Document from "../models/Document.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { summarizeDoc, generateTags, semanticSearch, answerQuestion } from "../utils/gemini.js";

const router = express.Router();

/**
 * Create document
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ error: "title and content required" });

    const summary = await summarizeDoc(content);
    const tags = await generateTags(content);

    const doc = new Document({
      title,
      content,
      summary,
      tags,
      createdBy: req.user.id,
      versions: [{
        title,
        content,
        summary,
        tags,
        editedAt: new Date(),
        editedBy: req.user.id
      }]
    });

    await doc.save();

    // Populate createdBy and versions.editedBy before sending
    const populatedDoc = await Document.findById(doc._id)
      .populate("createdBy", "name email")
      .populate("versions.editedBy", "name email");

    res.json(populatedDoc);
  } catch (err) {
    console.error("Create doc error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * Get all docs
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { tag, mine } = req.query;
    const filter = {};
    if (tag) filter.tags = tag;
    if (mine === "true") filter.createdBy = req.user.id;

    const docs = await Document.find(filter)
      .populate("createdBy", "name email")
      .populate("versions.editedBy", "name email")
      .sort({ updatedAt: -1 });

    res.json(docs);
  } catch (err) {
    console.error("Get docs error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * Get single doc
 */
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("versions.editedBy", "name email");

    if (!doc) return res.status(404).json({ error: "Document not found" });
    res.json(doc);
  } catch (err) {
    console.error("Get doc error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * Update doc
 */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, content, regenerate } = req.body;
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Document not found" });

    if (doc.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not allowed" });
    }

    if (title) doc.title = title;
    if (content) doc.content = content;

    if (regenerate || content) {
      doc.summary = await summarizeDoc(doc.content);
      doc.tags = await generateTags(doc.content);
    }

    doc.versions.push({
      title: doc.title,
      content: doc.content,
      summary: doc.summary,
      tags: doc.tags,
      editedAt: new Date(),
      editedBy: req.user.id
    });

    await doc.save();

    const populatedDoc = await Document.findById(doc._id)
      .populate("createdBy", "name email")
      .populate("versions.editedBy", "name email");

    res.json(populatedDoc);
  } catch (err) {
    console.error("Update doc error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * Delete doc
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Document not found" });
    if (doc.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not allowed" });
    }
    await doc.deleteOne();
    res.json({ message: "Document deleted" });
  } catch (err) {
    console.error("Delete doc error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * Text search
 */
router.get("/search/text", authMiddleware, async (req, res) => {
  try {
    const q = req.query.q || "";
    const regex = new RegExp(q, "i");
    const docs = await Document.find({
      $or: [
        { title: regex },
        { content: regex },
        { tags: { $in: [q] } }
      ]
    })
      .populate("createdBy", "name email")
      .populate("versions.editedBy", "name email");

    res.json(docs);
  } catch (err) {
    console.error("Text search error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * Semantic search
 */
router.get("/search/semantic", authMiddleware, async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.status(400).json({ error: "q query param required" });

    const docs = await Document.find().limit(200);
    const result = await semanticSearch(q, docs, 5);

    res.json(result);
  } catch (err) {
    console.error("Semantic search error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * Team Q&A
 */
router.post("/qa", authMiddleware, async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "question required" });

    const docs = await Document.find().limit(200);
    const answer = await answerQuestion(question, docs);

    res.json({ answer });
  } catch (err) {
    console.error("Team QA error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * Get version history
 */
router.get("/:id/versions", authMiddleware, async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id)
      .populate("versions.editedBy", "name email");

    if (!doc) return res.status(404).json({ error: "Document not found" });
    res.json({ versions: doc.versions || [] });
  } catch (err) {
    console.error("Get versions error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
