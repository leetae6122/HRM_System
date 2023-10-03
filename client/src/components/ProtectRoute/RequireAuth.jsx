import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "universal-cookie";
import jwtDecode from "jwt-decode";
import authApi from "api/authApi";
import { useDispatch } from "react-redux";
import userApi from "api/userApi";
import { login } from "reducers/auth";

const cookies = new Cookies();

const checkExp = (tokenExp) => {
  const dateNow = new Date();
  return tokenExp > dateNow.getTime() / 1000;
};

const getUserProfile = async (dispatch) => {
  const data = (await userApi.getUserProfile()).data;
  dispatch(login(data));
};

const useAuth = () => {
  const dispatch = useDispatch();
  const [isAuth, setIsAuth] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    const checkToken = async () => {
      const accessToken = cookies.get("access_token");
        const refreshToken = cookies.get("refresh_token");

        if (accessToken) {
          const accessTokenExp = jwtDecode(accessToken).exp;
          if (checkExp(accessTokenExp)) {
            getUserProfile(dispatch);
            return setIsAuth(true);
          }

          return setIsAuth(false);
        }

        if (refreshToken) {
          const refreshTokenExp = jwtDecode(refreshToken).exp;
          if (checkExp(refreshTokenExp)) {
            const response = await authApi.refreshToken(refreshToken);
            cookies.set("access_token", response.accessToken, { path: "/" });
            cookies.set("refresh_token", response.refreshToken, {
              path: "/",
            });
            getUserProfile(dispatch);
            return setIsAuth(true);
          }

          return setIsAuth(false);
        }

        setIsAuth(false);
    };
    checkToken();
    return () => controller.abort();
  }, [dispatch]);
  return isAuth;
};

// eslint-disable-next-line react/prop-types
function RequireAuth({ children }) {
  const isAuth = useAuth();

  if (isAuth === null) return null;

  return isAuth ? children : <Navigate to="/auth/login" replace />;
}

export default RequireAuth;