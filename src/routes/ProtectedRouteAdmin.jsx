import { Navigate } from "react-router-dom";

export default function ProtectedRouteAdmin({ children, authAdmin }) {

  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario"));  
  
  const esAdminPersistido = token && usuario?.nivel === "ADMIN";

  if (authAdmin || esAdminPersistido) {
    return children;
  } else {
    return <Navigate to="/" />;
  }
}
