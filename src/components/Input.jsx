import { useId } from "react";

const Input = ({
  type = "text",
  label,
  onChange,
  name,
  required = true,
  value,
  classname = "",
  validate = false,
}) => {
  const id = useId();
  return (
    <div className="input-field">
      <input
        required={required}
        className={`input ${classname}`}
        id={id}
        type={type}
        name={name}
        onChange={onChange}
        value={value}
        validate={value?.trim() || validate ? "true" : "false"}
      />
      <label className="label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
};

export default Input;
