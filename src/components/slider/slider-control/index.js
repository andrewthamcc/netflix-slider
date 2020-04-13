import React from "react";
import { Icon } from "@iconify/react";
import chevronLeft from "@iconify/icons-mdi/chevron-left";
import chevronRight from "@iconify/icons-mdi/chevron-right";

require("./style.scss");

const SliderControl = ({ arrowDirection, onClick }) => {
  return (
    <div className={`slider-control ${arrowDirection}`}>
      <span className="slider-control-arrow" onClick={onClick}>
        <Icon icon={arrowDirection === "right" ? chevronRight : chevronLeft} />
      </span>
    </div>
  );
};

export default SliderControl;
