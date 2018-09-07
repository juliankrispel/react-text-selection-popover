## 1.0.1
- Fix packkage.json to include lib

## 1.0.0
- Move placement strategy into default prop - this makes placement completely configurable
- Deprecate direction prop
- Add docs section about placement strategies
- Add alternative placement strategy (as optional import) in `./lib` folder
- Fix prop type error caused by react-measure by forking project :/
- Only mount EventListener component when selectionRefs are defined

## 0.3.0
- Add isOpen state (automatically managed within component), this is only used when isOpen prop is not defined
- Popover can now be used with 0 Props - thanks to @sunilhari for implementing this :)
- Refactored placement logic

## 0.2.1
- Bugfix - account for both anchorNode and focusNode to be inside selectionRef

## 0.2.0
- First official release, all basic stuff seems to be working
