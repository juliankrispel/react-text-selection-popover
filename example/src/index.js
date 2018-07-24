import './index.css';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Main, Bar, Button } from './ui';
import Popover from 'react-text-selection-popover';

class App extends Component {
  state = {
    selected: null,
  }

  constructor(props) {
    super(props);
    this.refParagraph = React.createRef();
    this.refCode = React.createRef();
  }

  render () {
    return <Main>
      <div>
        <p ref={this.refParagraph}>
          So this text should trigger the popover when any of it is selected
        </p>
        <pre ref={this.refCode}>{`<Popover
  isOpen={this.state.isOpen}
  onTextSelect={() => this.setState({isOpen: true})}
  onTextUnselect={() => this.setState({isOpen: false})}
  selectionRef={this.ref}
  defaultDirection="above"
>
  <MakeItalic onPress={this.onMakeItalic}/>
</Popover>`}
        </pre>
        <p>And this block should not</p>
      </div>
      <Popover
        isOpen={this.state.selection === 'paragraph'}
        onTextSelect={() => this.setState({selection: 'paragraph'})}
        onTextUnselect={() => this.setState({selection: null})}
        selectionRef={this.refParagraph}
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

      <Popover
        isOpen={this.state.selection === 'code'}
        onTextSelect={() => this.setState({selection: 'code'})}
        onTextUnselect={() => this.setState({selection: null})}
        selectionRef={this.refCode}
        defaultDirection="above"
      >
        <Bar bg="yellow">
          <h1>Simples</h1>
        </Bar>
      </Popover>
    </Main>;
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
