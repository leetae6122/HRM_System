import { useState } from "react";
import PropTypes from "prop-types";
import { Button, Col, Row, Space } from "antd";
import { FilterFilled, PlusCircleFilled, ReloadOutlined } from "@ant-design/icons";
import Search from "antd/es/input/Search";
import { useDispatch, useSelector } from "react-redux";
import { setDefaultFilterData, setFilterData } from "reducers/employee";
import { gold, green } from "@ant-design/colors";
import _ from "lodash";

EmployeeTableHeader.propTypes = {
  toggleModalAddEmployee: PropTypes.func,
  toggleShowFilterDrawer: PropTypes.func,
};

EmployeeTableHeader.defaultProps = {
  toggleModalAddEmployee: null,
  toggleShowFilterDrawer: null,
};

const defaultFilter = {
  page: 1,
  size: 10,
  where: {},
};

function EmployeeTableHeader(props) {
  const { toggleModalAddEmployee, toggleShowFilterDrawer } = props;
  const dispatch = useDispatch();
  const [loadingSearch, setLoadingSearch] = useState(false);
  const { filterData } = useSelector((state) => state.employee);

  const handleSearch = (value) => {
    setLoadingSearch(true);
    dispatch(
      setFilterData({
        ...filterData,
        where: {
          $or: _.flatten(
            _.map(
              ["firstName", "lastName", "email", "phoneNumber", "id"],
              function (item) {
                return _.map(value.split(" "), function (q) {
                  return { [item]: { $like: "%" + q + "%" } };
                });
              }
            )
          ),
        },
      })
    );
    setLoadingSearch(false);
  };

  return (
    <Row>
      <Col span={10}>
        <Search
          placeholder="Input search id, name, email or phone number"
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
            onClick={toggleModalAddEmployee}
          >
            Add Employee
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

export default EmployeeTableHeader;
