import React, { Component } from 'react';
import styled from 'styled-components';

import Popover from 'react-text-selection-popover';

const Bar = styled.div`
  background: #fff;
  border-radius: 3px;
  overflow: hidden;
  transition: 300ms;
  display: flex;
  user-select: none;
`;

const Button = styled.button`
  padding: 1em;
  cursor: pointer;
  color: #fff;
  font-size: inherit;
  text-transform: uppercase;
  outline: none;
  font-weight: bold;
  transition: 300ms;
  transform: scale(1);
  &:hover{
    transform: scale(1.15);
  }
  border: none;
  background: ${props => props.bg};
`

const Main = styled.main`
  background: #000;
  padding: 2em;
  line-height: 1.5em;
  font-size: 1.3em;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: #fff;
`;

const Wrapper = styled.div`
`


export default class App extends Component {
  state = {
    hasSelection: false,
  }

  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  render () {
    return <Main>
      <Wrapper>
        <div ref={this.ref}>
          <p>So this text should trigger the popover when any of it is selected</p>
        </div>
        <div>
          <p>And this block should not</p>
        </div>
      </Wrapper>
      <Popover
        isOpen={this.state.hasSelection}
        onTextSelect={() => this.setState({hasSelection: true})}
        onTextUnselect={() => this.setState({hasSelection: false})}
        selectionRef={this.ref}
        defaultDirection="above"
      >
        <Bar>
          <Button
            bg="#5595ff"
            onClick={() => alert('Boing')}
          >
            Click me
          </Button>
          <Button
            bg="#e257b5"
            onClick={() => alert('Bang')}
          >
            Or me
          </Button>
          <Button
            bg="#ffa935"
            onClick={() => alert('Boom')}
          >
            Or me
          </Button>
        </Bar>
      </Popover>
    </Main>;
  }
}
