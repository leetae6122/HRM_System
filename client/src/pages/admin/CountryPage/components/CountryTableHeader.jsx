import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row, Space } from 'antd';
import { PlusCircleFilled, ReloadOutlined } from '@ant-design/icons';
import Search from 'antd/es/input/Search';
import { useDispatch, useSelector } from 'react-redux';
import { setDefaultFilterData } from 'reducers/country';
import { gold, green } from '@ant-design/colors';
import _ from 'lodash';

CountryTableHeader.propTypes = {
  toggleModalAddCountry: PropTypes.func,
  setFilter: PropTypes.func,
};

CountryTableHeader.defaultProps = {
  toggleModalAddCountry: null,
  setFilter: null,
};

function CountryTableHeader(props) {
  const { toggleModalAddCountry, setFilter } = props;
  const dispatch = useDispatch();
  const [loadingSearch, setLoadingSearch] = useState(false);
  const { filterData, defaultFilter } = useSelector((state) => state.country);
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
            countryCode: value,
          },
          {
            isoCode: { $like: `%${value}%` },
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
          placeholder="Input search name or code"
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
            onClick={toggleModalAddCountry}
          >
            Add Country
          </Button>
        </Space>
      </Col>
    </Row>
  );
}

export default CountryTableHeader;
