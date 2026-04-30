import { Navigate } from "react-router-dom";
import { leerUsuarioGuardado } from "../helpers/auth";

export default function ProtectedRouteAdmin({ children, authAdmin }) {

  const token = localStorage.getItem("token");
  const usuario = leerUsuarioGuardado();  
  
  const esAdminPermitido = token && usuario?.nivel === "ADMIN";

  if (authAdmin || esAdminPermitido) {
    return children;
  } else {
    return <Navigate to="/" />;
  }
}
