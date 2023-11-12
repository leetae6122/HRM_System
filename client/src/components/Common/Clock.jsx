import { useEffect, useState } from 'react';
import Number from './Number';
import Word from './Word';
import PropTypes from 'prop-types';
import 'assets/styles/clock.scss';
import dayjs from 'dayjs';
import { Col, Row } from 'antd';

Clock.propTypes = {
  h24: PropTypes.bool,
  backgroundColor: PropTypes.string,
};

Clock.defaultProps = {
  h24: true,
  backgroundColor: '#00132e',
};

const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

function Clock(props) {
  const { h24, backgroundColor } = props;
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);
  const [day, setDay] = useState(0);
  const [pm, setPm] = useState(false);

  useEffect(() => {
    const update = () => {
      const date = dayjs();
      let hour = date.hour();
      if (!h24) {
        hour = hour % 12 || 12;
      }
      setHour(hour);
      setMinute(date.minute());
      setSecond(date.second());
      setDay(date.day());
      setPm(date.hour() >= 12);
    };

    update();

    const interval = setInterval(() => {
      update();
    }, 1000);

    return () => clearInterval(interval);
  }, [h24]);

  return (
    <Row gutter={[0, 0]} className="clock" style={{ backgroundColor }}>
      <Col span={24} className="calendar day">
        {days.map((value, index) => (
          <Word key={value} value={value} hidden={index != day} />
        ))}
      </Col>
      <Col span={24}>
        <Row gutter={[18, 12]}>
          <Col className="hour">
            <Number value={hour} />
            <Word value={':'} />
            <Number value={minute} />
            <Word value={':'} />
            <Number value={second} />
          </Col>
          <Col className="ampm">
            <Word value={'AM'} hidden={pm} />
            <Word value={'PM'} hidden={!pm} />
          </Col>
        </Row>
      </Col>
      <Col span={24} className="calendar date">
        <Word value={dayjs().format('DD - MM - YYYY')} />
      </Col>
    </Row>
  );
}

export default Clock;
