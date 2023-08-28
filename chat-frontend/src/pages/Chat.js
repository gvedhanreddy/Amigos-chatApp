import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import MessageForm from "../components/MessageForm";

// To display the Message form and the users available
function Chat() {
    return (
        <Container>
            <Row>
                <Col md={4}>
                    <Sidebar />
                </Col>
                <Col md={8}>
                    <MessageForm />
                </Col>
            </Row>
        </Container>
    );
}

export default Chat;
