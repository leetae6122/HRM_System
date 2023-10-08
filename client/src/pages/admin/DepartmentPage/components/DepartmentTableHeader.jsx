import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row, Space } from 'antd';
import {
  FilterFilled,
  PlusCircleFilled,
  ReloadOutlined,
} from '@ant-design/icons';
import Search from 'antd/es/input/Search';
import { useDispatch, useSelector } from 'react-redux';
import { setDefaultFilterData } from 'reducers/department';
import { gold, green } from '@ant-design/colors';
import _ from 'lodash';

DepartmentTableHeader.propTypes = {
  toggleModalAddDepartment: PropTypes.func,
  toggleShowFilterDrawer: PropTypes.func,
  setFilter: PropTypes.func,
};

DepartmentTableHeader.defaultProps = {
  toggleModalAddDepartment: null,
  toggleShowFilterDrawer: null,
  setFilter: null,
};

function DepartmentTableHeader(props) {
  const { toggleModalAddDepartment, toggleShowFilterDrawer, setFilter } = props;
  const dispatch = useDispatch();
  const [loadingSearch, setLoadingSearch] = useState(false);
  const { filterData, defaultFilter } = useSelector(
    (state) => state.department,
  );
  const [inputValue, setInputValue] = useState('');

  const handleSearch = (value) => {
    setLoadingSearch(true);
    setFilter({
      ...filterData,
      page: 1,
      size: 10,
      where: {
        $or: [
          {
            name: { $like: `%${value}%` },
          },
          {
            shortName: { $like: `%${value}%` },
          },
        ],
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
          placeholder="Input search name"
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
            style={{ backgroundColor: green.primary }}
            icon={<PlusCircleFilled />}
            onClick={toggleModalAddDepartment}
          >
            Add Department
          </Button>
          <Button
            type="primary"
            icon={<FilterFilled />}
            onClick={toggleShowFilterDrawer}
          >
            Filter
          </Button>
        </Space>
      </Col>
    </Row>
  );
}

export default DepartmentTableHeader;
