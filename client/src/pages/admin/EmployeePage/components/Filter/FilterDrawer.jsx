import { Drawer } from 'antd';
import PropTypes from 'prop-types';
import FilterEmployeeForm from './FilterEmployeeForm';

FilterDrawer.propTypes = {
  toggleShowDrawer: PropTypes.func,
  openDrawer: PropTypes.bool,
};

FilterDrawer.defaultProps = {
  toggleShowDrawer: null,
  openDrawer: false,
};

function FilterDrawer(props) {
  const { toggleShowDrawer, openDrawer } = props;

  // const onFilter = (values) => {
  //   console.log("filter", values);
  // };

  return (
    <Drawer
      title="Filter"
      placement="right"
      onClose={toggleShowDrawer}
      open={openDrawer}
    >
      <FilterEmployeeForm />
    </Drawer>
  );
}
export default FilterDrawer;
