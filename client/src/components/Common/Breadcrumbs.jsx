import React from "react";
import { Breadcrumb, Col, Row } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";

const capitalizeChar = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const Breadcrumbs = () => {
  const location = useLocation();
  let pathAdmin = null;
  const pathSnippets = location.pathname.split("/").filter((i) => i);
  if (pathSnippets[0] === "admin") {
    pathSnippets.shift();
    pathAdmin = "/admin";
  }
  const breadcrumbItems = pathSnippets.map((snippet, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
    // const title = snippet.replace(/-/g, " ");

    return {
      title: (
        <NavLink to={pathAdmin ? pathAdmin + url : url}>
          {capitalizeChar(snippet)}
        </NavLink>
      ),
    };
  });
  return (
    <>
      <Row>
        <Col style={{ marginBlock: 4, fontWeight: "bold" }}>
          <Breadcrumb
            style={{ fontSize: 18 }}
            items={[
              {
                title: (
                  <NavLink to="/">
                    <HomeOutlined style={{fontSize: 18}}/>
                  </NavLink>
                ),
              },
              ...breadcrumbItems,
            ]}
          ></Breadcrumb>
        </Col>
      </Row>
    </>
  );
};

export default Breadcrumbs;
