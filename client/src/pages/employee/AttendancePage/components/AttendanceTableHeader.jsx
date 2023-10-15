import PropTypes from 'prop-types';
import { Button, Col, Row, Space } from 'antd';
import { PlusCircleFilled, ReloadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setDefaultFilterData } from 'reducers/attendance';
import { gold, green } from '@ant-design/colors';
import _ from 'lodash';

AttendanceTableHeader.propTypes = {
  toggleModalAddAttendance: PropTypes.func,
};

AttendanceTableHeader.defaultProps = {
  toggleModalAddAttendance: null,
};

function AttendanceTableHeader(props) {
  const { toggleModalAddAttendance } = props;
  const dispatch = useDispatch();
  const { filterData, defaultFilter } = useSelector((state) => state.attendance);

  const resetFilter = () => {
    dispatch(setDefaultFilterData());
  };

  return (
    <Row>
      <Col span={10}>
      </Col>
      <Col span={14}>
        <Space style={{ float: 'right' }}>
          {!_.isEqual(filterData, defaultFilter) && (
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={resetFilter}
              style={{ backgroundColor: gold.primary }}
            >
              Reset
            </Button>
          )}
          <Button
            type="primary"
            style={{ backgroundColor: green.primary }}
            icon={<PlusCircleFilled />}
            onClick={toggleModalAddAttendance}
          >
            Add Attendance
          </Button>
        </Space>
      </Col>
    </Row>
  );
}

export default AttendanceTableHeader;
