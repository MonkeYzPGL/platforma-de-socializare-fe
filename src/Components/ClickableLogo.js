import React from "react";
import { useHistory } from "react-router-dom";

export default function ClickableLogo({ className = "", style = {} }) {
    const history = useHistory();
  
    return (
      <div
        className={className}
        style={style}
        onClick={() => history.push("/")}
      />
    );
  }
  
