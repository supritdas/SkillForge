// pages/CourseDetailPage.jsx — Full detail view for a single course

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userAtom } from "../store/atoms";
import api from "../utils/api";
import ModuleList from "../components/courses/ModuleList";
import Spinner from "../components/ui/Spinner";
import useToast from "../hooks/useToast";

const CourseDetailPage = () => {
  const { id } = useParams();
  const user = useRecoilValue(userAtom);
  const setUser = useSetRecoilState(userAtom);
  const { showToast } = useToast();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState(null);

  // ── Fetch course data on mount ──────────────────────────────────────────────
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await api.get(`/courses/${id}`);
        setCourse(data.course);
      } catch (err) {
        setError("Course not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  // ── Enrollment ──────────────────────────────────────────────────────────────
  const handleEnroll = async () => {
    if (!user) {
      showToast("Please log in to enroll!", "error");
      return;
    }
    setEnrolling(true);
    try {
      const { data } = await api.post(`/courses/${id}/enroll`);
      showToast(data.message, "success");
      // Update user in global Recoil state
      setUser(data.user);
    } catch (err) {
      showToast(err.response?.data?.message || "Enrollment failed", "error");
    } finally {
      setEnrolling(false);
    }
  };

  // ── Derived state ───────────────────────────────────────────────────────────
  const instructorId = course?.instructor?._id || course?.instructor;
  const isCourseOwner =
    user &&
    instructorId &&
    (instructorId.toString() === user._id?.toString() ||
      instructorId === user._id) &&
    (user.role === "instructor" || user.role === "admin");

  // Find this course in the user's enrolledCourses array (students only)
  const enrollment = !isCourseOwner
    ? user?.enrolledCourses?.find(
        (e) => e.course?._id === id || e.course === id
      )
    : null;
  const isEnrolled = !!enrollment;

  // ── Render ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="text-center py-24 text-red-400 font-mono">{error}</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Left: Course Info ─────────────────────────────── */}
        <div className="lg:col-span-2 space-y-8">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-dark-400 font-mono">
            <Link to="/courses" className="hover:text-forge-400 transition-colors">
              Courses
            </Link>
            <span>/</span>
            <span className="text-dark-200">{course.title}</span>
          </div>

          {/* Header */}
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="badge-blue">{course.category}</span>
              <span className="badge-orange">{course.level}</span>
              {course.tags?.map((tag) => (
                <span key={tag} className="badge bg-dark-700 text-dark-300 border-dark-600">
                  #{tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
              {course.title}
            </h1>

            <p className="text-dark-300 text-base leading-relaxed">{course.description}</p>
          </div>

          {/* Thumbnail */}
          {course.thumbnail && (
            <div className="w-full h-64 bg-dark-800 rounded-2xl overflow-hidden">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Instructor */}
          <div className="flex items-center gap-3 p-4 bg-dark-800 rounded-xl border border-dark-700">
            <div className="w-10 h-10 bg-forge-gradient rounded-full flex items-center justify-center">
              <span className="text-white font-bold">
                {course.instructor?.name?.charAt(0) || "I"}
              </span>
            </div>
            <div>
              <p className="text-xs text-dark-400 font-mono">Instructor</p>
              <p className="font-display font-semibold text-white">
                {course.instructor?.name || "Unknown"}
              </p>
            </div>
          </div>

          {/* Instructor: link to student analytics */}
          {isCourseOwner && (
            <div className="p-4 bg-forge-500/5 border border-forge-500/20 rounded-xl">
              <p className="text-forge-400 text-sm font-mono font-medium mb-2">
                You created this course
              </p>
              <p className="text-dark-400 text-xs font-mono mb-3">
                Student progress and enrollments are on your instructor dashboard — not your personal completion.
              </p>
              <Link to="/instructor" className="btn-primary text-sm py-2 inline-block">
                View Student Progress →
              </Link>
            </div>
          )}

          {/* Progress bar (if enrolled as student) */}
          {isEnrolled && (
            <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-emerald-400 text-sm font-mono font-medium">
                  Your progress
                </span>
                <span className="text-emerald-400 font-mono font-bold">
                  {enrollment.progress || 0}%
                </span>
              </div>
              <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                  style={{ width: `${enrollment.progress || 0}%` }}
                />
              </div>
              <p className="text-dark-400 text-xs font-mono mt-2">
                {enrollment.completedModules?.length || 0} / {course.modules?.length || 0} modules completed
              </p>
            </div>
          )}

          {/* Modules */}
          <div>
            <h2 className="text-xl font-display font-bold text-white mb-4">
              Course Modules ({course.modules?.length || 0})
            </h2>
            {course.modules?.length > 0 ? (
              <ModuleList
                modules={course.modules}
                courseId={id}
                enrollmentData={enrollment}
                isEnrolled={isEnrolled}
              />
            ) : (
              <p className="text-dark-400 text-sm font-mono">No modules yet.</p>
            )}
          </div>
        </div>

        {/* ── Right: Enrollment Card (sticky) ───────────────── */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24 border-dark-600">
            <div className="text-3xl font-display font-bold text-forge-400 mb-1">
              {course.price === 0 ? "FREE" : `$${course.price}`}
            </div>

            <div className="space-y-3 my-5 text-sm text-dark-300 font-mono">
              <div className="flex justify-between">
                <span>📹 Modules</span>
                <span className="text-white">{course.modules?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>📊 Level</span>
                <span className="text-white">{course.level}</span>
              </div>
              <div className="flex justify-between">
                <span>👥 Students</span>
                <span className="text-white">{course.studentsEnrolled?.length || 0}</span>
              </div>
              {course.rating?.average > 0 && (
                <div className="flex justify-between">
                  <span>⭐ Rating</span>
                  <span className="text-white">{course.rating.average.toFixed(1)}</span>
                </div>
              )}
            </div>

            {isCourseOwner ? (
              <Link to="/instructor" className="btn-secondary w-full block text-center">
                Manage in Dashboard →
              </Link>
            ) : isEnrolled ? (
              <div className="text-center py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 font-mono text-sm">
                ✅ Enrolled
              </div>
            ) : user ? (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {enrolling ? <Spinner size="sm" /> : null}
                {enrolling ? "Enrolling..." : "Enroll Now →"}
              </button>
            ) : (
              <Link to="/login" className="btn-primary block text-center">
                Login to Enroll →
              </Link>
            )}

            <p className="text-dark-500 text-xs font-mono text-center mt-3">
              +50 XP for enrolling
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CourseDetailPage;
