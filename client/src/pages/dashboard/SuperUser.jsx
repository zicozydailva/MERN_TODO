import { Navigate } from "react-router-dom";
import { useAppContext } from "../../context/appContext";

const SuperUser = ({ children }) => {
  const { isAdmin } = useAppContext();
  var result = JSON.parse(isAdmin);
  const role = result.role

  if (role !== "admin") {
    return <Navigate to="/notadmin" />
  }
  return children;
};

export default SuperUser;
