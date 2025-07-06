import "./App.css";
import Order from "./page/Order";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import Register from "./page/auth/Register";
import Login from "./page/auth/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="" element={<Order />} />
        </Route>
        <Route element={<PublicRoute />}>
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
