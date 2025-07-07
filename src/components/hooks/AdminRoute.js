import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const rawUser = localStorage.getItem("user");
  let role = "";
  if (rawUser) {
    try {
      const user = JSON.parse(rawUser);
      role = user.role;
    } catch {
      role = "";
    }
  }

  if (!token || role !== "admin") {
    return <Navigate to="/" replace />;
  }
  return children;
};
export default AdminRoute;
