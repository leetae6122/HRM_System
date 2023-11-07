import { Drawer } from 'antd';
import PropTypes from 'prop-types';
import FilterPositionForm from './FilterWageForm';
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
        basicHourlyWage: values.basicHourlyWage.to
          ? {
              $between: [
                values.basicHourlyWage.from,
                values.basicHourlyWage.to,
              ],
            }
          : { $gte: values.basicHourlyWage.from },
      };
    }

    if (!_.isEmpty(_.omitBy(values.fromDate, _.isNil))) {
      filter = {
        ...filter,
        fromDate: {
          $gte: values.fromDate.utc().format(),
        },
      };
    }

    if (!_.isEmpty(_.omitBy(values.toDate, _.isNil))) {
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
      <FilterPositionForm onSubmit={handleFilter} loading={confirmLoading} />
    </Drawer>
  );
}
export default FilterDrawer;
