// hooks/useCourses.js — Custom hook for fetching and filtering courses

import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { coursesAtom } from "../store/atoms";
import api from "../utils/api";

const useCourses = (filters = {}) => {
  const [courses, setCourses] = useRecoilState(coursesAtom);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        // Build query string from filters object
        const params = new URLSearchParams(filters).toString();
        const { data } = await api.get(`/courses?${params}`);
        setCourses(data.courses);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.category, filters.level, filters.search]);

  return { courses, loading, error };
};

export default useCourses;
