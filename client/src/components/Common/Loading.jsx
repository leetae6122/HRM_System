
import { Space, Spin } from "antd";

function Loading() {
  return (
    <div className="center-screen">
      <Space
        direction="vertical"
        style={{
          width: "100%"
        }}
      >
        <Space>
          <Spin tip="Loading" size="large" style={{fontSize: "50px"}}>
            <div className="content-loading " />
          </Spin>
        </Space>
      </Space>
    </div>
  );
}

export default Loading;
