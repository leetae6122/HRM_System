import PropTypes from 'prop-types';
import { Button, Col, DatePicker, Row, Space } from 'antd';
import { PlusCircleFilled, ReloadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setDefaultFilterData } from 'reducers/leave';
import { gold, green } from '@ant-design/colors';
import _ from 'lodash';
import { useState } from 'react';
import dayjs from 'dayjs';
import { getMonthName } from 'utils/handleDate';

const disabledDate = (current) => {
  return current && current.valueOf() > Date.now();
};

LeaveTableHeader.propTypes = {
  toggleModalAddLeave: PropTypes.func,
  setFilter: PropTypes.func,
};

LeaveTableHeader.defaultProps = {
  toggleModalAddLeave: null,
  setFilter: null,
};

function LeaveTableHeader(props) {
  const { toggleModalAddLeave, setFilter } = props;
  const dispatch = useDispatch();
  const { filterData, defaultFilter } = useSelector((state) => state.leave);
  const [value, setValue] = useState(
    filterData.where.$or
      ? dayjs(filterData.where.$or[0].leaveFrom.$between[0])
      : null,
  );

  const resetFilter = () => {
    dispatch(setDefaultFilterData());
    setValue(null);
  };

  const onChangeDate = (value) => {
    setValue(value);
    const startDate = value.startOf('month').utc().format();
    const endDate = value.endOf('month').utc().format();

    setFilter({
      ...filterData,
      where: {
        $or: [
          { leaveFrom: { $between: [startDate, endDate] } },
          { leaveTo: { $between: [startDate, endDate] } },
        ],
        status: filterData.where.status,
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
          <Button
            type="primary"
            style={{ backgroundColor: green.primary }}
            icon={<PlusCircleFilled />}
            onClick={toggleModalAddLeave}
          >
            Create a leave request
          </Button>
        </Space>
      </Col>
    </Row>
  );
}

export default LeaveTableHeader;
