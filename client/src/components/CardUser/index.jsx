import React, { useEffect, useState } from "react";
import { Avatar, Button, Dropdown, Skeleton, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  DownOutlined,
  FormOutlined,
  LogoutOutlined,
  ProfileOutlined,
  UpOutlined,
} from "@ant-design/icons";
import avatarDefault from "assets/images/avatar-user.jpg";
import authApi from "api/authApi";
import { useNavigate } from "react-router-dom";
import { login, logout } from "reducers/auth";
import Cookies from "universal-cookie";
import ModalChangePassword from "./components/ModalChangePassword";
import userApi from "api/userApi";
import { toast } from "react-toastify";

const cookies = new Cookies();

function CardUser() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [changeDropDown, setChangeDropDown] = useState(false);
  const [openModalChangePassword, setOpenModalChangePassword] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoadingUser(true);
        const response = await userApi.getUserProfile();
        dispatch(login(response.data));
        setLoadingUser(false);
      } catch (error) {
        toast.error(error);
      }
    };
    fetchData();
    return () => controller.abort();
  }, [dispatch]);

  const toggleModalChangePassword = () => {
    setOpenModalChangePassword(!openModalChangePassword);
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
      cookies.remove("access_token", { path: "/" });
      cookies.remove("refresh_token", { path: "/" });
      dispatch(logout());
      navigate("/auth/login", {});
    } catch (error) {
      toast.error(error);
    }
  };

  const items = [
    {
      label: (
        <div style={{ fontSize: 16 }} onClick={() => console.log("Profile")}>
          <ProfileOutlined />
          <span style={{ marginLeft: 8 }}>Profile</span>
        </div>
      ),
      key: "profile",
    },
    {
      label: (
        <div style={{ fontSize: 16 }} onClick={toggleModalChangePassword}>
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
        <div style={{ color: "red", fontSize: 16 }} onClick={handleLogout}>
          <LogoutOutlined />
          <span style={{ marginLeft: 8 }}>Logout</span>
        </div>
      ),
      key: "logout",
    },
  ];

  return (
    <>
      <Skeleton
        avatar
        active
        size={40}
        loading={loadingUser}
        style={{ margin: "10px 20px" }}
        paragraph={{ rows: 0 }}
      >
        <Dropdown
          menu={{
            items,
          }}
          trigger={["click"]}
        >
          <Button
            onClick={() => setChangeDropDown(!changeDropDown)}
            style={{ height: "100%" }}
            disabled={loadingUser}
          >
            <Space style={{ fontSize: 16 }}>
              <Avatar
                size={40}
                src={user?.profile.avatarUrl ?? avatarDefault}
              />
              <span>{`${user?.profile.firstName} ${user?.profile.lastName}`}</span>
              {changeDropDown ? <UpOutlined /> : <DownOutlined />}
            </Space>
          </Button>
        </Dropdown>
      </Skeleton>

      <ModalChangePassword
        openModal={openModalChangePassword}
        toggleShowModal={toggleModalChangePassword}
      />
    </>
  );
}
export default CardUser;
