# react-text-selection-popover

![lil-demo](demo.gif)

As it says on the tin. This module provides a way to render a popover/tooltip style component when text is selected.

[![NPM](https://img.shields.io/npm/v/react-text-selection-popover.svg)](https://www.npmjs.com/package/react-text-selection-popover) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-text-selection-popover
```

## Usage

```jsx
import React, { Component } from 'react'

import Popover from 'react-text-selection-popover'

class Example extends Component {
  state = {
    textSelected: false
  }

  constructor() {
    this.ref = React.createRef()
  }

  render () {
    return (
      <div>
        <p ref={this.ref}>
          Select this text 
        </p>
        <Popover
          onTextSelect={()=> this.setState({ textSelected: true })}
          onTextUnSelect={()=> this.setState({ textSelected: false })}
          selectionRef={this.ref}
        >
          <MyAwesomeComponent />
        </Popover>
      </div>
    )
  }
}
```

## API

### Popover<Props>

| Property | Type | required? | Description |
| - | - | - | - |
| `isOpen` | `Boolean` | optional | Is the Popover visible or not __(defaults to `true`)__ |
| `onTextSelect` | `Function` | optional | Callback for when text is selected (typically used for setting state that opens the modal) |
| `onTextUnSelect` | `Function` | optional | Callback for when selection collapses (typically used for setting state that closes the modal) |
| `className` | `String` | optional | CSS class name for Popover container. |
| `gap` | `Number` | optional | Px gap between text selection and popover - __(defaults to `5`)__ |
| `defaultDirection` | `"above"\|"below"` | optional | Whether to position the popover below or above selection by default - __(defaults to `"above"`) |

## License

MIT © [juliankrispel](https://github.com/juliankrispel)

## Shoutouts

This was originally written during some freelance work for [Spectrum](https://spectrum.chat/). Shoutout to their awesomeness for letting me do all my work for them in the open!
