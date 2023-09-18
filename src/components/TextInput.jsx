import { useState } from "react";
import { MdErrorOutline } from "react-icons/md";
import { IconContext } from "react-icons/lib";

/* eslint-disable react/prop-types */
const TextInput = ({
  handleChange,
  formData,
  label,
  error,
  last,
  ...props
}) => {
  const [focused, setFocused] = useState("false");
  const handleFocus = () => {
    setFocused(true);
  };
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={props.id} className="flex-shrink-0">
        {label}
      </label>
      <input
        type="text"
        className="p-2 rounded-md dark:text-gray-100 bg-gray-100 dark:bg-gray-900 min-w-[200px] outline-none custom-input"
        {...props}
        value={formData[props.id]}
        onChange={handleChange}
        onBlur={handleFocus}
        data-focused={focused}
        onFocus={() => last == "true" && setFocused(true)}
      />
      <p className="text-red-600 dark:text-red-500 dark:brightness-110 font-medium tracking-wide gap-2 items-center hidden error">
        <span className="self-start translate-y-1">
          <IconContext.Provider value={{ className: "w-5 h-5" }}>
            <MdErrorOutline />
          </IconContext.Provider>
        </span>
        <span className="whitespace-normal">{error}</span>
      </p>
    </div>
  );
};

export default TextInput;
