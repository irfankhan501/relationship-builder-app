import React from "react";

const Select = ({ name, options, ...rest}) => {
  return (
      <select name={name} id={name} {...rest} >
        <option value="select" >select</option>
        {options.map(option => (
          <option key={option._id} value={option._id}>
            {option.name}
          </option>
        ))}
      </select>
  );
};

export default Select;