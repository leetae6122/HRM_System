import { Card, Col, Divider, Row } from 'antd';
import Clock from './components/Clock';

function TimekeeperPage() {
  return (
    <>
      <Divider style={{ fontSize: 24, fontWeight: 'bold' }}>Timekeeper</Divider>
      <Row gutter={[8, 12]}>
        <Col span={24}>
          <Clock h24={true} />
        </Col>
        <Col span={24}>
          <Card />
        </Col>
      </Row>
    </>
  );
}

export default TimekeeperPage;
