import * as React from "react";
import { Form, InputGroup } from "react-bootstrap";

export interface SelectInputProps {
  label: string;
  options: string[];
  selectedOption: string;
  onOptionChanged: (value: string) => void;
  appendComponent?: JSX.Element;
}

export class SelectInput extends React.Component<SelectInputProps> {
  public render(): JSX.Element {
    return (
      <InputGroup>
        <InputGroup.Prepend>
          <InputGroup.Text>{this.props.label}</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control
          as="select"
          onChange={this.onOptionChanged}
          value={this.props.selectedOption}
        >
          {this.props.options.map((name, i) => (
            <option key={i}>{name}</option>
          ))}
        </Form.Control>
        {this.props.appendComponent && (
          <InputGroup.Append>{this.props.appendComponent}</InputGroup.Append>
        )}
      </InputGroup>
    );
  }

  // tslint:disable-next-line:no-any
  private onOptionChanged = (event: any): void => {
    const selectedValue = event.target.value;
    this.props.onOptionChanged(selectedValue);
  };
}
