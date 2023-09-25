import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "universal-cookie";
import jwtDecode from "jwt-decode";
import authApi from "api/authApi";

const cookies = new Cookies();

const checkExp = (tokenExp) => {
  const dateNow = new Date();
  return tokenExp > dateNow.getTime() / 1000;
};

const useAuth = () => {
  const [isAuth, setIsAuth] = useState(null);
  useEffect(() => {
    const checkToken = async () => {
      try {
        const accessToken = cookies.get("access_token");
        const refreshToken = cookies.get("refresh_token");

        if (accessToken) {
          const accessTokenExp = jwtDecode(accessToken).exp;

          if (checkExp(accessTokenExp)) {
            setIsAuth(true);
            return;
          }

          setIsAuth(false);
          return;
        }

        if (refreshToken) {
          const refreshTokenExp = jwtDecode(refreshToken).exp;
          if (checkExp(refreshTokenExp)) {
            const response = await authApi.refreshToken(refreshToken);
            cookies.set("access_token", response.accessToken, { path: "/" });
            cookies.set("refresh_token", response.refreshToken, {
              path: "/",
            });
            setIsAuth(true);
            return;
          }

          setIsAuth(false);
          return;
        }

        setIsAuth(false);
      } catch (error) {
        console.log(error);
      }
    };
    checkToken();
  }, []);
  return isAuth;
};

function RequireAuth({ children }) {
  const isAuth = useAuth();

  if (isAuth === null) return null;

  return isAuth ? children : <Navigate to="/auth/login" replace />;
}

export default RequireAuth;
