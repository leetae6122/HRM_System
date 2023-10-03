import { Card } from "antd";

import PropTypes from "prop-types";

QualityCard.propTypes = {
  quality: PropTypes.number,
  content: PropTypes.string,
  backgroundColor: PropTypes.string,
};

QualityCard.defaultProps = {
  quality: 10,
  content: null,
  backgroundColor: null
};

const cardStyle = {
  width: "100%",
  textAlign: "center",
  color: "white",
};

const qualityStyle = {
  display: "inline-block",
  fontSize: 18,
  fontWeight: "bold",
};

function QualityCard(props) {
  const { quality, content, backgroundColor } = props;
  return (
    <Card style={{ backgroundColor, ...cardStyle }}>
      <div style={qualityStyle}>{quality}</div>
      <div style={{ fontSize: 14 }}>{content}</div>
    </Card>
  );
}

export default QualityCard;
