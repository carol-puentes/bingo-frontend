import React from "react";
import styled from "styled-components";

export const InputCardComponent = () => {
  return (
    <div className="wave-group">
      <input required type="text" className="input" />
      <span className="bar" />
      <label className="label">
        <span className="label-char">NAME</span>
       
      </label>
    </div>
  );
};
