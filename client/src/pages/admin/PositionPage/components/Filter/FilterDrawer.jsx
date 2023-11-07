import { Drawer } from 'antd';
import PropTypes from 'prop-types';
import FilterPositionForm from './FilterPositionForm';
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
  const { filterData } = useSelector((state) => state.position);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleFilter = async (values) => {
    setConfirmLoading(true);
    let filter;
    if (!_.isEmpty(_.omitBy(values.minHourlyWage, _.isNil))) {
      filter = {
        minHourlyWage: values.minHourlyWage.to
          ? {
              $between: [
                values.minHourlyWage.from,
                values.minHourlyWage.to,
              ],
            }
          : { $gte: values.minHourlyWage.from },
      };
    }
    if (!_.isEmpty(_.omitBy(values.maxHourlyWage, _.isNil))) {
      filter = {
        ...filter,
        maxHourlyWage: values.maxHourlyWage.to
          ? {
              $between: [
                values.maxHourlyWage.from,
                values.maxHourlyWage.to,
              ],
            }
          : { $gte: values.maxHourlyWage.from },
      };
    }
    if (!_.isEmpty(_.omitBy(values.createdAt, _.isNil))) {
      filter = {
        ...filter,
        createdAt: {
          $between: [
            values.createdAt[0].utc().format(),
            values.createdAt[1].utc().format(),
          ],
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
