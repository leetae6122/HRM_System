import { useState } from 'react';
import { Avatar, Button, Dropdown, Space } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  DatabaseOutlined,
  DownOutlined,
  FormOutlined,
  LogoutOutlined,
  ProfileOutlined,
  UpOutlined,
  UserOutlined,
} from '@ant-design/icons';
import defaultAvatar from 'assets/images/avatar-user.jpg';
import authApi from 'api/authApi';
import { useLocation, useNavigate } from 'react-router-dom';
import { logout } from 'reducers/auth';
import Cookies from 'universal-cookie';
import ModalChangePassword from './components/ModalChangePassword';
import { toast } from 'react-toastify';
import { red, yellow } from '@ant-design/colors';

const cookies = new Cookies();

function CardUser() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const pathSnippets = location.pathname.split('/');
  const user = useSelector((state) => state.auth.user);
  const [changeDropDown, setChangeDropDown] = useState(false);
  const [openModalChangePassword, setOpenModalChangePassword] = useState(false);

  const toggleModalChangePassword = () => {
    setOpenModalChangePassword(!openModalChangePassword);
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
      cookies.remove('access_token', { path: '/' });
      cookies.remove('refresh_token', { path: '/' });
      navigate('/auth/login');
      dispatch(logout());
    } catch (error) {
      toast.error(error);
    }
  };

  const items = [
    {
      label: (
        <div
          style={{ fontSize: 18 }}
          onClick={() => navigate('/profile', { replace: true })}
        >
          <ProfileOutlined />
          <span style={{ marginLeft: 8 }}>Profile</span>
        </div>
      ),
      key: 'profile',
    },
    {
      label: (
        <div style={{ fontSize: 18 }} onClick={toggleModalChangePassword}>
          <FormOutlined />
          <span style={{ marginLeft: 8 }}>Change Password</span>
        </div>
      ),
      key: 'changePassword',
    },
    user?.isAdmin === 1
      ? pathSnippets[1] === 'admin'
        ? {
            label: (
              <div
                style={{ fontSize: 18, color: yellow[5] }}
                onClick={() =>
                  navigate('/employee/dashboard', { replace: true })
                }
              >
                <UserOutlined />
                <span style={{ marginLeft: 8 }}>Employee Page</span>
              </div>
            ),
            key: 'employeePage',
          }
        : {
            label: (
              <div
                style={{ fontSize: 18, color: yellow[5] }}
                onClick={() => navigate('/admin/dashboard', { replace: true })}
              >
                <DatabaseOutlined />
                <span style={{ marginLeft: 8 }}>Admin Page</span>
              </div>
            ),
            key: 'adminPage',
          }
      : null,
    {
      type: 'divider',
    },
    {
      label: (
        <div style={{ color: red[5], fontSize: 18 }} onClick={handleLogout}>
          <LogoutOutlined />
          <span style={{ marginLeft: 8 }}>Logout</span>
        </div>
      ),
      key: 'logout',
    },
  ];

  return (
    <>
      <Dropdown
        menu={{
          items,
        }}
        trigger={['click']}
      >
        <Button
          onClick={() => setChangeDropDown(!changeDropDown)}
          style={{ height: '100%' }}
        >
          <Space style={{ fontSize: 18 }}>
            <Avatar size={40} src={user?.profile.avatarUrl ?? defaultAvatar} />
            <span>
              {user ? `${user.profile.lastName} ${user.profile.firstName}` : 'Employee Name'}
            </span>
            {changeDropDown ? <UpOutlined /> : <DownOutlined />}
          </Space>
        </Button>
      </Dropdown>

      {openModalChangePassword && (
        <ModalChangePassword
          openModal={openModalChangePassword}
          toggleShowModal={toggleModalChangePassword}
          handleLogout={handleLogout}
        />
      )}
    </>
  );
}
export default CardUser;
