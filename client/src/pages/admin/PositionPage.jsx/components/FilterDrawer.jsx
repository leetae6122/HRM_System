import React from "react";
import { Button, Drawer } from "antd";
import PropsTypes from "prop-types";

FilterDrawer.propTypes = {
  onFilter: PropsTypes.func,
  toggleShowDrawer: PropsTypes.func,
  openDrawer: PropsTypes.bool
};

FilterDrawer.defaultProps = {
  onFilter: null,
  toggleShowDrawer: null,
  openDrawer: false
};

function FilterDrawer(props) {
  const {onFilter, toggleShowDrawer, openDrawer} = props;

  return (
    <>
      <Button type="primary" onClick={toggleShowDrawer}>
        Open
      </Button>
      <Drawer
        title="Basic Drawer"
        placement="right"
        onClose={toggleShowDrawer}
        open={openDrawer}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
    </>
  );
}
export default FilterDrawer;
