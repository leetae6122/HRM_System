import { Drawer } from 'antd';
import PropTypes from 'prop-types';
import FilterWageForm from './FilterWageForm';
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
  const { filterData } = useSelector((state) => state.wage);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleFilter = async (values) => {
    setConfirmLoading(true);
    let filter;
    if (!_.isEmpty(_.omitBy(values.basicHourlyWage, _.isNil))) {
      filter = {
        basicHourlyWage: {
          $gte: values.basicHourlyWage.from,
          $lte: values.basicHourlyWage.to,
        },
      };
    }

    if (values.fromDate) {
      filter = {
        ...filter,
        fromDate: {
          $gte: values.fromDate.utc().format(),
        },
      };
    }

    if (values.toDate) {
      filter = {
        ...filter,
        toDate: {
          $lte: values.toDate.utc().format(),
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
      <FilterWageForm
        onSubmit={handleFilter}
        loading={confirmLoading}
        initialValues={{
          basicHourlyWage: filterData.where.basicHourlyWage
            ? {
              from: filterData.where.basicHourlyWage.$gte ?? null,
              to: filterData.where.basicHourlyWage.$lte ?? null,
              }
            : {},
          fromDate: filterData.where.fromDate
            ? dayjs(filterData.where.fromDate.$gte)
            : '',
          toDate: filterData.where.toDate
            ? dayjs(filterData.where.toDate.$lte)
            : '',
        }}
      />
    </Drawer>
  );
}
export default FilterDrawer;
