
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Button, Result } from "antd";

Warning.propTypes = {
  title: PropTypes.string,
};

Warning.defaultProps = {
  title: '',
};


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
