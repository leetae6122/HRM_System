import userApi from "api/userApi";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import _ from "lodash";

const useAuth = () => {
  const user = useSelector((state) => state.auth.user);
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const checkIsAdmin = async () => {
      if (!_.isEmpty(user)) {
        setIsAuth(user.isAdmin);
        return;
      }
      const getUser = await userApi.getUserProfile();
      setIsAuth(getUser.data.isAdmin);
    };
    checkIsAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return isAuth;
};

// eslint-disable-next-line react/prop-types
function AdminAuth({ redirectPath, children }) {
  const isAuth = useAuth();

  if (isAuth === null) return null;
  console.log(isAuth);
  return isAuth ? children : <Navigate to={redirectPath} replace />;
}

export default AdminAuth;