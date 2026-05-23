// components/courses/ModuleList.jsx — Shows course modules with completion tracking

import api from "../../utils/api";
import useToast from "../../hooks/useToast";
import { useSetRecoilState } from "recoil";
import { userAtom } from "../../store/atoms";

const ModuleList = ({ modules, courseId, enrollmentData, isEnrolled }) => {
  const { showToast } = useToast();
  const setUser = useSetRecoilState(userAtom);

  const completedModules = enrollmentData?.completedModules || [];

  const handleComplete = async (index) => {
    if (!isEnrolled) {
      showToast("Enroll in this course first!", "error");
      return;
    }
    if (completedModules.includes(index)) {
      showToast("Already completed!", "info");
      return;
    }

    try {
      const { data } = await api.post(`/courses/${courseId}/modules/${index}/complete`);
      showToast(data.message, "success");

      // Update XP, skills, and enrollment progress in global state
      setUser((prev) => ({
        ...prev,
        xp: data.xp,
        badges: data.badges,
        skillMetrics: data.skillMetrics,
        enrolledCourses: prev.enrolledCourses.map((e) => {
          const cid = e.course?._id || e.course;
          if (cid?.toString() !== courseId.toString()) return e;
          const completed = [...(e.completedModules || []), index];
          return {
            ...e,
            completedModules: completed,
            progress: data.progress,
          };
        }),
      }));
    } catch (err) {
      showToast(err.response?.data?.message || "Error completing module", "error");
    }
  };

  return (
    <div className="space-y-3">
      {modules.map((module, index) => {
        const isCompleted = completedModules.includes(index);

        return (
          <div
            key={index}
            className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-200
              ${isCompleted
                ? "bg-emerald-500/5 border-emerald-500/20"
                : "bg-dark-800 border-dark-700 hover:border-dark-600"
              }`}
          >
            {/* Module number / check */}
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-mono font-bold
                ${isCompleted ? "bg-emerald-500 text-white" : "bg-dark-700 text-dark-300"}`}
            >
              {isCompleted ? "✓" : index + 1}
            </div>

            {/* Module info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-display font-medium text-white text-sm">{module.title}</h4>
                {module.skills?.map((skill) => (
                  <span key={skill} className="badge-orange text-xs">{skill}</span>
                ))}
              </div>
              {module.description && (
                <p className="text-dark-400 text-xs mt-1">{module.description}</p>
              )}
              <p className="text-dark-500 text-xs mt-1 font-mono">⏱ {module.duration} min</p>
            </div>

            {/* Complete button */}
            {isEnrolled && (
              <button
                onClick={() => handleComplete(index)}
                disabled={isCompleted}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all
                  ${isCompleted
                    ? "bg-emerald-500/10 text-emerald-400 cursor-default"
                    : "bg-forge-500/10 text-forge-400 hover:bg-forge-500/20 border border-forge-500/30"
                  }`}
              >
                {isCompleted ? "Done ✓" : "Complete →"}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ModuleList;
