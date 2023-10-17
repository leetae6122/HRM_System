import {
  FireOutlined,
  IdcardOutlined,
  TeamOutlined,
  UnlockOutlined,
  UserDeleteOutlined,
} from '@ant-design/icons';
import { Col, Row } from 'antd';

import LinkIconCard from './components/LinkIconCard';
import QualityCard from './components/QualityCard';
import RunningProjectsTable from './components/RunningProjectsTable';
import { geekblue, green, purple, red, gold } from '@ant-design/colors';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import employeeApi from 'api/employeeApi';
import projectApi from 'api/projectApi';
import DepartmentEmployeesTable from './components/DepartmentEmployeesTable';
import leaveApi from 'api/leaveApi';
import attendanceApi from 'api/attendanceApi';
import userApi from 'api/userApi';

const iconStyle = { fontSize: 40, color: 'white' };

function DashboardPage() {
  const [countEmployees, setCountEmployees] = useState({});
  const [countProjects, setCountProjects] = useState({});
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
    const fetchCountProjects = async () => {
      try {
        const response = (await projectApi.countProject()).data;
        setCountProjects(response);
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
    fetchCountProjects();
    fetchCountUsers();
    fetchCountLeaves();
    fetchCountAttendance();
    return () => controller.abort();
  }, []);

  return (
    <Row gutter={[16, 8]}>
      <Col className="gutter-row" span={8} key="employees">
        <LinkIconCard
          link={'/admin/employee'}
          Icon={<TeamOutlined style={iconStyle} />}
          iconColor={purple[5]}
          title={`${countEmployees.currentEmployees} Employees`}
        />
      </Col>
      <Col className="gutter-row" span={8} key="projects">
        <LinkIconCard
          link={'/admin/project'}
          Icon={<FireOutlined style={iconStyle} />}
          iconColor={green[5]}
          title={`${countProjects.totalProjects} Projects`}
        />
      </Col>
      <Col className="gutter-row" span={8} key="users">
        <LinkIconCard
          link={'/admin/user'}
          Icon={<UnlockOutlined style={iconStyle} />}
          iconColor={gold[5]}
          title={`${countUser.activeUsers} Users Active`}
        />
      </Col>

      <Col className="gutter-row" span={8}>
        <QualityCard
          backgroundColor={purple[5]}
          quality={countEmployees.formerEmployees}
          content={'Former Employees'}
        />
      </Col>
      <Col className="gutter-row" span={8}>
        <QualityCard
          backgroundColor={green[5]}
          quality={countProjects.upcomingProjects}
          content={'Upcoming Projects'}
        />
      </Col>
      <Col className="gutter-row" span={8}>
        <QualityCard
          backgroundColor={gold[5]}
          quality={countUser.notActivedUsers}
          content={'Users are not activated'}
        />
      </Col>

      <Col className="gutter-row" span={12} key="attendances">
        <LinkIconCard
          link={'/admin/attendance'}
          Icon={<IdcardOutlined style={iconStyle} />}
          iconColor={geekblue[5]}
          title={`${countAttendance.totalAttendances} Attendances Today`}
        />
      </Col>
      <Col className="gutter-row" span={12} key="leaves">
        <LinkIconCard
          link={'/admin/leave'}
          Icon={<UserDeleteOutlined style={iconStyle} />}
          iconColor={red[5]}
          title={`${countLeaves.totalLeaves} Leaves / Month`}
        />
      </Col>
      <Col className="gutter-row" span={12}>
        <QualityCard
          backgroundColor={geekblue[5]}
          quality={countAttendance.pendingAttendances}
          content={'Pending Attendance Application'}
        />
      </Col>
      <Col className="gutter-row" span={12}>
        <QualityCard
          backgroundColor={red[5]}
          quality={countLeaves.pendingLeaves}
          content={'Pending Leave Application'}
        />
      </Col>
      <Col className="gutter-row" span={12}>
        <RunningProjectsTable />
      </Col>
      <Col className="gutter-row" span={12}>
        <DepartmentEmployeesTable />
      </Col>
    </Row>
  );
}

export default DashboardPage;
