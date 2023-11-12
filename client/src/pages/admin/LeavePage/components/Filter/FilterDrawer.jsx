import { Drawer } from 'antd';
import PropTypes from 'prop-types';
import FilterLeaveForm from './FilterLeaveForm';
import { useState } from 'react';
import { useSelector } from 'react-redux';
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
  const { filterData } = useSelector((state) => state.leave);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleFilter = async (values) => {
    setConfirmLoading(true);
    let filter;
    if (values.employeeId) {
      filter = {
        employeeId: values.employeeId,
      };
    }

    if (values.leaveFrom) {
      filter = {
        ...filter,
        leaveFrom: {
          $gte: values.leaveFrom.utc().format(),
        },
      };
    }

    if (values.leaveTo) {
      filter = {
        ...filter,
        leaveTo: {
          $lte: values.leaveTo.utc().format(),
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
      <FilterLeaveForm
        onSubmit={handleFilter}
        loading={confirmLoading}
        initialValues={{
          leaveFrom: filterData.where.leaveFrom
            ? dayjs(filterData.where.leaveFrom.$gte)
            : null,
          leaveTo: filterData.where.leaveTo
            ? dayjs(filterData.where.leaveTo.$lte)
            : null,
          employeeId: filterData.where.employeeId ?? null,
        }}
      />
    </Drawer>
  );
}
export default FilterDrawer;
