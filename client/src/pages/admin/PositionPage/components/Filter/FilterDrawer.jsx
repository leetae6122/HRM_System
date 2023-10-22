import { Drawer } from 'antd';
import PropTypes from 'prop-types';
import FilterPositionForm from './FilterPositionForm';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';

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
    console.log(values);
    let filter;
    if (!_.isEmpty(_.omitBy(values.minSalary, _.isNil))) {
      filter = {
        minSalary: values.minSalary.to
          ? { $between: [values.minSalary.from, values.minSalary.to] }
          : { $gte: values.minSalary.from },
      };
    }
    if (!_.isEmpty(_.omitBy(values.maxSalary, _.isNil))) {
      filter = {
        ...filter,
        maxSalary: values.maxSalary.to
          ? { $between: [values.maxSalary.from, values.maxSalary.to] }
          : { $gte: values.maxSalary.from },
      };
    }
    if (!_.isEmpty(_.omitBy(values.createdAt, _.isNil))) {
      filter = {
        ...filter,
        createdAt: { $between: [values.maxSalary.from, values.maxSalary.to] },
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
