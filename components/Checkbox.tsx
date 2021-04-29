import { useFriendFormContext, Field, useField } from '@/components/FriendForm';

const Checkbox: Field = ({
  name,
}) => {
  const [
    { label: labelString, readOnly, value },
    { error, touched },
    { setValue },
  ] = useField({ name });
  const { handleBlur } = useFriendFormContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.checked);
  };

  return (
    <label>
      {labelString}
      <input
        type="checkbox"
        name={name}
        readOnly={readOnly}
        checked={!!value}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {touched && error && <span className="error">{error}</span>}
    </label>
  );
};

export default Checkbox;
