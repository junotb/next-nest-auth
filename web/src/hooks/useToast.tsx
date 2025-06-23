import { useState } from "react";

export function useToast() {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  const showToast = (msg: string, duration = 3000) => {
    setMessage(msg);
    setVisible(true);
    setTimeout(() => setVisible(false), duration);
  };

  const Toast = visible ? (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 border-2 border-red-500 bg-white text-red-500 font-bold px-4 py-2 rounded shadow z-50">
      {message}
    </div>
  ) : null;

  return { showToast, Toast };
}
