export default ({
  // The gap between the text and the selection and the popover
  // comes from `props.gap`
  gap,

  // by default frame === window but this might
  // change in future. For example if we'd like to restrict
  // placement to a container other than window
  // if frame is window, frameLeft and frameTop are 0
  /* frameHeight, */
  frameWidth,
  frameLeft,
  frameTop,

  // the dimensions of the popover
  boxHeight,
  boxWidth,

  // the dimensions and position of the selected text
  selectionTop,
  selectionLeft,
  selectionWidth,
  /* selectionHeight */
}) => {
  const style = { position: "fixed" };

  style.left = selectionLeft + (selectionWidth / 2) - (boxWidth / 2);
  style.top = selectionTop - boxHeight - gap;

  // If the popover is placed beyond the left edge of the screen align
  // with left edge
  if (style.left < frameLeft) {
    style.left = frameLeft;
  // if the 
  } else if (style.right > frameWidth) {
    delete style.left;
    style.right = frameLeft + frameWidth;
  }

  // if the popover is placed above the frame, position below selection instead
  if (style.top < frameTop) {
    style.top = selectionTop + gap;
  }

  return style;
};
