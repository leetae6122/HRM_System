import userApi from 'api/userApi';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import _ from 'lodash';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const useAuth = () => {
  const user = useSelector((state) => state.auth.user);
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const checkIsAdmin = async () => {
      const accessToken = cookies.get('access_token');
      if (accessToken) {
        if (!_.isEmpty(user)) {
          setIsAuth(
            user.profile.manageDepartment.managerEId === user.employeeId,
          );
        } else {
          const user = (await userApi.getUserProfile()).data;
          setIsAuth(
            user.profile.manageDepartment.managerEId === user.employeeId,
          );
        }
      }
    };
    checkIsAdmin();
    return () => controller.abort();
  }, [user]);
  return isAuth;
};

// eslint-disable-next-line react/prop-types
function DepartmentManagerAuth({ children }) {
  const isAuth = useAuth();

  if (isAuth === null) return null;
  return isAuth ? children : <Navigate to="/403" replace />;
}

export default DepartmentManagerAuth;
