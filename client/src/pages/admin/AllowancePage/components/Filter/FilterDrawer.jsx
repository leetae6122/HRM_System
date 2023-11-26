import { Drawer } from 'antd';
import PropTypes from 'prop-types';
import FilterAllowanceForm from './FilterAllowanceForm';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
FilterDrawer.propTypes = {
  toggleShowDrawer: PropTypes.func,
  openDrawer: PropTypes.bool,
  setFilter: PropTypes.func,
};

FilterDrawer.defaultProps = {
  toggleShowDrawer: null,
  openDrawer: false,
  setFilter: null,
};

function FilterDrawer(props) {
  const { toggleShowDrawer, openDrawer, setFilter } = props;
  const { filterData } = useSelector((state) => state.allowance);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleFilter = async (values) => {
    setConfirmLoading(true);
    let filter;
    if (!_.isEmpty(_.omitBy(values.amount, _.isNil))) {
      filter = {
        amount: {
          $gte: values.amount.from,
          $lte: values.amount.to,
        },
      };
    }

    if (values.startDate) {
      filter = {
        ...filter,
        startDate: {
          $gte: values.startDate.utc().format(),
        },
      };
    }

    if (values.endDate) {
      filter = {
        ...filter,
        endDate: {
          $lte: values.endDate.utc().format(),
        },
      };
    }

    setFilter({
      ...filterData,
      page: 1,
      size: 10,
      where: filter,
    });
    setConfirmLoading(false);
    toggleShowDrawer();
  };

  return (
    <Drawer
      title="Filter"
      placement="right"
      onClose={toggleShowDrawer}
      open={openDrawer}
      width={'70vh'}
    >
      <FilterAllowanceForm
        onSubmit={handleFilter}
        loading={confirmLoading}
        initialValues={{
          amount: filterData.where.amount
            ? {
                from: filterData.where.amount.$gte ?? null,
                to: filterData.where.amount.$lte ?? null,
              }
            : {},
          startDate: filterData.where.startDate
            ? dayjs(filterData.where.startDate.$gte)
            : '',
          endDate: filterData.where.endDate
            ? dayjs(filterData.where.endDate.$lte)
            : '',
        }}
      />
    </Drawer>
  );
}
export default FilterDrawer;
