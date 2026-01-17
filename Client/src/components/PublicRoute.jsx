import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("userInfo"));

  if (user) {
    return <Navigate to="/chats" replace />;
  }

  return children;
};

export default PublicRoute;
