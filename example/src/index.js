import "./index.css";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Main, Bar, Button } from "./ui";
import Popover from "react-text-selection-popover";
import placeRightBelow from "react-text-selection-popover/lib/placeRightBelow";

class App extends Component {
  state = {
    selected: null
  };

  constructor(props) {
    super(props);
    this.refParagraph = React.createRef();
    this.refCode = React.createRef();
  }

  render() {
    return (
      <Main>
        <div>
          <p ref={this.refParagraph}>
            Selecting this text triggers the popover!
          </p>
          <pre ref={this.refCode}>
            {`<Popover
  isOpen={this.state.isOpen}
  onTextSelect={() => this.setState({isOpen: true})}
  onTextUnselect={() => this.setState({isOpen: false})}
  selectionRef={this.ref}
  defaultDirection="above"
>
  <MakeItalic onPress={this.onMakeItalic}/>
</Popover>`}
          </pre>
        </div>
        <Popover
          isOpen={this.state.selection === "paragraph"}
          onTextSelect={() => this.setState({ selection: "paragraph" })}
          onTextUnselect={() => this.setState({ selection: null })}
          selectionRef={this.refParagraph}
        >
          <Bar>
            <Button bg="#5595ff" onClick={() => alert("Boing")}>
              Click me
            </Button>
            <Button bg="#e257b5" onClick={() => alert("Bang")}>
              Or me
            </Button>
            <Button bg="#ffa935" onClick={() => alert("Boom")}>
              Or me
            </Button>
          </Bar>
        </Popover>
        <Popover
          selectionRef={this.refCode}
          placementStrategy={placeRightBelow}
        >
          <Bar bg="yellow">
            <p>
              And this code is all you really need! <strong>Simples!</strong>
            </p>
          </Bar>
        </Popover>
      </Main>
    );
  }
}


ReactDOM.render(<App />, document.getElementById("root"));
