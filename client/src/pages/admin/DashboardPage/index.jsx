import {
  IdcardOutlined,
  TeamOutlined,
  UnlockOutlined,
  UserDeleteOutlined,
} from '@ant-design/icons';
import { Col, Row } from 'antd';

import LinkIconCard from './components/LinkIconCard';
import QualityCard from './components/QualityCard';
import { geekblue, purple, red, gold } from '@ant-design/colors';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import employeeApi from 'api/employeeApi';
import DepartmentEmployeesTable from './components/DepartmentEmployeesTable';
import leaveApi from 'api/leaveApi';
import attendanceApi from 'api/attendanceApi';
import userApi from 'api/userApi';
import PositionEmployeesTable from './components/PositionEmployeesTable';

const iconStyle = { fontSize: 40, color: 'white' };

function DashboardPage() {
  const [countEmployees, setCountEmployees] = useState({});
  const [countUser, setCountUser] = useState({});
  const [countLeaves, setCountLeaves] = useState({});
  const [countAttendance, setCountAttendance] = useState({});

  useEffect(() => {
    const controller = new AbortController();
    const fetchCountEmployees = async () => {
      try {
        const response = (await employeeApi.countEmployee()).data;
        setCountEmployees(response);
      } catch (error) {
        toast.error(error);
      }
    };
    const fetchCountUsers = async () => {
      try {
        const response = (await userApi.countUser()).data;
        setCountUser(response);
      } catch (error) {
        toast.error(error);
      }
    };
    const fetchCountLeaves = async () => {
      try {
        const response = (await leaveApi.countLeave()).data;
        setCountLeaves(response);
      } catch (error) {
        toast.error(error);
      }
    };
    const fetchCountAttendance = async () => {
      try {
        const response = (await attendanceApi.countAttendance()).data;
        setCountAttendance(response);
      } catch (error) {
        toast.error(error);
      }
    };
    fetchCountEmployees();
    fetchCountUsers();
    fetchCountLeaves();
    fetchCountAttendance();
    return () => controller.abort();
  }, []);

  return (
    <Row gutter={[16, 8]}>
      <Col className="link-card" span={6} key="employees">
        <LinkIconCard
          link={'/admin/employee'}
          Icon={<TeamOutlined style={iconStyle} />}
          iconColor={purple[5]}
          title={`${countEmployees.currentEmployees ?? 0} Employees`}
        />
      </Col>
      <Col className="quality-card" span={6}>
        <QualityCard
          backgroundColor={purple[5]}
          quality={countEmployees.formerEmployees ?? 0}
          content={'Former Employees'}
        />
      </Col>

      <Col className="link-card" span={6} key="users">
        <LinkIconCard
          link={'/admin/user'}
          Icon={<UnlockOutlined style={iconStyle} />}
          iconColor={gold[5]}
          title={`${countUser.activeUsers ?? 0} Users Active`}
        />
      </Col>

      <Col className="quality-card" span={6}>
        <QualityCard
          backgroundColor={gold[5]}
          quality={countUser.notActivedUsers ?? 0}
          content={'Users are not activated'}
        />
      </Col>

      <Col className="link-card" span={12} key="attendances">
        <LinkIconCard
          link={'/admin/attendance'}
          Icon={<IdcardOutlined style={iconStyle} />}
          iconColor={geekblue[5]}
          title={`${countAttendance.totalAttendances ?? 0} Attendances Today`}
        />
      </Col>
      <Col className="link-card" span={12} key="leaves">
        <LinkIconCard
          link={'/admin/leave'}
          Icon={<UserDeleteOutlined style={iconStyle} />}
          iconColor={red[5]}
          title={`${countLeaves.totalLeaves ?? 0} Leaves Approved / Month`}
        />
      </Col>
      <Col className="quality-card" span={12}>
        <QualityCard
          backgroundColor={geekblue[5]}
          quality={countAttendance.pendingAttendances ?? 0}
          content={'Pending Attendance Application'}
        />
      </Col>
      <Col className="quality-card" span={12}>
        <QualityCard
          backgroundColor={red[5]}
          quality={countLeaves.pendingLeaves ?? 0}
          content={'Pending Leave Application'}
        />
      </Col>
      <Col span={10}>
        <PositionEmployeesTable />
      </Col>
      <Col span={14}>
        <DepartmentEmployeesTable />
      </Col>
    </Row>
  );
}

export default DashboardPage;
