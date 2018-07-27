import React from "react";
import { Editor } from "slate-react";
import { Value } from "slate";
import { Bar } from "./ui";
import Popover from "react-text-selection-popover";

const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: "block",
        type: "paragraph",
        nodes: [
          {
            object: "text",
            leaves: [
              {
                text: "A line of text in a paragraph."
              }
            ]
          }
        ]
      }
    ]
  }
});

// Define our app...
export default class App extends React.Component {
  // Set the initial value when the app is first constructed.
  state = {
    isOpen: false,
    value: initialValue
  };

  constructor(props) {
    super(props)
    this.ref = React.createRef();
  }

  // On change, update the app's React state with the new editor value.
  onChange = ({ value }) => {
    this.setState({ value });
  };

  // Render the editor.
  render() {
    return <div ref={this.ref}>
      <Editor value={this.state.value} onChange={this.onChange} />
      <Popover
        isOpen={this.state.isOpen}
        onTextSelect={() => this.setState({ isOpen: true })}
        onTextUnselect={() => this.setState({ isOpen: false })}
        selectionRef={this.ref}
      >
        <Bar bg="yellow">
          <p>
            And this code is all you really need! <strong>Simples!</strong>
          </p>
        </Bar>
      </Popover>
    </div>
  }
}
