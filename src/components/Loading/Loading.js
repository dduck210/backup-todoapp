import { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";

const Loading = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-white">
        <span className="text-blue-600 font-semibold text-lg mb-2">
          Loading...
        </span>
        <CircularProgress />
      </div>
    );
  }

  return children;
};

export default Loading;
