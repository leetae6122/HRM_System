
import { Drawer } from "antd";
import PropTypes from "prop-types";

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

  const onFilter = (values) => {
    console.log("filter", values);
  };

  return (
    <Drawer
      title="Filter"
      placement="right"
      onClose={toggleShowDrawer}
      open={openDrawer}
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Drawer>
  );
}
export default FilterDrawer;
