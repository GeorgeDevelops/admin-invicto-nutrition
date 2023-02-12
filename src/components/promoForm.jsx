import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import http from "./../services/httpService";
import { toast } from "react-toastify";

const PromoForm = ({ handleClose, show }) => {
  const URL = process.env.REACT_APP_API_URL;
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [promoType, setPromoType] = useState(null);

  function handleInputChange({ currentTarget: input }) {
    if (input.name === "name") return setName(input.value);
    if (input.name === "code") return setCode(input.value);
    if (input.name === "discount") return setDiscount(input.value);
    if (input.name === "type") return setPromoType(input.value);
    if (input.name === "start") return setStartDate(input.value);
    if (input.name === "end") return setEndDate(input.value);
  }

  async function createPromo() {
    let url = `${URL}/api/admin/promos/new`;

    let token = localStorage.getItem("token");
    if (!token || token === "") return;
    let headers = { "x-auth-token": token };

    let data = {
      name,
      code,
      discount,
      start: startDate,
      deadline: endDate,
      type: promoType,
    };

    let response = await http.post(url, data, headers);

    if (response.status && response.status === 200) {
      toast.success(response.data, { position: toast.POSITION.TOP_CENTER });
      handleClose();
    }
  }

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Formulario nueva promocion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nombre de promocion"
              autoFocus
              name="name"
              value={name}
              onChange={(e) => handleInputChange(e)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Codigo</Form.Label>
            <Form.Control
              type="text"
              placeholder="Codigo de promocion"
              autoFocus
              name="code"
              value={code}
              onChange={(e) => handleInputChange(e)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Descuento</Form.Label>
            <Form.Control
              type="number"
              placeholder="Porcentaje a descontar"
              autoFocus
              name="discount"
              value={discount}
              onChange={(e) => handleInputChange(e)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Tipo de promocion</Form.Label>
            <Form.Select
              aria-label="Default select example"
              name="type"
              value={promoType}
              onChange={(e) => handleInputChange(e)}
            >
              <option value="una vez">Una sola compra</option>
              <option value="temporal">Temporal</option>
              <option value="indefinido">Tiempo indefinido</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Fecha inicial de la promocion</Form.Label>
            <Form.Control
              type="date"
              placeholder="Codigo"
              autoFocus
              name="start"
              value={startDate}
              onChange={(e) => handleInputChange(e)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Fecha terminal de la promocion</Form.Label>
            <Form.Control
              type="date"
              placeholder="Codigo"
              autoFocus
              name="end"
              value={endDate}
              onChange={(e) => handleInputChange(e)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={createPromo}>
          Crear promocion
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PromoForm;
