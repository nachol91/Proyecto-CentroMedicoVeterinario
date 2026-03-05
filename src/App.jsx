import { Routes, Route, useLocation, BrowserRouter as Router, } from "react-router-dom";
import { useState } from "react";
import HeaderComponents from "./components/HeaderComponents";
import FooterComponents from "./components/FooterComponents";
import HomePage from "./pages/HomePage";
import ErrorPage from "./pages/ErrorPage";
import ProtectedRouteAdmin from "./routes/ProtectedRouteAdmin";
import ProtectedRouteUser from "./routes/ProtectedRouteUser";
import ProtectedRouteMedico from "./routes/ProtectedRouteMedico";
import MedicoPage from "./pages/MedicoPage";
import UserPage from "./pages/UserPage";
import AdminPage from "./pages/AdminPage";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/App.css";

const AppLayout = () => {


  const location = useLocation();

  const mostrarHeader =
    location.pathname === "/admin" || location.pathname === "/user" || location.pathname === "/medico";

  const mostrarFooter =
    location.pathname === "/admin" || location.pathname === "/user" || location.pathname === "/medico" || location.pathname === "/";

  const [authAdmin, setAuthAdmin] = useState(false);

  const [authUser, setAuthUser] = useState(false);

  const [authMedico, setAuthMedico] = useState(false);

  function logInAdmin() {
    setAuthAdmin(true);
  };

  function logOutAdmin() {
    setAuthAdmin(false);
  };

  function logInUser() {
    setAuthUser(true);
  };

  function logOutUser() {
    setAuthUser(false);
  };

   function logInMedico() {
    setAuthMedico(true);
  };

  function logOutMedico() {
    setAuthMedico(false);
  };

  return (
    <>
      {mostrarHeader && <HeaderComponents />}

      <main>
        <Routes>
          <Route
            path="/"
            element={ <HomePage
                authAdmin={authAdmin}
                authUser={authUser}
                authMedico={authMedico}
                logInAdmin={logInAdmin}
                logOutAdmin={logOutAdmin}
                logInUser={logInUser}
                logOutUser={logOutUser}
                logInMedico={logInMedico}
                logOutMedico={logOutMedico}/>}
          />

          <Route
            path="/admin"
            element={
              <ProtectedRouteAdmin authAdmin={authAdmin}>
                <AdminPage />
              </ProtectedRouteAdmin>
            }
          />

          <Route
            path="/user"
            element={
              <ProtectedRouteUser authUser={authUser}>
                <UserPage />
              </ProtectedRouteUser>
            }
          />

          <Route
            path="/medico"
            element={
              <ProtectedRouteMedico authMedico={authMedico}>
                <MedicoPage/>
              </ProtectedRouteMedico>
            }
          />

          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </main>

      {mostrarFooter && <FooterComponents />}
    </>
  );
};

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
