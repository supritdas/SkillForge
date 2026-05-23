// components/instructor/CreateCourseForm.jsx — Create a new course (instructor)

import { useState } from "react";
import api from "../../utils/api";
import useToast from "../../hooks/useToast";
import Spinner from "../ui/Spinner";

const emptyModule = () => ({
  title: "",
  description: "",
  videoUrl: "",
  duration: 0,
  order: 1,
  skills: "",
});

const CATEGORIES = [
  "Web Development",
  "Mobile",
  "Data Science",
  "DevOps",
  "Design",
  "Other",
];

const LEVELS = ["Beginner", "Intermediate", "Advanced"];

const CreateCourseForm = ({ onCreated, onCancel }) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: 0,
    category: "Web Development",
    level: "Beginner",
    thumbnail: "",
    tags: "",
    isPublished: false,
  });
  const [modules, setModules] = useState([emptyModule()]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    }));
  };

  const updateModule = (index, field, value) => {
    setModules((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m))
    );
  };

  const addModule = () => {
    setModules((prev) => [...prev, { ...emptyModule(), order: prev.length + 1 }]);
  };

  const removeModule = (index) => {
    if (modules.length <= 1) return;
    setModules((prev) =>
      prev.filter((_, i) => i !== index).map((m, i) => ({ ...m, order: i + 1 }))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        tags: form.tags
          ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
        modules: modules
          .filter((m) => m.title.trim())
          .map((m, i) => ({
            title: m.title,
            description: m.description,
            videoUrl: m.videoUrl,
            duration: Number(m.duration) || 0,
            order: i + 1,
            skills: m.skills
              ? m.skills.split(",").map((s) => s.trim()).filter(Boolean)
              : [],
          })),
      };

      const { data } = await api.post("/courses", payload);
      showToast(data.message || "Course created!", "success");
      setForm({
        title: "",
        description: "",
        price: 0,
        category: "Web Development",
        level: "Beginner",
        thumbnail: "",
        tags: "",
        isPublished: false,
      });
      setModules([emptyModule()]);
      onCreated?.(data.course);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to create course", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card border-forge-500/30 space-y-5">
      <div className="flex items-center justify-between">
        <p className="section-label">Create New Course</p>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-ghost text-sm py-1">
            Cancel
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm text-dark-300 mb-1.5 font-mono">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="input"
            placeholder="React Masterclass"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm text-dark-300 mb-1.5 font-mono">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={3}
            className="input resize-none"
            placeholder="What students will learn..."
          />
        </div>

        <div>
          <label className="block text-sm text-dark-300 mb-1.5 font-mono">Price ($)</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            min={0}
            required
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm text-dark-300 mb-1.5 font-mono">Thumbnail URL</label>
          <input
            name="thumbnail"
            value={form.thumbnail}
            onChange={handleChange}
            className="input"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm text-dark-300 mb-1.5 font-mono">Category</label>
          <select name="category" value={form.category} onChange={handleChange} className="input">
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-dark-300 mb-1.5 font-mono">Level</label>
          <select name="level" value={form.level} onChange={handleChange} className="input">
            {LEVELS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm text-dark-300 mb-1.5 font-mono">Tags (comma-separated)</label>
          <input
            name="tags"
            value={form.tags}
            onChange={handleChange}
            className="input"
            placeholder="react, javascript, frontend"
          />
        </div>

        <label className="sm:col-span-2 flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="isPublished"
            checked={form.isPublished}
            onChange={handleChange}
            className="rounded border-dark-600"
          />
          <span className="text-sm text-dark-300 font-mono">Publish course (visible in catalog)</span>
        </label>
      </div>

      {/* Modules */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="section-label">Modules</p>
          <button type="button" onClick={addModule} className="text-xs text-forge-400 hover:underline font-mono">
            + Add module
          </button>
        </div>

        <div className="space-y-4">
          {modules.map((mod, index) => (
            <div key={index} className="p-4 bg-dark-900 rounded-xl border border-dark-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-dark-400">Module {index + 1}</span>
                {modules.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeModule(index)}
                    className="text-xs text-red-400 hover:underline font-mono"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                value={mod.title}
                onChange={(e) => updateModule(index, "title", e.target.value)}
                className="input"
                placeholder="Module title"
                required={index === 0}
              />
              <input
                value={mod.description}
                onChange={(e) => updateModule(index, "description", e.target.value)}
                className="input"
                placeholder="Short description"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={mod.videoUrl}
                  onChange={(e) => updateModule(index, "videoUrl", e.target.value)}
                  className="input"
                  placeholder="Video URL"
                />
                <input
                  type="number"
                  value={mod.duration}
                  onChange={(e) => updateModule(index, "duration", e.target.value)}
                  className="input"
                  placeholder="Duration (min)"
                  min={0}
                />
              </div>
              <input
                value={mod.skills}
                onChange={(e) => updateModule(index, "skills", e.target.value)}
                className="input"
                placeholder="Skills (comma-separated)"
              />
            </div>
          ))}
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
        {loading ? <Spinner size="sm" /> : null}
        {loading ? "Creating..." : "Create Course →"}
      </button>
    </form>
  );
};

export default CreateCourseForm;
