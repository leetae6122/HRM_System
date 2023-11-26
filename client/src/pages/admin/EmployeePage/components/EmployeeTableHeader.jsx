import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row, Space } from 'antd';
import {
  FileExcelFilled,
  PlusCircleFilled,
  ReloadOutlined,
} from '@ant-design/icons';
import Search from 'antd/es/input/Search';
import { useDispatch, useSelector } from 'react-redux';
import { setDefaultFilterData } from 'reducers/employee';
import { gold, green } from '@ant-design/colors';
import _ from 'lodash';

EmployeeTableHeader.propTypes = {
  toggleModalAddEmployee: PropTypes.func,
  setFilter: PropTypes.func,
  toggleModalExportFile: PropTypes.func,
};

EmployeeTableHeader.defaultProps = {
  toggleModalAddEmployee: null,
  setFilter: null,
  toggleModalExportFile: null,
};

function EmployeeTableHeader(props) {
  const { toggleModalAddEmployee, setFilter, toggleModalExportFile } = props;
  const dispatch = useDispatch();
  const [loadingSearch, setLoadingSearch] = useState(false);
  const { filterData, defaultFilter } = useSelector((state) => state.employee);
  const [inputValue, setInputValue] = useState('');

  const handleSearch = (value) => {
    setLoadingSearch(true);
    setFilter({
      ...filterData,
      page: 1,
      size: 10,
      where: {
        $or: _.flatten(
          _.map(
            ['firstName', 'lastName', 'email', 'phoneNumber', 'id'],
            function (item) {
              return _.map(value.split(' '), function (q) {
                return { [item]: { $like: '%' + q + '%' } };
              });
            },
          ),
        ),
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
      <Col span={10}>
        <Search
          placeholder="Input search id, name, email or phone number"
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
            icon={<FileExcelFilled />}
            onClick={toggleModalExportFile}
          >
            Export statistics file
          </Button>
          <Button
            type="primary"
            style={{ backgroundColor: green.primary }}
            icon={<PlusCircleFilled />}
            onClick={toggleModalAddEmployee}
          >
            Add Employee
          </Button>
        </Space>
      </Col>
    </Row>
  );
}

export default EmployeeTableHeader;
