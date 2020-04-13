import React, { Component } from "react";
import SliderControl from "./slider-control";
import SliderItem from "./slider-item";

require("./style.scss");

export class Slider extends Component {
  constructor() {
    super();
    this.state = {
      sliderHasMoved: false, // boolean to display prev arrow and peak element
      sliderMoving: false, // boolean for slider animation status
      movePercentage: 0, // move percentage to shift slider during animation
      sliderMoveDirection: null, // direction of movement of animation
      lowestVisibleIndex: 0, // lowest visisble index of slider items
      itemsInRow: 5, // number of items in slider content changed by window size
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleWindowResize);
  }

  handleWindowResize = (e) => {
    if (window.innerWidth > 1440) {
      this.setState({ itemsInRow: 6 });
    } else if (window.innerWidth >= 1000) {
      this.setState({ itemsInRow: 5 });
    } else if (window.innerWidth < 1000) {
      this.setState({ itemsInRow: 4 });
    }
  };

  renderSliderContent = () => {
    // gets the indexes to be displayed
    const left = [];
    const mid = [];
    const right = [];

    return this.props.movies.map((movie) => (
      <SliderItem movie={movie} width={100 / this.state.itemsInRow} />
    ));
  };

  handlePrev = () => {};

  handleNext = () => {};

  render() {
    const {
      sliderHasMoved,
      sliderMoving,
      sliderMoveDirection,
      movePercentage,
      itemsInRow,
    } = this.state;

    let style = {};
    if (sliderMoving) {
      let translate = "";
      if (sliderMoveDirection === "right") {
        translate = `translateX(-${100 + movePercentage + 100 / itemsInRow}%)`;
      } else if (sliderMoveDirection === "left") {
        translate = `translateX(-${movePercentage + 100 / itemsInRow}%)`;
      }

      style = {
        transform: translate,
        transitionDuration: "750ms",
      };
    } else {
      style = {
        transform: `translateX(-${
          100 + (sliderHasMoved ? 100 / itemsInRow : 0)
        }%)`,
      };
    }

    return (
      <div className="slider">
        {sliderHasMoved && (
          <SliderControl arrowDirection={"left"} onClick={this.handlePrev} />
        )}
        <div className="slider-mask">
          <div className="slider-content" style={style}>
            {this.renderSliderContent()}
          </div>
        </div>
        <SliderControl arrowDirection={"right"} onClick={this.handleNext} />
      </div>
    );
  }
}

export default Slider;
