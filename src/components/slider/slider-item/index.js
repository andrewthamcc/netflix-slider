import React from "react";

require("./style.scss");

const SliderItem = ({ movie, width }) => {
  return (
    <div className="slider-item" style={{ width: `${width}%` }}>
      <img
        className="slider-image"
        src={`http://image.tmdb.org/t/p/w780${movie.backdrop_path}`}
        alt={movie.title}
      />
    </div>
  );
};

export default SliderItem;
