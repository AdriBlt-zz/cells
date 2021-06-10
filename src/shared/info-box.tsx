import * as React from "react";
import { Alert } from "react-bootstrap";
export interface InfoBoxProps {
    title?: string;
    text: string;
}

export function InfoBox(props: InfoBoxProps): JSX.Element {
    return (
        <Alert variant="secondary" style={{ marginTop: 10, fontSize: 14 }}>
            {props.title && (<Alert.Heading style={{ fontSize: 14, fontWeight: 'bold' }}>{props.title}</Alert.Heading>)}
            {props.text}
        </Alert>
    );
}
