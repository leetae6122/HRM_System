import PropTypes from 'prop-types'

Number.propTypes = {
    value: PropTypes.number,
};
  
Number.defaultProps = {
    value: 0,
};

function Number(props) {
const { value } = props;
  const result = String(value).padStart(2, '0');
  return (
    <div className="digital">
      <p>88</p>
      <p>{result}</p>
    </div>
  );
}

export default Number;
