import { useId } from "react";

const Input = ({
  type = "text",
  label,
  onChange,
  name,
  required = true,
  value,
}) => {
  const id = useId();
  return (
    <div className="input-field">
      <input
        required={required}
        className="input"
        id={id}
        type={type}
        name={name}
        onChange={onChange}
        value={value}
        validate={value?.trim() ? "true" : "false"}
      />
      <label className="label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
};

export default Input;
