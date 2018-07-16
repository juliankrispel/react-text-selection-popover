import React, { Fragment, Component } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { withContentRect } from "react-measure";
import debounce from "lodash/debounce";
import windowDimensions from "react-window-dimensions";
import getVisibleSelectionRect from "draft-js/lib/getVisibleSelectionRect";
import EventListener from "react-event-listener";

const canBePlaced = (
  place,
  { windowHeight, windowWidth, top, left, lineHeight, boxHeight, boxWidth },
  gap
) => {
  if (place === "below")
    return windowHeight >= top + gap + lineHeight + boxHeight;
  if (place === "above") return top - (boxHeight + gap) >= 0;
  if (place === "right") return left + boxWidth <= windowWidth;
  if (place === "left") return left - boxWidth >= 0;
};

const place = (
  place,
  { windowHeight, windowWidth, top, left, lineHeight, boxHeight, boxWidth },
  gap
) => {
  const style = { position: "fixed" };

  if (place === "below") {
    style.left = left - boxWidth / 2;
    style.top = top + gap + lineHeight;
  } else if (place === "below-left") {
    style.left = left;
    style.top = top + gap + lineHeight;
  } else if (place === "below-right") {
    style.left = left;
    style.top = top + gap + lineHeight;
  } else if (place === "above-right") {
    style.left = left;
    style.bottom = windowHeight - top - gap;
  } else if (place === "above-left") {
    style.right = windowWidth - left;
    style.bottom = windowHeight - top - gap;
  } else if (place === "above") {
    style.left = left - boxWidth / 2;
    style.bottom = windowHeight - top + gap;
  } else if (place === "right") {
    style.left = left;
    style.top = top + lineHeight / 2 - boxHeight / 2;
  } else if (place === "left") {
    style.right = windowWidth - left;
    style.top = top + lineHeight / 2 - boxHeight / 2;
  }

  // if we're on the right outer edge stay right
  if (windowWidth <= style.left + boxWidth) {
    style.right = 0;
    delete style.left;

    // if we're on the top stick to the top
  } else if (style.top < 0) {
    style.top = 0;
  } else if (style.bottom > windowHeight) {
    style.bottom = 0;
    delete style.top;
  } else if (style.left < 0) {
    style.left = 0;
  }

  return style;
};

const verticalOrder = ["below", "above"];
const horizontalOrder = ["right", "left"];

const getStyle = ({
  gap,
  defaultDirection,
  position: { left, height: lineHeight, width: selectionWidth, top },
  contentRect,
  windowHeight,
  windowWidth,
  style
}) => {
  const {
    bounds: { height: boxHeight, width: boxWidth }
  } = contentRect;
  const measureProps = {
    lineHeight,
    left,
    top,
    boxHeight,
    boxWidth,
    windowHeight,
    windowWidth
  };

  measureProps.left = left + selectionWidth / 2;

  const directionOrder = (defaultDirection === "left" ||
  defaultDirection === "right"
    ? horizontalOrder.concat(verticalOrder)
    : verticalOrder.concat(horizontalOrder)
  ).sort((dirA, dirB) => (dirB === defaultDirection ? 1 : 0));

  const possiblePlaces = directionOrder.filter(dir =>
    canBePlaced(dir, measureProps, gap)
  );

  if (possiblePlaces.length > 0) {
    return { ...style, ...place(possiblePlaces[0], measureProps, gap) };
  } else {
    return { ...style, ...place("below", measureProps, gap) };
  }
};

class Popover extends Component {
  state = {
    position: null,
    isTextSelected: false
  };

  updatePosition = () => {
    const browserSelection = document.getSelection();
    const { onTextSelect, onTextUnselect } = this.props;
    const selectionRef = this.props.selectionRef && this.props.selectionRef.current;

    if (
      selectionRef != null &&
      browserSelection != null &&
      selectionRef.contains(browserSelection.baseNode) === true
    ) {
      if (browserSelection.isCollapsed === false) {
        onTextSelect && onTextSelect();
        this.setState({ isTextSelected: true });
      } else {
        onTextUnselect && onTextUnselect();
        this.setState({ isTextSelected: false });
      }

      const position = getVisibleSelectionRect(window);
      if (position != null) {
        this.setState({ position });
      }
    } else if(this.state.isTextSelected) {
      onTextUnselect && onTextUnselect();
    }
  };

  render() {
    const { measureRef, isOpen, children, className, ...props } = this.props;

    const { position } = this.state;

    let style = {};
    if (position !== null) {
      style = getStyle({
        ...props,
        position
      });
    }

    return [
      <EventListener
        key="event-listener"
        target={document}
        onSelectionChange={this.updatePosition}
      />,
      (position == null || !isOpen) ? null : (
        <div key="popup" className={className} style={style} ref={measureRef}>
          {children}
        </div>
      )
    ];
  }
}

const wrapPortal = Comp => ({ children, ...props }) =>
  createPortal(
    <Comp {...props}>
      <Fragment>{children}</Fragment>
    </Comp>,
    document.body
  );

Popover.propTypes = {
  measure: PropTypes.func.isRequired,
  selectionRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element ),
  }),
  children: PropTypes.node.isRequired,
  onTextSelect: PropTypes.func,
  onTextUnselect: PropTypes.func,
  className: PropTypes.string,
  measureRef: PropTypes.func.isRequired,
  defaultDirection: PropTypes.string,
  contentRect: PropTypes.object.isRequired,
  gap: PropTypes.number,
  isOpen: PropTypes.bool
};

Popover.defaultProps = {
  gap: 5,
  isOpen: true,
  defaultDirection: "below"
};

export default wrapPortal(
  withContentRect("bounds", "offset")(
    windowDimensions({
      take: () => ({
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight
      }),
      debounce: onResize => debounce(onResize, 120)
    })(Popover)
  )
);
