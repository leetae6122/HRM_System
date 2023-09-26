import React from "react";
import { Drawer } from "antd";
import PropTypes from "prop-types";

FilterDrawer.propTypes = {
  onFilter: PropTypes.func,
  toggleShowDrawer: PropTypes.func,
  openDrawer: PropTypes.bool,
};

FilterDrawer.defaultProps = {
  onFilter: null,
  toggleShowDrawer: null,
  openDrawer: false,
};

function FilterDrawer(props) {
  const { onFilter, toggleShowDrawer, openDrawer } = props;

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
