import { Checkbox } from 'antd';
import PropTypes from 'prop-types';

const CheckboxGroup = Checkbox.Group;

CheckAllCheckboxGroup.propTypes = {
  options: PropTypes.array,
  onChange: PropTypes.func,
  value: PropTypes.array,
  rest: PropTypes.any,
};

CheckAllCheckboxGroup.defaultProps = {
  options: [],
  onChange: null,
  value: [],
  rest: null,
};

function CheckAllCheckboxGroup(props) {
  const { options, onChange, value, ...rest } = props;
  const handleSelectAll = (checked) => {
    onChange(checked ? options.map((option) => option.value) : []);
  };

  const handleChange = (checkedValues) => {
    onChange(checkedValues);
  };

  return (
    <div>
      <Checkbox
        indeterminate={value.length > 0 && value.length < options.length}
        checked={value.length === options.length}
        onChange={(e) => handleSelectAll(e.target.checked)}
      >
        Select All
      </Checkbox>
      <CheckboxGroup
        options={options}
        value={value}
        onChange={handleChange}
        {...rest}
      />
    </div>
  );
}

export default CheckAllCheckboxGroup;
