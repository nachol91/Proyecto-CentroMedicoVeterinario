import { Navigate } from "react-router-dom";

export default function ProtectedRouteMedico({ children, authMedico }) {

  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario")); 
  
  const esAdminPersistido = token && usuario?.nivel === "MEDICO";

  if (authMedico || esAdminPersistido) {
    return children;
  } else {
    return <Navigate to="/" />;
  }
}