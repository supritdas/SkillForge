// components/instructor/InstructorCourseCard.jsx — Course with student enrollment stats

import { useState } from "react";
import { Link } from "react-router-dom";

const StudentRow = ({ student }) => (
  <div className="flex items-center gap-3 p-3 bg-dark-900 rounded-xl border border-dark-700">
    <div className="w-9 h-9 bg-forge-gradient rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
      {student.name?.charAt(0) || "?"}
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-display font-medium text-white text-sm truncate">{student.name}</p>
      <p className="text-dark-500 text-xs font-mono">
        {student.completedModules} / {student.totalModules} modules
      </p>
    </div>
    <div className="text-right flex-shrink-0 w-24">
      <p className="font-mono font-bold text-forge-400 text-sm">{student.progress}%</p>
      <div className="w-full h-1 bg-dark-700 rounded-full mt-1">
        <div
          className="h-full bg-forge-gradient rounded-full"
          style={{ width: `${student.progress}%` }}
        />
      </div>
    </div>
  </div>
);

const InstructorCourseCard = ({ course }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="card">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="badge-blue">{course.category}</span>
            <span className="badge-orange">{course.level}</span>
            {course.isPublished ? (
              <span className="badge bg-emerald-500/10 text-emerald-400 border-emerald-500/30">Published</span>
            ) : (
              <span className="badge bg-dark-700 text-dark-400 border-dark-600">Draft</span>
            )}
          </div>
          <h3 className="font-display font-bold text-white text-lg">{course.title}</h3>
          <p className="text-dark-400 text-sm mt-1 line-clamp-2">{course.description}</p>
        </div>

        <div className="text-center px-4 py-2 bg-dark-900 rounded-xl border border-dark-700">
          <p className="text-2xl font-display font-bold text-forge-400">{course.studentCount}</p>
          <p className="text-dark-500 text-xs font-mono">Students</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm font-mono text-dark-400 mb-4">
        <span>📹 {course.totalModules} modules</span>
        <span>💲 {course.price === 0 ? "FREE" : `$${course.price}`}</span>
        <Link to={`/courses/${course._id}`} className="text-forge-400 hover:underline ml-auto">
          View course page →
        </Link>
      </div>

      {course.students?.length > 0 ? (
        <>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="w-full text-left text-sm font-mono text-forge-400 hover:underline mb-3"
          >
            {expanded ? "Hide" : "Show"} student progress ({course.students.length})
          </button>
          {expanded && (
            <div className="space-y-2">
              {course.students.map((student) => (
                <StudentRow key={student._id} student={student} />
              ))}
            </div>
          )}
        </>
      ) : (
        <p className="text-dark-500 text-sm font-mono text-center py-4 bg-dark-900 rounded-xl">
          No students enrolled yet.
        </p>
      )}
    </div>
  );
};

export default InstructorCourseCard;
