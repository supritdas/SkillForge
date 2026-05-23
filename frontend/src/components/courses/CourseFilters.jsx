// components/courses/CourseFilters.jsx — Filter bar for the courses page

const CATEGORIES = ["All", "Web Development", "Mobile", "Data Science", "DevOps", "Design", "Other"];
const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"];

const CourseFilters = ({ filters, onChange }) => {
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value === "All" ? "" : value });
  };

  return (
    <div className="flex flex-wrap gap-3">
      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleChange("category", cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200
              ${
                (filters.category === cat) || (cat === "All" && !filters.category)
                  ? "bg-forge-500 text-white"
                  : "bg-dark-800 text-dark-300 hover:text-white border border-dark-700"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Level filter */}
      <div className="flex flex-wrap gap-2">
        {LEVELS.map((lvl) => (
          <button
            key={lvl}
            onClick={() => handleChange("level", lvl)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200
              ${
                (filters.level === lvl) || (lvl === "All" && !filters.level)
                  ? "bg-dark-600 text-white border border-dark-400"
                  : "bg-dark-800 text-dark-300 hover:text-white border border-dark-700"
              }`}
          >
            {lvl}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CourseFilters;
