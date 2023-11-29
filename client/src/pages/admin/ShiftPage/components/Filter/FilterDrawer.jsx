import { Drawer } from 'antd';
import PropTypes from 'prop-types';
import FilterShiftForm from './FilterShiftForm';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);
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
  const { filterData } = useSelector((state) => state.shift);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleFilter = async (values) => {
    setConfirmLoading(true);
    let filter;
    if (!_.isEmpty(_.omitBy(values.rangeTime, _.isNil))) {
      filter = {
        startTime: {
          $gte: values.rangeTime[0].format('HH:mm:ss'),
        },
        endTime: {
          $lte: values.rangeTime[1].format('HH:mm:ss'),
        },
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

    if (!_.isEmpty(_.omitBy(values.updatedAt, _.isNil))) {
      filter = {
        ...filter,
        updatedAt: {
          $between: [
            values.updatedAt[0].utc().format(),
            values.updatedAt[1].utc().format(),
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
      <FilterShiftForm
        onSubmit={handleFilter}
        loading={confirmLoading}
        initialValues={{
          rangeTime: filterData.where.startTime
            ? [
                dayjs(filterData.where.startTime.$gte, 'HH:mm:ss'),
                dayjs(filterData.where.endTime.$lte, 'HH:mm:ss'),
              ]
            : [],
          createdAt: filterData.where.createdAt
            ? [
                dayjs(filterData.where.createdAt.$between[0]),
                dayjs(filterData.where.createdAt.$between[1]),
              ]
            : [],
          updatedAt: filterData.where.updatedAt
            ? [
                dayjs(filterData.where.updatedAt.$between[0]),
                dayjs(filterData.where.updatedAt.$between[1]),
              ]
            : [],
        }}
      />
    </Drawer>
  );
}
export default FilterDrawer;
