import { Card, Tag } from 'antd';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const { Meta } = Card;

const tagStyle = {
  padding: '10px',
  borderRadius: '100%',
  border: 'none',
};
LinkIconCard.propTypes = {
  link: PropTypes.string,
  Icon: PropTypes.object,
  iconColor: PropTypes.string,
  title: PropTypes.string,
};

LinkIconCard.defaultProps = {
  link: '',
  Icon: null,
  iconColor: '',
  title: '',
};

function LinkIconCard(props) {
  const { link, Icon, iconColor, title } = props;
  return (
    <Link to={link}>
      <Card hoverable style={{ width: '100%', height: 100 }}>
        <Meta
          avatar={
            <Tag
              icon={Icon}
              style={{
                backgroundColor: iconColor,
                ...tagStyle,
              }}
            />
          }
          title={title}
          description="View Detail"
        />
      </Card>
    </Link>
  );
}

export default LinkIconCard;
