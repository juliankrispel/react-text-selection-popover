import React, { Component } from 'react';
import styled from 'styled-components';

import Popover from 'react-text-selection-popover';

const Bar = styled.div`
  background: #000;
  border-radius: 3px;
  color: #fff;
  width: 400px;
  padding: 1em;
`;

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
        isOpen
        selectionRef={this.ref}
        defaultDirection="above"
      >
        <Bar>Hello</Bar>
      </Popover>
    </div>;
  }
}
