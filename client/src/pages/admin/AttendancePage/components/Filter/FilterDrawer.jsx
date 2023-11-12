import { Drawer } from 'antd';
import PropTypes from 'prop-types';
import FilterAttendanceForm from './FilterAttendanceForm';
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
  const { filterData } = useSelector((state) => state.attendance);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleFilter = async (values) => {
    setConfirmLoading(true);
    let filter;
    if (values.employeeId) {
      filter = {
        employeeId: values.employeeId,
      };
    }
    if (values.shiftId) {
      filter = {
        ...filter,
        shiftId: values.shiftId,
      };
    }
    if (values.attendanceDate) {
      filter = {
        ...filter,
        attendanceDate: {
          $between: [
            values.attendanceDate.startOf('month').utc().format(),
            values.attendanceDate.endOf('month').utc().format(),
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
      <FilterAttendanceForm
        onSubmit={handleFilter}
        loading={confirmLoading}
        initialValues={{
          attendanceDate: filterData.where.attendanceDate
            ? dayjs(filterData.where.attendanceDate.$between[0])
            : null,
          employeeId: filterData.where.employeeId ?? null,
          shiftId: filterData.where.shiftId ?? null,
        }}
      />
    </Drawer>
  );
}
export default FilterDrawer;
