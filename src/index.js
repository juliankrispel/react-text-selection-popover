import React, { Fragment, Component } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import withContentRect from "react-measure/lib/with-content-rect";
import debounce from "lodash.debounce";
import windowDimensions from "react-window-dimensions";
import getVisibleSelectionRect from "./getVisibleSelectionRect";
import EventListener from "react-event-listener";
import centerAboveOrBelow from "./centerAboveOrBelow";

class Popover extends Component {
  static defaultProps = {
    selectionRef: { current: document.body },
    scrollRef: { current: window },
    placementStrategy: centerAboveOrBelow,
    gap: 5,
    openAfterSelection: false,
  };

  state = {
    isPressed: false,
    selectionPosition: null,
    isTextSelected: false,
    isOpen: false,
  };

  updatePosition = () => {
    const browserSelection = document.getSelection();
    const { onTextSelect, onTextUnselect, openAfterSelection } = this.props;
    const selectionRef =
      this.props.selectionRef && this.props.selectionRef.current;
    const selectionPosition = getVisibleSelectionRect(window);

    if (
      selectionPosition != null &&
      selectionRef != null &&
      browserSelection != null &&
      selectionRef.contains(browserSelection.anchorNode) === true &&
      selectionRef.contains(browserSelection.focusNode) === true
    ) {
      if (browserSelection.isCollapsed === false) {
        onTextSelect && onTextSelect(!this.state.isPressed);
        if (openAfterSelection) {
          this.setState({
            isTextSelected: true,
            isOpen: !this.state.isPressed,
          });
        } else {
          this.setState({ isTextSelected: true, isOpen: true });
        }
      } else {
        onTextUnselect && onTextUnselect();
        this.setState({ isTextSelected: false, isOpen: false });
      }

      this.setState({ selectionPosition });
    } else if (this.state.isTextSelected) {
      onTextUnselect && onTextUnselect();
      this.setState({ isTextSelected: false, isOpen: false });
    }
  };

  render() {
    const {
      selectionRef,
      measureRef,
      gap,
      scrollRef,
      placementStrategy,
      contentRect,
      windowHeight,
      windowWidth,
      children,
      className,
    } = this.props;

    const { selectionPosition } = this.state;
    const isOpen =
      typeof this.props.isOpen === "boolean"
        ? this.props.isOpen
        : this.state.isOpen;

    let style = {};

    if (
      selectionPosition !== null &&
      contentRect.bounds.width != null &&
      contentRect.bounds.width !== 0
    ) {
      /*
       * This style object only contains info for positioinng
       * the popover. It's prop, and these are the arguments passed
       */
      style = placementStrategy({
        gap,
        frameWidth: windowWidth,
        frameHeight: windowHeight,
        frameLeft: 0,
        frameTop: 0,
        boxWidth: contentRect.bounds.width,
        boxHeight: contentRect.bounds.height,
        selectionTop: selectionPosition.top,
        selectionLeft: selectionPosition.left,
        selectionWidth: selectionPosition.width,
        selectionHeight: selectionPosition.height,
      });

      style.pointerEvents = this.state.isPressed === true ? "none" : "auto";
    }

    /*
     * Before you ask, onSelectionChange only works on the document,
     * otherwise I would just use selectionRef instead and we wouldn't need
     * three of those event listeners
     */
    return [
      <EventListener
        key="update-position"
        target={document}
        onSelectionChange={this.updatePosition}
      />,
      <EventListener
        key="on-resize-window"
        target={window}
        onResize={this.updatePosition}
      />,
      <EventListener
        key="on-scroll"
        target={scrollRef && scrollRef.current ? scrollRef.current : window}
        onScroll={this.updatePosition}
      />,
      <EventListener
        key="on-mouse-up"
        target={
          selectionRef && selectionRef.current
            ? selectionRef.current
            : document.body
        }
        onMouseUp={() => {
          this.setState(
            { isPressed: false },
            this.props.openAfterSelection ? this.updatePosition : undefined
          );
        }}
      />,
      <EventListener
        key="on-mouse-down"
        target={
          selectionRef && selectionRef.current ? selectionRef.current : document
        }
        onMouseDown={() => this.setState({ isPressed: true })}
      />,
      selectionPosition == null ||
      !isOpen ||
      contentRect.bounds.width == 0 ? null : (
        <div key="popup" className={className} style={style} ref={measureRef}>
          {children}
        </div>
      ),
    ];
  }
}

const wrapPortal = (Comp) => ({ children, ...props }) =>
  createPortal(
    <Comp {...props}>
      <Fragment>{children}</Fragment>
    </Comp>,
    props.containerNode || document.body
  );

Popover.propTypes = {
  containerNode: PropTypes.instanceOf(Element),
  measure: PropTypes.func.isRequired,
  selectionRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }),
  scrollRef: PropTypes.shape({
    current: PropTypes.oneOfType([
      PropTypes.instanceOf(Element),
      PropTypes.instanceOf(window.constructor),
    ]),
  }),
  children: PropTypes.node.isRequired,
  onTextSelect: PropTypes.func,
  onTextUnselect: PropTypes.func,
  windowWidth: PropTypes.number,
  windowHeight: PropTypes.number,
  className: PropTypes.string,
  placementStrategy: PropTypes.func,
  measureRef: PropTypes.func.isRequired,
  contentRect: PropTypes.object.isRequired,
  gap: PropTypes.number,
  isOpen: PropTypes.bool,
};

export default wrapPortal(
  withContentRect(
    "bounds",
    "offset"
  )(
    windowDimensions({
      take: () => ({
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
      }),
      debounce: (onResize) => debounce(onResize, 120),
    })(Popover)
  )
);
