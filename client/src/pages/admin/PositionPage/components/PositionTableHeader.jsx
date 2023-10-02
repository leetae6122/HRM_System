import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Col, Row, Space } from "antd";
import {
  FilterFilled,
  PlusCircleFilled,
  ReloadOutlined,
} from "@ant-design/icons";
import Search from "antd/es/input/Search";
import { useDispatch, useSelector } from "react-redux";
import { setDefaultFilterData, setFilterData } from "reducers/position";
import { gold, green } from "@ant-design/colors";
import _ from "lodash";

PositionTableHeader.propTypes = {
  toggleModalAddPosition: PropTypes.func,
  toggleShowFilterDrawer: PropTypes.func,
};

PositionTableHeader.defaultProps = {
  toggleModalAddPosition: null,
  toggleShowFilterDrawer: null,
};

const defaultFilter = {
  page: 1,
  size: 10,
  where: {},
};

function PositionTableHeader(props) {
  const { toggleModalAddPosition, toggleShowFilterDrawer } = props;
  const dispatch = useDispatch();
  const [loadingSearch, setLoadingSearch] = useState(false);
  const { filterData } = useSelector((state) => state.position);

  const handleSearch = (value) => {
    setLoadingSearch(true);
    dispatch(
      setFilterData({
        ...filterData,
        where: {
          name: { $like: `%${value}%` },
        },
      })
    );
    setLoadingSearch(false);
  };

  return (
    <Row>
      <Col span={10}>
        <Search
          placeholder="Input search name"
          allowClear
          loading={loadingSearch}
          enterButton
          onSearch={handleSearch}
        />
      </Col>
      <Col span={14}>
        <Space style={{ float: "right" }}>
          {!_.isEqual(filterData, defaultFilter) && (
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={() => dispatch(setDefaultFilterData())}
              style={{ backgroundColor: gold.primary }}
            >
              Reset
            </Button>
          )}
          <Button
            type="primary"
            style={{ backgroundColor: green.primary }}
            icon={<PlusCircleFilled />}
            onClick={toggleModalAddPosition}
          >
            Add Position
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

export default PositionTableHeader;
