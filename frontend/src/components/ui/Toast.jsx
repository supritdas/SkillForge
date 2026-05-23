// components/ui/Toast.jsx — Global toast notification
// Reads from toastAtom and displays a fixed notification

import { useRecoilValue } from "recoil";
import { toastAtom } from "../../store/atoms";

const ICONS = {
  success: "✅",
  error: "❌",
  info: "ℹ️",
};

const COLORS = {
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  error: "border-red-500/30 bg-red-500/10 text-red-300",
  info: "border-sky-500/30 bg-sky-500/10 text-sky-300",
};

const Toast = () => {
  const toast = useRecoilValue(toastAtom);

  if (!toast) return null;

  return (
    <div className="fixed top-20 right-4 z-[100] animate-fade-up">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border
                    backdrop-blur-sm shadow-2xl max-w-sm ${COLORS[toast.type] || COLORS.info}`}
      >
        <span>{ICONS[toast.type] || ICONS.info}</span>
        <p className="text-sm font-body font-medium">{toast.message}</p>
      </div>
    </div>
  );
};

export default Toast;
