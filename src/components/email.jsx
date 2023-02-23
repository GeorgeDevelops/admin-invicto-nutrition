import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import http from "../services/httpService";
import { toast } from "react-toastify";
import Spinner from "react-bootstrap/Spinner";

const Email = (props) => {
  const URL = process.env.REACT_APP_API_URL;
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(null);

  function handleInputChange({ currentTarget: input }) {
    if (input.name === "email") return setEmail(input.value);
    if (input.name === "subject") return setSubject(input.value);
    if (input.name === "name") return setName(input.value);
    if (input.name === "content") return setContent(input.value);
  }

  async function sendEmail() {
    setSending(true);
    let url = `${URL}/api/admin/email/send`;
    let AUTH_TOKEN = localStorage.getItem("token");

    if (!AUTH_TOKEN || AUTH_TOKEN === "") return;

    let headers = { "x-auth-token": AUTH_TOKEN };

    let data = { email, subject, name, content };

    let response = await http.post(url, data, headers);

    if (response.status && response.status === 200) {
      toast.success(response.data, { position: toast.POSITION.TOP_CENTER });
      setSending(null);
      setEmail("");
      setSubject("");
      setName("");
      setContent("");
    }
  }

  return (
    <React.Fragment>
      <div id="email">
        <header>
          <p>Correo</p>
        </header>
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Correo electronico</Form.Label>
            <Form.Control
              type="email"
              placeholder="name@example.com"
              name="email"
              value={email}
              onChange={(e) => handleInputChange(e)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Tema</Form.Label>
            <Form.Control
              type="email"
              placeholder="Tema"
              name="subject"
              value={subject}
              onChange={(e) => handleInputChange(e)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="email"
              placeholder="Nombre"
              name="name"
              value={name}
              onChange={(e) => handleInputChange(e)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Contenido</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Contenido"
              name="content"
              value={content}
              onChange={(e) => handleInputChange(e)}
              rows={3}
            />
          </Form.Group>

          <Button variant="primary" onClick={sendEmail}>
            {sending ? (
              <>
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                &nbsp;Enviando...
              </>
            ) : (
              "Enviar"
            )}
          </Button>
        </Form>
      </div>
    </React.Fragment>
  );
};

export default Email;
