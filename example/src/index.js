import "./index.css";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Main, Bar } from "./ui";
import Popover from "react-text-selection-popover";
import Draggable from "react-draggable";

class App extends Component {
  state = {
    selected: null
  };

  constructor(props) {
    super(props);
    this.refParagraph = React.createRef();
    this.refCode = React.createRef();
  }

  onChangeText = (e) => {
    console.log(e.target);
  }

  render() {
    return (
      <Main>
        <Draggable
          handle=".handle"
          defaultPosition={{x: 0, y: 0}}
          position={null}
        >
          <div>
            <button className="handle">drag</button>
            <div
              ref={this.refParagraph}
              contentEditable
              suppressContentEditableWarning
              onInput={this.onChangeText}
            >
              Selecting this text triggers the popover!
            </div>
            <Popover selectionRef={this.refParagraph}>
              <Bar bg="yellow">
                <p>
                  And this code is all you really need! <strong>Simples!</strong>
                </p>
              </Bar>
            </Popover>
          </div>
        </Draggable>
      </Main>
    );
  }
}


ReactDOM.render(<App />, document.getElementById("root"));
