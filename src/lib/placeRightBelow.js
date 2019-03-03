export default ({
  // The gap between the text and the selection and the popover
  // comes from `props.gap`
  gap,

  // z-index for popover
  zIndex,

  // by default frame === window but this might
  // change in future. For example if we'd like to restrict
  // placement to a container other than window
  // if frame is window, frameLeft and frameTop are 0
  frameHeight,
  frameWidth,
  frameLeft,
  frameTop,

  // the dimensions of the popover
  boxHeight,
  /* boxWidth, */

  // the dimensions and position of the selected text
  selectionTop,
  selectionLeft,
  /* selectionWidth, */
  selectionHeight
}) => {
  const style = { position: "fixed", zIndex };

  style.left = selectionLeft;
  style.top = selectionTop + selectionHeight + gap;

  // if the popover is placed too far to the right, align with right edge
  if (style.right > frameWidth) {
    delete style.left;
    style.right = frameLeft + frameWidth;
  }

  // if the popover is placed below the frame, position above
  // selection instead if there's room
  if (style.top + boxHeight > frameHeight && selectionTop - (gap + boxHeight) > frameTop) {
    style.top = selectionTop - (gap + boxHeight);
  }

  return style;
};
