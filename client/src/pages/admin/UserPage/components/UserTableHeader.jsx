import { useState } from "react";
import PropTypes from "prop-types";
import { Button, Col, Row, Space } from "antd";
import { PlusCircleFilled, ReloadOutlined } from "@ant-design/icons";
import Search from "antd/es/input/Search";
import { useDispatch, useSelector } from "react-redux";
import { setDefaultFilterData, setFilterData } from "reducers/position";
import { gold, green } from "@ant-design/colors";
import _ from "lodash";

UserTableHeader.propTypes = {
  toggleModalAddUser: PropTypes.func,
};

UserTableHeader.defaultProps = {
  toggleModalAddUser: null,
};

const defaultFilter = {
  page: 1,
  size: 10,
  where: {},
};

function UserTableHeader(props) {
  const { toggleModalAddUser } = props;
  const dispatch = useDispatch();
  const [loadingSearch, setLoadingSearch] = useState(false);
  const { filterData } = useSelector((state) => state.position);

  const handleSearch = (value) => {
    setLoadingSearch(true);
    dispatch(
      setFilterData({
        ...filterData,
        where: {
          $or: [
            { id: { $like: `%${value}%` } },
            { username: { $like: `%${value}%` } },
          ],
        },
        modelWhere: {
          $or: _.flatten(
            _.map(["firstName", "lastName", "email"], function (item) {
              return _.map(value.split(" "), function (q) {
                return { [item]: { $like: "%" + q + "%" } };
              });
            })
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
          placeholder="Input search id, name, email or username"
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
            onClick={toggleModalAddUser}
          >
            Add User
          </Button>
        </Space>
      </Col>
    </Row>
  );
}

export default UserTableHeader;
