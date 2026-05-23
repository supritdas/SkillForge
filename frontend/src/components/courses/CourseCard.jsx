// components/courses/CourseCard.jsx — Displays a single course in a card

import { Link } from "react-router-dom";

const LEVEL_COLORS = {
  Beginner: "badge-green",
  Intermediate: "badge-orange",
  Advanced: "bg-red-500/15 text-red-400 border border-red-500/20 badge",
};

const CourseCard = ({ course }) => {
  const {
    _id,
    title,
    description,
    instructor,
    price,
    thumbnail,
    category,
    level,
    modules,
    studentsEnrolled,
    rating,
  } = course;

  return (
    <Link to={`/courses/${_id}`} className="group block">
      <div className="card hover:border-forge-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">

        {/* Thumbnail */}
        <div className="w-full h-44 bg-dark-700 rounded-xl overflow-hidden mb-4 relative">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            // Placeholder with gradient
            <div className="w-full h-full bg-forge-gradient opacity-20 flex items-center justify-center">
              <span className="text-5xl">📚</span>
            </div>
          )}

          {/* Price chip */}
          <div className="absolute top-3 right-3 bg-dark-900/80 backdrop-blur-sm px-2 py-1 rounded-lg">
            <span className="font-mono font-bold text-forge-400 text-sm">
              {price === 0 ? "FREE" : `$${price}`}
            </span>
          </div>
        </div>

        {/* Meta badges */}
        <div className="flex items-center gap-2 mb-3">
          <span className="badge-blue text-xs">{category}</span>
          <span className={`${LEVEL_COLORS[level] || "badge-green"} text-xs`}>{level}</span>
        </div>

        {/* Title & description */}
        <h3 className="font-display font-semibold text-white text-base mb-2 line-clamp-2 group-hover:text-forge-400 transition-colors">
          {title}
        </h3>
        <p className="text-dark-400 text-sm line-clamp-2 flex-1">{description}</p>

        {/* Footer stats */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-dark-700">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-forge-gradient rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {instructor?.name?.charAt(0) || "I"}
              </span>
            </div>
            <span className="text-dark-400 text-xs">{instructor?.name || "Instructor"}</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-dark-400">
            <span>📹 {modules?.length || 0} modules</span>
            <span>👥 {studentsEnrolled?.length || 0}</span>
            {rating?.average > 0 && <span>⭐ {rating.average.toFixed(1)}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
