import React from "react";
import { useNavigate } from "react-router-dom";

import { Button, Result } from "antd";

const Warning = (props) => {
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };
  return (
    <Result
      status="warning"
      title={props.title ?? "There are some problems with your operation."}
      extra={
        <Button type="primary" key="goBack" onClick={handleGoBack}>
          Go Back
        </Button>
      }
    />
  );
};
export default Warning;
