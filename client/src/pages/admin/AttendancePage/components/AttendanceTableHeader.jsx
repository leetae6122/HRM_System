import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row, Space } from 'antd';
import {
  FileExcelFilled,
  FilterFilled,
  HourglassFilled,
  ReloadOutlined,
} from '@ant-design/icons';
import Search from 'antd/es/input/Search';
import { useDispatch, useSelector } from 'react-redux';
import { setDefaultFilterData } from 'reducers/attendance';
import { gold, green, purple } from '@ant-design/colors';
import _ from 'lodash';

AttendanceTableHeader.propTypes = {
  setFilter: PropTypes.func,
  toggleShowFilterDrawer: PropTypes.func,
  toggleModalExportFile: PropTypes.func,
  toggleModalTimekeeper: PropTypes.func,
};

AttendanceTableHeader.defaultProps = {
  setFilter: null,
  toggleShowFilterDrawer: null,
  toggleModalExportFile: null,
  toggleModalTimekeeper: null,
};

function AttendanceTableHeader(props) {
  const {
    setFilter,
    toggleShowFilterDrawer,
    toggleModalExportFile,
    toggleModalTimekeeper,
  } = props;
  const dispatch = useDispatch();
  const [loadingSearch, setLoadingSearch] = useState(false);
  const { filterData, defaultFilter } = useSelector(
    (state) => state.attendance,
  );
  const [inputValue, setInputValue] = useState('');

  const handleSearch = (value) => {
    setLoadingSearch(true);
    setFilter({
      ...filterData,
      page: 1,
      size: 10,
      where: {
        employeeId: { $like: `%${value}%` },
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
  };

  return (
    <Row>
      <Col span={9}>
        <Search
          placeholder="Input search employee name or employee id"
          loading={loadingSearch}
          enterButton
          onSearch={handleSearch}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </Col>
      <Col span={15}>
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
          <Button
            type="primary"
            style={{ backgroundColor: green.primary }}
            icon={<FileExcelFilled />}
            onClick={toggleModalExportFile}
          >
            Export file
          </Button>
          <Button
            type="primary"
            style={{ backgroundColor: purple.primary }}
            icon={<HourglassFilled />}
            onClick={toggleModalTimekeeper}
          >
            Timekeeper
          </Button>
        </Space>
      </Col>
    </Row>
  );
}

export default AttendanceTableHeader;
