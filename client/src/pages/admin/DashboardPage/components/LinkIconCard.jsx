import { Card, Tag } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const { Meta } = Card;


const tagStyle = {
  padding: "10px",
  borderRadius: "100%",
  border: "none",
};
function LinkIconCard(props) {
  const { link, Icon, iconColor, title } = props;
  return (
    <Link to={link}>
      <Card hoverable style={{ width: "100%" }}>
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
