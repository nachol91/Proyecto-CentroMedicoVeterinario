import { Navigate } from "react-router-dom";

export default function ProtectedRouteAdmin({ children, authAdmin }) {
  if (authAdmin) {
    return children;
  } else {
    return <Navigate to="/" />;
  }
}
