// pages/CoursesPage.jsx — Browse all courses with search and filters

import { useState } from "react";
import useCourses from "../hooks/useCourses";
import CourseCard from "../components/courses/CourseCard";
import CourseFilters from "../components/courses/CourseFilters";
import Spinner from "../components/ui/Spinner";

const CoursesPage = () => {
  const [filters, setFilters] = useState({ category: "", level: "", search: "" });

  // useCourses is a custom hook — it fetches courses whenever filters change
  const { courses, loading, error } = useCourses(filters);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* ── Page Header ──────────────────────────────── */}
      <div className="mb-10">
        <p className="section-label mb-2">Explore</p>
        <h1 className="text-4xl font-display font-bold text-white mb-4">All Courses</h1>
        <p className="text-dark-400 max-w-xl">
          Level up your tech skills. Every module you complete earns XP and updates your skill profile.
        </p>
      </div>

      {/* ── Search Bar ───────────────────────────────── */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search courses..."
          value={filters.search}
          onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
          className="input max-w-md"
        />
      </div>

      {/* ── Filters ──────────────────────────────────── */}
      <div className="mb-8">
        <CourseFilters filters={filters} onChange={setFilters} />
      </div>

      {/* ── Results ──────────────────────────────────── */}
      {loading && (
        <div className="flex justify-center items-center py-24">
          <Spinner size="lg" />
        </div>
      )}

      {error && (
        <div className="text-center py-16 text-red-400 font-mono">{error}</div>
      )}

      {!loading && !error && courses.length === 0 && (
        <div className="text-center py-24">
          <p className="text-5xl mb-4">🔍</p>
          <h3 className="font-display font-semibold text-white mb-2">No courses found</h3>
          <p className="text-dark-400 text-sm">Try adjusting your filters</p>
        </div>
      )}

      {!loading && courses.length > 0 && (
        <>
          <p className="text-dark-400 text-sm font-mono mb-6">
            {courses.length} course{courses.length !== 1 ? "s" : ""} found
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CoursesPage;
