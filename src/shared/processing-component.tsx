import * as React from "react";
import { Col, Container, Row } from "react-bootstrap";

import {
  ProcessingService,
  ProcessingSketch,
} from "../services/processing.service";
import { getStrings, LocalizedStrings } from "../strings";

const PROCESSING_CONTAINER_ID = "processingContainer";

export abstract class ProcessingComponent<
  T extends ProcessingSketch,
  S = {}
> extends React.Component<{}, S> {
  protected readonly sketch: T = this.createSketch();
  protected readonly strings: LocalizedStrings = getStrings();
  private readonly processingService = new ProcessingService();

  public componentDidMount(): void {
    this.processingService.sketch(this.sketch, PROCESSING_CONTAINER_ID);
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
            <div id={PROCESSING_CONTAINER_ID} />
          </Col>
          <Col sm={3}>
            {this.renderCommands()}
            {this.renderInfoSection()}
          </Col>
        </Row>
      </Container>
    );
  }

  protected abstract createSketch(): T;

  protected abstract renderCommands(): JSX.Element;

  protected abstract renderInfoSection(): JSX.Element;

  // protected abstract renderToolBar?(): JSX.Element;
}
