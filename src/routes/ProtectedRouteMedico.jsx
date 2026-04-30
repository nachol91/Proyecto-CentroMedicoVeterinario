import { Navigate } from "react-router-dom";
import { leerUsuarioGuardado } from "../helpers/auth";

export default function ProtectedRouteMedico({ children, authMedico }) {

  const token = localStorage.getItem("token");
  const usuario = leerUsuarioGuardado(); 
  
  const esMedicoPermitido = token && usuario?.nivel === "MEDICO";

  if (authMedico || esMedicoPermitido) {
    return children;
  } else {
    return <Navigate to="/" />;
  }
}