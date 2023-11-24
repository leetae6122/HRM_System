import { useState } from "react";
import { Col, Row, Space } from "antd";
import ProfileCard from "./components/ProfileCard";
import PersonalInformation from "./components/Information/PersonalInfomation";
import EmployeeInformation from "./components/Information/EmployeeInformation";
import ModalEditProfile from "./components/EditProfile/ModalEditProfile";

function ProfilePage() {
  const [openModalEditProfile, setOpenModalEditProfile] = useState(false);

  const toggleModalEditProfile = () => {
    setOpenModalEditProfile(!openModalEditProfile);
  };

  return (
    <>
      <Row>
        <Col span={6}>
          <ProfileCard />
        </Col>
        <Col span={18}>
          <Space direction="vertical" style={{ marginLeft: 8 }}>
            <PersonalInformation
              toggleModalEditProfile={toggleModalEditProfile}
            />
            <EmployeeInformation />
          </Space>
        </Col>
      </Row>
      {openModalEditProfile && (
        <ModalEditProfile
          openModal={openModalEditProfile}
          toggleShowModal={toggleModalEditProfile}
        />
      )}
    </>
  );
}
export default ProfilePage;
