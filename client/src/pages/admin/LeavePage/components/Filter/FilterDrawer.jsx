import { Drawer } from 'antd';
import PropTypes from 'prop-types';
import FilterLeaveForm from './FilterLeaveForm';
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
  const { filterData } = useSelector((state) => state.leave);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleFilter = async (values) => {
    setConfirmLoading(true);
    let filter;
    if(values.employeeId){
      filter = {
        employeeId: values.employeeId,
      };
    }

    if (!_.isEmpty(_.omitBy(values.leaveFrom, _.isNil))) {
      filter = {
        ...filter,
        leaveFrom: {
          $between: [
            values.leaveFrom[0].utc().format(),
            values.leaveFrom[1].utc().format(),
          ],
        },
      };
    }

    if (!_.isEmpty(_.omitBy(values.leaveTo, _.isNil))) {
      filter = {
        ...filter,
        leaveTo: {
          $between: [
            values.leaveTo[0].utc().format(),
            values.leaveTo[1].utc().format(),
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
      <FilterLeaveForm onSubmit={handleFilter} loading={confirmLoading} />
    </Drawer>
  );
}
export default FilterDrawer;
