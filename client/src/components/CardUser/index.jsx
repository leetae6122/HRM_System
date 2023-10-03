import { useState } from "react";
import { Avatar, Button, Dropdown, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  DownOutlined,
  FormOutlined,
  LogoutOutlined,
  ProfileOutlined,
  UpOutlined,
} from "@ant-design/icons";
import defaultAvatar from "assets/images/avatar-user.jpg";
import authApi from "api/authApi";
import { useNavigate } from "react-router-dom";
import { logout } from "reducers/auth";
import Cookies from "universal-cookie";
import ModalChangePassword from "./components/ModalChangePassword";
import { toast } from "react-toastify";


const cookies = new Cookies();

function CardUser() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [changeDropDown, setChangeDropDown] = useState(false);
  const [openModalChangePassword, setOpenModalChangePassword] = useState(false);

  const toggleModalChangePassword = () => {
    setOpenModalChangePassword(!openModalChangePassword);
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
      cookies.remove("access_token", { path: "/" });
      cookies.remove("refresh_token", { path: "/" });
      navigate("/auth/login");
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
          onClick={() => navigate("/profile", { replace: true })}
        >
          <ProfileOutlined />
          <span style={{ marginLeft: 8 }}>Profile</span>
        </div>
      ),
      key: "profile",
    },
    {
      label: (
        <div style={{ fontSize: 18 }} onClick={toggleModalChangePassword}>
          <FormOutlined />
          <span style={{ marginLeft: 8 }}>Change Password</span>
        </div>
      ),
      key: "changePassword",
    },
    {
      type: "divider",
    },
    {
      label: (
        <div style={{ color: "red", fontSize: 18 }} onClick={handleLogout}>
          <LogoutOutlined />
          <span style={{ marginLeft: 8 }}>Logout</span>
        </div>
      ),
      key: "logout",
    },
  ];

  return (
    <>
      <Dropdown
          menu={{
            items,
          }}
          trigger={["click"]}
        >
          <Button
            onClick={() => setChangeDropDown(!changeDropDown)}
            style={{ height: "100%" }}
          >
            <Space style={{ fontSize: 18 }}>
              <Avatar
                size={40}
                src={user?.profile.avatarUrl ?? defaultAvatar}
              />
              <span>{`${user?.profile.firstName} ${user?.profile.lastName}`}</span>
              {changeDropDown ? <UpOutlined /> : <DownOutlined />}
            </Space>
          </Button>
        </Dropdown>

      {openModalChangePassword &&
        <ModalChangePassword
        openModal={openModalChangePassword}
        toggleShowModal={toggleModalChangePassword}
      />
      }
    </>
  );
}
export default CardUser;
