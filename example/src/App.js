import React, { Component } from 'react';

import Popover from 'react-text-selection-popover';

export default class App extends Component {
  state = {
    hasSelection: false,
  }

  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  render () {
    return <div>
      <div ref={this.ref}>
        <p>Hello friend this should be selected</p>
        <p>Hello friend this should be selected</p>
        <p>Hello friend this should be selected</p>
        <p>Hello friend this should be selected</p>
        <p>Hello friend this should be selected</p>
      </div>
      <div>
        <p>And this should not</p>
      </div>
      <Popover
        onTextSelect={() => this.setState({ hasSelection: true })}
        onTextUnselect={() => this.setState({ hasSelection: false })}
        isOpen={this.state.hasSelection}
        selectionRef={this.ref}
        defaultDirection="above"
      >
        Hello
      </Popover>
    </div>
  }
}
