import PropTypes from 'prop-types';
import { Button, Col, Row, Space } from 'antd';
import { PlusCircleFilled, ReloadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setDefaultFilterData } from 'reducers/leave';
import { gold, green } from '@ant-design/colors';
import _ from 'lodash';

LeaveTableHeader.propTypes = {
  toggleModalAddLeave: PropTypes.func,
};

LeaveTableHeader.defaultProps = {
  toggleModalAddLeave: null,
};

function LeaveTableHeader(props) {
  const { toggleModalAddLeave } = props;
  const dispatch = useDispatch();
  const { filterData, defaultFilter } = useSelector((state) => state.leave);

  const resetFilter = () => {
    dispatch(setDefaultFilterData());
  };

  return (
    <Row>
      <Col span={10}>
        
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
            onClick={toggleModalAddLeave}
          >
            Create a leave request
          </Button>
        </Space>
      </Col>
    </Row>
  );
}

export default LeaveTableHeader;
