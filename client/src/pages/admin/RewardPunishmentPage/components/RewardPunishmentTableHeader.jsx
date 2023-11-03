import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row, Space } from 'antd';
import { PlusCircleFilled, ReloadOutlined } from '@ant-design/icons';
import Search from 'antd/es/input/Search';
import { useDispatch, useSelector } from 'react-redux';
import { setDefaultFilterData } from 'reducers/rewardPunishment';
import { gold, green } from '@ant-design/colors';
import _ from 'lodash';

RewardPunishmentTableHeader.propTypes = {
  toggleModalAddRewardPunishment: PropTypes.func,
  setFilter: PropTypes.func,
};

RewardPunishmentTableHeader.defaultProps = {
  toggleModalAddRewardPunishment: null,
  setFilter: null,
};

function RewardPunishmentTableHeader(props) {
  const { toggleModalAddRewardPunishment, setFilter } = props;
  const dispatch = useDispatch();
  const [loadingSearch, setLoadingSearch] = useState(false);
  const { filterData, defaultFilter } = useSelector((state) => state.rewardPunishment);
  const [inputValue, setInputValue] = useState('');

  const handleSearch = (value) => {
    setLoadingSearch(true);
    setFilter({
      ...filterData,
      page: 1,
      size: 10,
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
      <Col span={10}>
        <Search
          placeholder="Input search employee name"
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
            onClick={toggleModalAddRewardPunishment}
          >
            Add Rewards or Punishments
          </Button>
        </Space>
      </Col>
    </Row>
  );
}

export default RewardPunishmentTableHeader;
