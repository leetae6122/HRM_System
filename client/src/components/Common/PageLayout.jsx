import React from "react";
import { Layout, theme } from "antd";
import { Outlet } from "react-router-dom";
import Breadcrumbs from "./Breadcrumbs";
import SideBar from "./SideBar";
import CardUser from "components/CardUser";

const { Header, Content, Footer } = Layout;

function PageLayout() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <SideBar />
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <div
            className="card-user"
            style={{
              float: "right",
              margin: "0 20px",
            }}
          >
            <CardUser />
          </div>
        </Header>
        <Content
          style={{
            margin: "0 16px",
          }}
        >
          <Breadcrumbs />
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          Ant Design ©2023 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
}
export default PageLayout;
