import PropTypes from 'prop-types';
import { Button, Col, DatePicker, Row, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setDefaultFilterData } from 'reducers/allowance';
import { gold } from '@ant-design/colors';
import _ from 'lodash';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useState } from 'react';

dayjs.extend(utc);

AllowanceTableHeader.propTypes = {
  setFilter: PropTypes.func,
};

AllowanceTableHeader.defaultProps = {
  setFilter: null,
};

function AllowanceTableHeader(props) {
  const { setFilter } = props;
  const dispatch = useDispatch();
  const { filterData, defaultFilter } = useSelector((state) => state.allowance);
  const [startValue, setStartValue] = useState('');
  const [endValue, setEndValue] = useState('');

  const resetFilter = () => {
    dispatch(setDefaultFilterData());
  };

  const onChangeStartDate = (value) => {
    setStartValue(value);
    setFilter({
      ...filterData,
      where: {
        ...filterData.where,
        startDate: { $gte: value.utc().format() },
      },
    });
  };

  const onChangeEndDate = (value) => {
    setEndValue(value);
    setFilter({
      ...filterData,
      where: {
        ...filterData.where,
        endDate: { $lte: value.utc().format() },
      },
    });
  };

  return (
    <Row>
      <Col span={12}>
        <Space>
          <DatePicker
            value={startValue}
            onChange={onChangeStartDate}
            allowClear={false}
            format={'DD/MM/YYYY'}
            placeholder="Start Date"
          />
          <DatePicker
            value={endValue}
            onChange={onChangeEndDate}
            allowClear={false}
            format={'DD/MM/YYYY'}
            placeholder="End Date"
          />
        </Space>
      </Col>
      <Col span={12}>
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

export default AllowanceTableHeader;
