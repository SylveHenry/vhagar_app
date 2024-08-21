import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./template";
import AdminPage from "./admin";
// import Admin
const AppRoutes = () => {
  // const loggedIn = false;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/4dm1n" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
