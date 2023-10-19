import PropTypes from 'prop-types';
import { Descriptions } from 'antd';

DescriptionAttendance.propTypes = {
  infoAttendance: PropTypes.object,
};

DescriptionAttendance.defaultProps = {
  infoAttendance: {},
};

const createItems = (data) => [
  {
    key: '1',
    label: 'Attendance Id',
    children: data.attendanceId,
  },
  {
    key: '2',
    label: 'Employee Name',
    children: `${data.employeeData.firstName} ${data.employeeData.lastName}`,
    span: 2,
  },
  {
    key: '3',
    label: 'Status',
    children: (
      <span
        style={{
          color:
            data.status === 'Reject'
              ? 'red'
              : data.status === 'Approved'
              ? 'green'
              : '',
        }}
      >
        {data.status}
      </span>
    ),
  },
  {
    key: '4',
    label: 'Handler Name',
    children: data.handlerData.firstName
      ? `${data.handlerData.firstName} ${data.handlerData.lastName}`
      : '',
    span: 2,
  },
  {
    key: '5',
    label: 'Project',
    children: data.projectData?.title,
    span: 3,
  },
  {
    key: '6',
    label: 'Task',
    children: data.taskData?.title,
    span: 3,
  },
  {
    key: '7',
    label: 'Description',
    children: data.description.split('\n').map(function (item, idx) {
      return (
        <span key={idx}>
          {item}
          <br />
        </span>
      );
    }),
    span: 3,
  },
  {
    key: '8',
    label: 'Place',
    children: data.place,
  },
  {
    key: '9',
    label: 'Attendance Date',
    children: data.attendanceDate,
    span: 2,
  },
  {
    key: '10',
    label: 'Hours Spent',
    children: `${data.hoursSpent} hr`,
  },
  {
    key: '11',
    label: 'Hours Overtime',
    children: `${data.hoursOvertime ? data.hoursOvertime : 0} hr`,
  },
];

function DescriptionAttendance(props) {
  const items = createItems(props.infoAttendance);
  return (
    <>
      <Descriptions layout="horizontal" bordered column={2} items={items} />
    </>
  );
}

export default DescriptionAttendance;
