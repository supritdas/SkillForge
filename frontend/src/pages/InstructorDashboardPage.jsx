// pages/InstructorDashboardPage.jsx — Instructor hub: create courses & view student progress

import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userAtom } from "../store/atoms";
import api from "../utils/api";
import CreateCourseForm from "../components/instructor/CreateCourseForm";
import InstructorCourseCard from "../components/instructor/InstructorCourseCard";
import Spinner from "../components/ui/Spinner";

const InstructorDashboardPage = () => {
  const user = useRecoilValue(userAtom);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchCourses = async () => {
    try {
      const { data } = await api.get("/instructor/courses");
      setCourses(data.courses || []);
    } catch (err) {
      console.error("Failed to load instructor courses", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  if (user && user.role !== "instructor" && user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  const totalStudents = courses.reduce((sum, c) => sum + (c.studentCount || 0), 0);
  const publishedCount = courses.filter((c) => c.isPublished).length;

  const handleCourseCreated = () => {
    setShowCreateForm(false);
    setLoading(true);
    fetchCourses();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="section-label mb-2">Instructor</p>
          <h1 className="text-3xl font-display font-bold text-white">
            Your <span className="gradient-text">Courses</span>
          </h1>
          <p className="text-dark-400 mt-1">
            Create courses and track how your students are progressing.
          </p>
        </div>
        {!showCreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary text-sm py-2"
          >
            + Create Course
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <div className="card text-center">
          <div className="text-2xl font-display font-bold text-white">{courses.length}</div>
          <div className="text-dark-400 text-xs font-mono mt-1">Courses Created</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-display font-bold text-forge-400">{totalStudents}</div>
          <div className="text-dark-400 text-xs font-mono mt-1">Total Enrollments</div>
        </div>
        <div className="card text-center col-span-2 sm:col-span-1">
          <div className="text-2xl font-display font-bold text-emerald-400">{publishedCount}</div>
          <div className="text-dark-400 text-xs font-mono mt-1">Published</div>
        </div>
      </div>

      {showCreateForm && (
        <div className="mb-8">
          <CreateCourseForm
            onCreated={handleCourseCreated}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      )}

      {courses.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-4xl mb-3">📚</p>
          <p className="text-dark-400 font-mono text-sm mb-4">
            You haven't created any courses yet.
          </p>
          {!showCreateForm && (
            <button onClick={() => setShowCreateForm(true)} className="btn-primary text-sm py-2">
              Create Your First Course →
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <p className="section-label">Student Progress by Course</p>
          {courses.map((course) => (
            <InstructorCourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorDashboardPage;
