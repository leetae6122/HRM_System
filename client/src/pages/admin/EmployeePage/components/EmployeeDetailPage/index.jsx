import { useEffect, useState } from "react";
import { Col, Row, Space } from "antd";
import ProfileCard from "./components/ProfileCard";
import PersonalInformation from "./components/Information/PersonalInfomation";
import EmployeeInformation from "./components/Information/EmployeeInformation";
import { useParams } from "react-router-dom";
import _ from "lodash";
import employeeApi from "api/employeeApi";
import PropTypes from "prop-types";

EmployeeDetailPage.propTypes = {
  toggleModalEditEmployee: PropTypes.func,
};

EmployeeDetailPage.defaultProps = {
  toggleModalEditEmployee: null,
};

function EmployeeDetailPage(props) {
  const { toggleModalEditEmployee } = props;
  const params = useParams();
  const [employee, setEmployee] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      setLoading(true);
      const data = (await employeeApi.getById(params.id)).data;
      setEmployee(data);
      setLoading(false);
    };
    fetchData();
    return () => controller.abort();
  }, [params]);

  return (
    <>
      {!loading && !_.isEmpty(employee) && (
        <Row>
          <Col span={6}>
            <ProfileCard employee={employee} loading={loading} />
          </Col>
          <Col span={18}>
            <Space direction="vertical" style={{ marginLeft: 8 }}>
              <PersonalInformation
                employee={employee}
                toggleModalEditEmployee={toggleModalEditEmployee}
                loading={loading}
              />
              <EmployeeInformation employee={employee} loading={loading} />
            </Space>
          </Col>
        </Row>
      )}
    </>
  );
}
export default EmployeeDetailPage;
