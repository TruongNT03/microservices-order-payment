import { Navigate, Outlet } from "react-router";

const PrivateRoute = () => {
  const accessToken = localStorage.getItem("access_token");
  return accessToken ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
