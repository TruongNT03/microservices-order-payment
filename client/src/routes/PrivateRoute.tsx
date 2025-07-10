import { Navigate, Outlet } from "react-router";
import Cookie from "js-cookie";

const PrivateRoute = () => {
  const accessToken =
    localStorage.getItem("access_token") || Cookie.get("access_token");

  return accessToken ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
