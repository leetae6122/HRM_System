import { Card, Progress } from 'antd';

import PropTypes from 'prop-types';

CardProgress.propTypes = {
  content: PropTypes.string,
  backgroundColor: PropTypes.string,
  percent: PropTypes.number,
  format: PropTypes.string,
  status: PropTypes.string,
  type: PropTypes.string,
};

CardProgress.defaultProps = {
  content: null,
  backgroundColor: null,
  percent: 0,
  format: null,
  status: 'active',
  type: 'dashboard',
};

const cardStyle = {
  width: '100%',
  height: '100%',
  textAlign: 'center',
  color: 'white',
};

const contentStyle = {
  display: 'inline-block',
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 8,
};

const progressStyle = {
  backgroundColor: 'white',
  padding: 8,
  borderRadius: '100%',
};

function CardProgress(props) {
  const { content, backgroundColor, percent, format, status, type } = props;
  return (
    <Card style={{ backgroundColor, ...cardStyle }}>
      <div style={contentStyle}>{content}</div>
      <div style={{ fontSize: 14 }}>
        <Progress
          type={type}
          percent={percent}
          format={() => format}
          style={progressStyle}
          status={status}
        />
      </div>
    </Card>
  );
}

export default CardProgress;
