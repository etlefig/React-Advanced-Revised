import { useAppData } from "../components/AppDataContext";

export const ToastBar = () => {
  const { toast } = useAppData();
  if (!toast) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        padding: "10px 12px",
        borderRadius: 8,
        border: "1px solid rgba(255,255,255,0.15)",
        background: toast.type === "success" ? "rgba(0,160,90,0.25)" : "rgba(200,40,40,0.25)",
        color: "white",
        zIndex: 9999,
        maxWidth: 360,
      }}
    >
      {toast.message}
    </div>
  );
};