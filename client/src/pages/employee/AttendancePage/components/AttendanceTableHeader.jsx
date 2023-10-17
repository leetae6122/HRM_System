import PropTypes from 'prop-types';
import { Button, Checkbox, Col, DatePicker, Divider, Row, Space } from 'antd';
import { PlusCircleFilled, ReloadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setDefaultFilterData } from 'reducers/attendance';
import { gold, green } from '@ant-design/colors';
import _ from 'lodash';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useState } from 'react';

dayjs.extend(utc);

AttendanceTableHeader.propTypes = {
  toggleModalAddAttendance: PropTypes.func,
  setFilter: PropTypes.func,
};

AttendanceTableHeader.defaultProps = {
  toggleModalAddAttendance: null,
  setFilter: null,
};

const plainOptions = ['Approved', 'Reject', 'Pending'];

function AttendanceTableHeader(props) {
  const { toggleModalAddAttendance, setFilter } = props;
  const dispatch = useDispatch();
  const { filterData, defaultFilter } = useSelector(
    (state) => state.attendance,
  );
  const [value, setValue] = useState(
    dayjs(filterData.where.attendanceDate.$between[0]),
  );
  const [checkedList, setCheckedList] = useState(filterData.where.status);
  
  const checkAll = plainOptions.length === checkedList.length;
  const indeterminate =
    checkedList.length > 0 && checkedList.length < plainOptions.length;

  const onChange = (list) => {
    setCheckedList(list);
    setFilter({
      ...filterData,
      where: {
        ...filterData.where,
        status: list,
      },
    });
  };
  const onCheckAllChange = (e) => {
    const checked = e.target.checked ? plainOptions : [];
    setCheckedList(checked);
    setFilter({
      ...filterData,
      where: {
        ...filterData.where,
        status: checked,
      },
    });
  };

  const resetFilter = () => {
    dispatch(setDefaultFilterData());
    setValue(dayjs());
    setCheckedList(defaultFilter.where.status);
  };

  const onChangeDate = (value) => {
    setValue(value);
    const startDate = value.startOf('month').utc().format();
    const endDate = value.endOf('month').utc().format();
    setFilter({
      ...filterData,
      where: {
        ...filterData.where,
        attendanceDate: { $between: [startDate, endDate] },
      },
    });
  };

  return (
    <Row>
      <Col span={6}>
        <DatePicker
          picker="month"
          value={value}
          onChange={onChangeDate}
          allowClear={false}
        />
      </Col>
      <Col span={10}>
        <Checkbox
          indeterminate={indeterminate}
          onChange={onCheckAllChange}
          checked={checkAll}
        >
          Check all
        </Checkbox>
        <Divider type="vertical" />
        <Checkbox.Group
          options={plainOptions}
          value={checkedList}
          onChange={onChange}
        />
      </Col>
      <Col span={8}>
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
