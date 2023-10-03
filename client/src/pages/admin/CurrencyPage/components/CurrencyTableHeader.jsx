import { useState } from "react";
import PropTypes from "prop-types";
import { Button, Col, Row, Space } from "antd";
import { PlusCircleFilled, ReloadOutlined } from "@ant-design/icons";
import Search from "antd/es/input/Search";
import { useDispatch, useSelector } from "react-redux";
import { setDefaultFilterData, setFilterData } from "reducers/currency";
import { gold, green } from "@ant-design/colors";
import _ from "lodash";

CurrencyTableHeader.propTypes = {
  toggleModalAddCurrency: PropTypes.func,
};

CurrencyTableHeader.defaultProps = {
  toggleModalAddCurrency: null,
};

const defaultFilter = {
  page: 1,
  size: 10,
  where: {},
};

function CurrencyTableHeader(props) {
  const { toggleModalAddCurrency } = props;
  const dispatch = useDispatch();
  const [loadingSearch, setLoadingSearch] = useState(false);
  const { filterData } = useSelector((state) => state.currency);
  const [inputValue, setInputValue] = useState("");

  const handleSearch = (value) => {
    setLoadingSearch(true);
    dispatch(
      setFilterData({
        ...filterData,
        where: {
          $or: [
            {
              name: { $like: `%${value}%` },
            },
            {
              code: { $like: `%${value}%` },
            },
          ],
        },
      })
    );
    setLoadingSearch(false);
  };

  const resetFilter = () => {
    dispatch(setDefaultFilterData());
    setInputValue("");
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
        <Space style={{ float: "right" }}>
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
            onClick={toggleModalAddCurrency}
          >
            Add Currency
          </Button>
        </Space>
      </Col>
    </Row>
  );
}

export default CurrencyTableHeader;
