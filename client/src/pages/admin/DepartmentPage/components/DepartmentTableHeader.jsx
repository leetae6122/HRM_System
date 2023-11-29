import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row, Space } from 'antd';
import { PlusCircleFilled, ReloadOutlined } from '@ant-design/icons';
import Search from 'antd/es/input/Search';
import { useDispatch, useSelector } from 'react-redux';
import { setDefaultFilterData } from 'reducers/department';
import { gold, green } from '@ant-design/colors';
import _ from 'lodash';

DepartmentTableHeader.propTypes = {
  toggleModalAddDepartment: PropTypes.func,
  setFilter: PropTypes.func,
};

DepartmentTableHeader.defaultProps = {
  toggleModalAddDepartment: null,
  setFilter: null,
};

function DepartmentTableHeader(props) {
  const { toggleModalAddDepartment, setFilter } = props;
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
            id: { $like: `%${value}%` },
          },
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
          placeholder="Input search id, name or short name"
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
        </Space>
      </Col>
    </Row>
  );
}

export default DepartmentTableHeader;
