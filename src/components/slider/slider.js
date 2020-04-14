import React, { Component } from "react";
import SliderControl from "./slider-control";
import SliderItem from "./slider-item";

export class slider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sliderHasMoved: false,
      sliderMoveDirection: null,
      sliderMoving: false,
      movePercentage: 0,
      lowestVisibleIndex: 0,
      itemsInRow: 5,
      totalItems: 0,
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleWindowResize);
    this.handleWindowResize();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
  }

  // alter number of items in row on window resize
  handleWindowResize = () => {
    if (window.innerWidth > 1440) {
      this.setState({ itemsInRow: 6 });
    } else if (window.innerWidth >= 1000) {
      this.setState({ itemsInRow: 5 });
    } else if (window.innerWidth < 1000) {
      this.setState({ itemsinRow: 4 });
    }
  };

  // render the slider contents
  renderSliderContent = () => {
    const { sliderHasMoved, itemsInRow, lowestVisibleIndex } = this.state;
    const { movies } = this.props;
    const totalItems = movies.length;

    // slider content made up of left, mid, and right portions to allow continous cycling
    const left = [];
    const mid = [];
    const right = [];

    // gets the indexes to be displayed
    for (let i = 0; i < itemsInRow; i++) {
      // left
      if (sliderHasMoved) {
        if (lowestVisibleIndex + i - itemsInRow < 0) {
          left.push(totalItems - itemsInRow + lowestVisibleIndex + i);
        } else {
          left.push(i + lowestVisibleIndex - itemsInRow); // issue here
        }
      }

      // mid
      if (i + lowestVisibleIndex >= totalItems) {
        mid.push(i + lowestVisibleIndex - totalItems);
      } else {
        mid.push(i + lowestVisibleIndex);
      }

      // right
      if (i + lowestVisibleIndex + itemsInRow >= totalItems) {
        right.push(i + lowestVisibleIndex + itemsInRow - totalItems);
      } else {
        right.push(i + lowestVisibleIndex + itemsInRow);
      }
    }

    // console.log("left", left);
    // console.log("mid", mid);
    // console.log("right", right);

    // combine left, mid, right to have all indexes
    const combinedIndex = [...left, ...mid, ...right];

    const sliderContents = [];
    for (let index of combinedIndex) {
      sliderContents.push(
        <SliderItem
          movie={movies[index]}
          key={movies[index].id}
          width={100 / itemsInRow}
        />
      );
    }

    // adds empty divs to take up appropriate spacing when slider at initial position
    if (!sliderHasMoved) {
      for (let i = 0; i < itemsInRow; i++) {
        sliderContents.unshift(
          <div
            className="slider-item"
            style={{ width: `${100 / itemsInRow}%` }}
            key={i}
          />
        );
      }
    }

    return sliderContents;
  };

  handlePrev = () => {
    const { lowestVisibleIndex, itemsInRow } = this.state;
    const { movies } = this.props;
    const totalItems = movies.length;

    // get the new lowest visible index
    let newIndex;
    if (lowestVisibleIndex < itemsInRow && lowestVisibleIndex !== 0) {
      newIndex = 0;
    } else if (lowestVisibleIndex - itemsInRow < 0) {
      newIndex = totalItems - itemsInRow;
    } else {
      newIndex = lowestVisibleIndex - itemsInRow;
    }

    // get the move percentage
    let newMovePercentage;
    if (lowestVisibleIndex === 0) {
      newMovePercentage = 0;
    } else if (lowestVisibleIndex - newIndex < itemsInRow) {
      newMovePercentage =
        ((itemsInRow - (lowestVisibleIndex - newIndex)) / itemsInRow) * 100;
    } else {
      newMovePercentage = 0;
    }

    this.setState(
      {
        sliderMoving: true,
        sliderMoveDirection: "left",
        movePercentage: newMovePercentage,
      },
      () => {
        setTimeout(() => {
          this.setState({
            lowestVisibleIndex: newIndex,
            sliderMving: false,
            sliderMoveDirection: null,
            // newMovePercentage: 0,
          });
        }, 750);
      }
    );
  };

  handleNext = () => {
    const { sliderHasMoved, lowestVisibleIndex, itemsInRow } = this.state;
    const { movies } = this.props;
    const totalItems = movies.length;

    // get the new lowest visible index
    let newIndex;
    if (lowestVisibleIndex === totalItems - itemsInRow) {
      newIndex = 0;
    } else if (lowestVisibleIndex + itemsInRow > totalItems - itemsInRow) {
      newIndex = totalItems - itemsInRow;
    } else {
      newIndex = lowestVisibleIndex + itemsInRow;
    }

    // get the move percentage
    let newMovePercentage;
    if (newIndex !== 0) {
      newMovePercentage = ((newIndex - lowestVisibleIndex) / itemsInRow) * 100;
    } else {
      newMovePercentage = 100;
    }

    this.setState(
      {
        sliderMoving: true,
        sliderMoveDirection: "right",
        movePercentage: newMovePercentage,
      },
      () => {
        setTimeout(() => {
          this.setState({
            lowestVisibleIndex: newIndex,
            sliderMving: false,
            sliderMoveDirection: null,
            // movePercentage: 0,
          });
        }, 750);
      }
    );

    if (!sliderHasMoved) {
      this.setState({ sliderHasMoved: true });
    }
  };

  render() {
    const {
      sliderHasMoved,
      itemsInRow,
      sliderMoving,
      sliderMoveDirection,
      movePercentage,
    } = this.state;
    const { movies } = this.props;

    if (!movies.length) {
      return null;
    }

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

export default slider;
