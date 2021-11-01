import * as React from "react";
import { Col, Container, Row } from "react-bootstrap";

import {
  ProcessingService,
  ProcessingSketch,
} from "../services/processing.service";
import { getStrings, LocalizedStrings } from "../strings";
import { newGuid } from "../utils/guid";

const PROCESSING_CONTAINER_ID_FORMAT = "processing-container-";

export abstract class ProcessingComponent<
  T extends ProcessingSketch,
  S = {},
  P = {}
> extends React.Component<P, S> {
  protected sketch: T;
  protected readonly strings: LocalizedStrings = getStrings();

  protected abstract createSketch: () => T;
  private readonly processingService = new ProcessingService();
  private readonly processingContainerId: string = PROCESSING_CONTAINER_ID_FORMAT + newGuid();

  public componentDidMount(): void {
    this.sketch = this.createSketch();
    this.processingService.sketch(this.sketch, this.processingContainerId);
  }

  public componentWillUnmount(): void {
    this.processingService.remove();
  }

  public render(): JSX.Element {
    return (
      <Container style={{ maxWidth: 1300 }}>
        {/* {this.renderToolBar && (
          <Row>
            <Col sm={12}>{this.renderToolBar()}</Col>
          </Row>
        )} */}
        <Row>
          <Col sm={9}>
            <div id={this.processingContainerId} />
          </Col>
          <Col sm={3}>
            {this.renderCommands()}
            {this.renderInfoSection()}
          </Col>
        </Row>
      </Container>
    );
  }

  protected abstract renderCommands(): JSX.Element;

  protected abstract renderInfoSection(): JSX.Element;

  // protected abstract renderToolBar?(): JSX.Element;
}
