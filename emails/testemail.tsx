import { Button, Html, Head, Body, Preview } from "react-email";
import * as React from "react";

export default function ResetCodeEmail({code} : {code:string}) {
    return (
        <Html>
            <Preview>This is your code: {code}</Preview>
            <Head />
            <Body>
                <Button href="https://example.com" style={{ background: "#000", color: "#fff", padding: "12px 20px" }}>
                    Click me
                </Button>
            </Body>
        </Html>
    );
}
