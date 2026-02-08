import { Navigate } from "react-router-dom"

export default function ProtectedRouteUser({children, authUser}) {
  
  if(authUser){
    return children
  }else{
    return(
      <Navigate to='/'/>
    )
  }
}

