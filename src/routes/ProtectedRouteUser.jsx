import { Navigate } from "react-router-dom"

export default function ProtectedRouteUser({children, authUser}) {

  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const esAdminPersistido = token && usuario?.nivel === "USER";  
  
  if(authUser || esAdminPersistido){
    return children
  }else{
    return(
      <Navigate to='/'/>
    )
  }
}

