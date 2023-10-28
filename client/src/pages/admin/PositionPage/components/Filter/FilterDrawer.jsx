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
    if (!_.isEmpty(_.omitBy(values.minHourlySalary, _.isNil))) {
      filter = {
        minHourlySalary: values.minHourlySalary.to
          ? {
              $between: [
                values.minHourlySalary.from,
                values.minHourlySalary.to,
              ],
            }
          : { $gte: values.minHourlySalary.from },
      };
    }
    if (!_.isEmpty(_.omitBy(values.maxHourlySalary, _.isNil))) {
      filter = {
        ...filter,
        maxHourlySalary: values.maxHourlySalary.to
          ? {
              $between: [
                values.maxHourlySalary.from,
                values.maxHourlySalary.to,
              ],
            }
          : { $gte: values.maxHourlySalary.from },
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
