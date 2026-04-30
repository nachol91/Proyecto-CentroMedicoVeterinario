import { Navigate } from "react-router-dom";
import { leerUsuarioGuardado } from "../helpers/auth";

export default function ProtectedRouteUser({children, authUser}) {

  const token = localStorage.getItem("token");
  const usuario = leerUsuarioGuardado();

  const esUserPermitido = token && usuario?.nivel === "USER";  
  
  if(authUser || esUserPermitido){
    return children
  }else{
    return(
      <Navigate to='/'/>
    )
  }
}

