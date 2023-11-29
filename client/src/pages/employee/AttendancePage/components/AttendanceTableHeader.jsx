import PropTypes from 'prop-types';
import { Button, Col, DatePicker, Row, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setDefaultFilterData } from 'reducers/attendance';
import { gold } from '@ant-design/colors';
import _ from 'lodash';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useState } from 'react';
import { getMonthName } from 'utils/handleDate';

dayjs.extend(utc);

const disabledDate = (current) => {
  return current && current.valueOf() > Date.now();
};

AttendanceTableHeader.propTypes = {
  setFilter: PropTypes.func,
};

AttendanceTableHeader.defaultProps = {
  setFilter: null,
};

function AttendanceTableHeader(props) {
  const { setFilter } = props;
  const dispatch = useDispatch();
  const { filterData, defaultFilter } = useSelector(
    (state) => state.attendance,
  );
  const [value, setValue] = useState(
    dayjs(filterData.where.attendanceDate.$between[0]),
  );

  const resetFilter = () => {
    dispatch(setDefaultFilterData());
    setValue(dayjs());
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
      <Col span={10}>
        <DatePicker
          picker="month"
          value={value}
          onChange={onChangeDate}
          allowClear={false}
          format={(value) =>  getMonthName(value)}
          disabledDate={disabledDate}
        />
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
        </Space>
      </Col>
    </Row>
  );
}

export default AttendanceTableHeader;
