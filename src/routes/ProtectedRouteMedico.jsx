import { Navigate } from "react-router-dom";

export default function ProtectedRouteMedico({ children, authMedico }) {
  if (authMedico) {
    return children;
  } else {
    return <Navigate to="/" />;
  }
}