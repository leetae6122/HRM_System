import PropTypes from 'prop-types';
import { Button, Col, DatePicker, Row, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setDefaultFilterData } from 'reducers/payroll';
import { gold } from '@ant-design/colors';
import _ from 'lodash';
import { useState } from 'react';

PayrollTableHeader.propTypes = {
  setFilter: PropTypes.func,
};

PayrollTableHeader.defaultProps = {
  setFilter: null,
};

function PayrollTableHeader(props) {
  const { setFilter } = props;
  const dispatch = useDispatch();
  const { filterData, defaultFilter } = useSelector((state) => state.payroll);
  const [value, setValue] = useState([]);

  const resetFilter = () => {
    dispatch(setDefaultFilterData());
    setValue(null);
  };

  const onChangeDate = (value) => {
    setValue(value);
    const startDate = value[0].utc().format();
    const endDate = value[1].utc().format();

    setFilter({
      ...filterData,
      where: {
        $or: [
          { startDate: { $between: [startDate, endDate] } },
          { endDate: { $between: [startDate, endDate] } },
        ],
        status: filterData.where.status,
      },
    });
  };

  return (
    <Row>
      <Col span={12}>
        <DatePicker.RangePicker
          value={value}
          onChange={onChangeDate}
          format={'DD/MM/YYYY'}
          allowClear={false}
        />
      </Col>
      <Col span={12}>
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
        </Space>
      </Col>
    </Row>
  );
}

export default PayrollTableHeader;
