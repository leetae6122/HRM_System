import PropTypes from 'prop-types'

Word.propTypes = {
    value: PropTypes.string,
    hidden: PropTypes.bool
};
  
Word.defaultProps = {
    value: '',
    hidden: false
};

function Word(props) {
    const {value, hidden} = props;
    const getStyle = ()=> {
        return {
          visibility:  hidden ? 'hidden' : 'visible'
        }
      }
  return (
    <div className='digital'>
      <p>{value}</p>
      <p style={getStyle()}>{value}</p>
    </div>
  )
}

export default Word
