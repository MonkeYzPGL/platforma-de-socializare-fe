import React from "react";
import { useHistory } from "react-router-dom";

export default function ClickableLogo({ className = "", style = {}, disableNavigation = false }) {
    const history = useHistory();

    const handleClick = () => {
        if (!disableNavigation) {
            history.push("/feed");
        }
    };

    return (
        <div
            className={className}
            style={style}
            onClick={handleClick}
        />
    );
}
