import { Drawer } from 'antd';
import PropTypes from 'prop-types';
import FilterManagerAttendanceForm from './FilterManagerAttendanceForm';
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
  const { filterData } = useSelector((state) => state.attendance);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleFilter = async (values) => {
    setConfirmLoading(true);
    let filter;

    if (!_.isEmpty(_.omitBy(values.attendanceDate, _.isNil))) {
      filter = {
        ...filter,
        attendanceDate: {
          $between: [
            values.attendanceDate[0].utc().format(),
            values.attendanceDate[1].utc().format(),
          ],
        },
      };
    }

    if (values.shiftId) {
      filter = {
        ...filter,
        shiftId: values.shiftId,
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
      <FilterManagerAttendanceForm
        onSubmit={handleFilter}
        loading={confirmLoading}
        initialValues={{
          attendanceDate: filterData.where.attendanceDate
            ? [
                dayjs(filterData.where.attendanceDate.$between[0]),
                dayjs(filterData.where.attendanceDate.$between[1]),
              ]
            : [],
          shiftId: filterData.where.shiftId ?? null,
        }}
      />
    </Drawer>
  );
}
export default FilterDrawer;
