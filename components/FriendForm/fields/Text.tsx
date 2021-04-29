import { useField } from '../Field';
import { useFriendFormContext } from '../FriendFormContext';
import { Field } from '../types';

const Text: Field = ({
  name,
}) => {
  const [{
    label: labelString, placeholder, readOnly, value,
  }, { error, touched }] = useField({ name });
  const {
    handleChange, handleBlur,
  } = useFriendFormContext();

  return (
    <label>
      {labelString}
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        readOnly={readOnly}
        value={value || ''}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {touched && error && <span className="error">{error}</span>}
    </label>
  );
};

export default Text;
