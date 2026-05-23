// hooks/useToast.js — Custom hook for showing toast notifications

import { useSetRecoilState } from "recoil";
import { toastAtom } from "../store/atoms";

const useToast = () => {
  const setToast = useSetRecoilState(toastAtom);

  /**
   * Show a toast notification
   * @param {string} message - Message to display
   * @param {"success"|"error"|"info"} type - Toast type
   * @param {number} duration - How long to show (ms)
   */
  const showToast = (message, type = "success", duration = 3000) => {
    setToast({ message, type });
    // Auto-dismiss after `duration`
    setTimeout(() => setToast(null), duration);
  };

  return { showToast };
};

export default useToast;
