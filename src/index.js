import React, { Fragment, Component } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { withContentRect } from "react-measure";
import debounce from "lodash.debounce";
import windowDimensions from "react-window-dimensions";
import getVisibleSelectionRect from "./getVisibleSelectionRect";
import EventListener from "react-event-listener";

const canBePlaced = (
  place,
  { windowHeight, top, lineHeight, boxHeight },
  gap
) => {
  if (place === "below")
    return windowHeight >= top + gap + lineHeight + boxHeight;
  if (place === "above") return top - (boxHeight + gap) >= 0;
};

const place = (
  place,
  { windowHeight, windowWidth, top, left, lineHeight, boxWidth },
  gap
) => {
  const style = { position: "fixed" };

  if (place === "below") {
    style.left = left - boxWidth / 2;
    style.top = top + gap + lineHeight;
  } else if (place === "above") {
    style.left = left - boxWidth / 2;
    style.bottom = windowHeight - top + gap;
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

  const positions =
    defaultDirection === "above" ? ["above", "below"] : ["below", "above"];

  const possiblePosition = positions.filter(dir =>
    canBePlaced(dir, measureProps, gap)
  )[0];

  return { ...style, ...place(possiblePosition, measureProps, gap) };
};

class Popover extends Component {
  state = {
    isPressed: false,
    position: null,
    isTextSelected: false,
    isOpen: false
  };

  updatePosition = () => {
    const browserSelection = document.getSelection();
    const { onTextSelect, onTextUnselect } = this.props;

    const selectionRef =
      this.props.selectionRef && this.props.selectionRef.current;

    const position = getVisibleSelectionRect(window);

    if (
      position != null &&
      selectionRef != null &&
      browserSelection != null &&
      selectionRef.contains(browserSelection.anchorNode) === true &&
      selectionRef.contains(browserSelection.focusNode) === true
    ) {
      if (browserSelection.isCollapsed === false) {
        onTextSelect && onTextSelect();
        this.setState({ isTextSelected: true, isOpen: true });
      } else {
        onTextUnselect && onTextUnselect();
        this.setState({ isTextSelected: false, isOpen: false });
      }

      this.setState({ position });
    } else if (this.state.isTextSelected) {
      onTextUnselect && onTextUnselect();
      this.setState({ isTextSelected: false, isOpen: true });
    }
  };
  renderPopOver = style => {
    const { children, isOpen, className, measureRef } = this.props;
    const { position } = this.state;
    let renderElement = null;
    if (position !== null) {
      let renderCondition =
        typeof isOpen === "undefined" ? this.state.isOpen : isOpen;
      renderElement = renderCondition ? (
        <div key="popup" className={className} style={style} ref={measureRef}>
          {children}
        </div>
      ) : (
        renderElement
      );
    }
    return renderElement;
  };
  render() {
    const {
      selectionRef,
      measureRef,
      isOpen,
      children,
      className,
      ...props
    } = this.props;

    const { position } = this.state;

    let style = {};
    if (position !== null && props.contentRect.bounds.width != null) {
      style = getStyle({
        ...props,
        position
      });

      style.pointerEvents = this.state.mousePressed === true ? "none" : "auto";
    }

    return [
      <EventListener
        key="update-position"
        target={document}
        onSelectionChange={this.updatePosition}
      />,
      <EventListener
        key="on-mouse-up"
        target={(selectionRef && selectionRef.current) || document}
        onMouseUp={() => this.setState({ mousePressed: false })}
      />,
      <EventListener
        key="on-mouse-down"
        target={(selectionRef && selectionRef.current) || document}
        onMouseDown={() => this.setState({ mousePressed: true })}
      />,
      this.renderPopOver()
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
    current: PropTypes.instanceOf(Element)
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
  defaultDirection: "above"
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
