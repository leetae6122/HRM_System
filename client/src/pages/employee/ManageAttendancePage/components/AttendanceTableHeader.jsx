import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, DatePicker, Row, Space } from 'antd';
import { FilterFilled, ReloadOutlined } from '@ant-design/icons';
import Search from 'antd/es/input/Search';
import { useDispatch, useSelector } from 'react-redux';
import { setDefaultFilterData } from 'reducers/attendance';
import { gold } from '@ant-design/colors';
import _ from 'lodash';
import dayjs from 'dayjs';
import { getMonthName } from 'utils/handleDate';

AttendanceTableHeader.propTypes = {
  setFilter: PropTypes.func,
  toggleShowFilterDrawer: PropTypes.func,
};

AttendanceTableHeader.defaultProps = {
  setFilter: null,
  toggleShowFilterDrawer: null,
};

function AttendanceTableHeader(props) {
  const { setFilter, toggleShowFilterDrawer } = props;
  const dispatch = useDispatch();
  const [loadingSearch, setLoadingSearch] = useState(false);
  const { filterData, defaultFilter } = useSelector(
    (state) => state.attendance,
  );
  const [value, setValue] = useState(
    dayjs(filterData.where.attendanceDate.$between[0]),
  );
  const [inputValue, setInputValue] = useState('');

  const handleSearch = (value) => {
    setLoadingSearch(true);
    setFilter({
      ...filterData,
      page: 1,
      size: 10,
      where: {
        attendanceDate: defaultFilter.where.attendanceDate,
        employeeId: value,
      },
      modelEmployee: {
        where: {
          $or: _.flatten(
            _.map(['firstName', 'lastName'], function (item) {
              return _.map(value.split(' '), function (q) {
                return { [item]: { $like: '%' + q + '%' } };
              });
            }),
          ),
        },
      },
    });
    setLoadingSearch(false);
  };

  const resetFilter = () => {
    dispatch(setDefaultFilterData());
    setInputValue('');
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

  const disabledDate = (current) => {
    return current && current.valueOf() > Date.now();
  };

  return (
    <Row>
      <Col span={10}>
        <Search
          placeholder="Input search employee name or employee id"
          loading={loadingSearch}
          enterButton
          onSearch={handleSearch}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
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
            icon={<FilterFilled />}
            onClick={toggleShowFilterDrawer}
          >
            Filter
          </Button>
          <DatePicker
            picker="month"
            value={value}
            onChange={onChangeDate}
            allowClear={false}
            format={(value) => getMonthName(value)}
            disabledDate={disabledDate}
          />
        </Space>
      </Col>
    </Row>
  );
}

export default AttendanceTableHeader;
