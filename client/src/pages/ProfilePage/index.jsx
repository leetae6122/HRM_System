import React from "react";
import { Col, Row, Space } from "antd";
import ProfileCard from "./components/ProfileCard";
import BasicInformation from "./components/Information/BasicInformation";
import PersonalInformation from "./components/Information/PersonalInfomation";
import EmployeeInformation from "./components/Information/EmployeeInformation";

function ProfilePage() {
  return (
    <>
      <Row>
        <Col span={6}>
          <ProfileCard />
        </Col>
        <Col span={18}>
          <Space direction="vertical" style={{ marginLeft: 8 }}>
            <BasicInformation />
            <PersonalInformation/>
            <EmployeeInformation/>
          </Space>
        </Col>
      </Row>
    </>
  );
}
export default ProfilePage;
