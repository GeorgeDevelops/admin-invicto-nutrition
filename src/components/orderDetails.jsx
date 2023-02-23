import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import http from "../services/httpService";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

function OrderDetails() {
  const { id } = useParams();
  const URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [phone, setPhone] = useState(null);
  const [email, setEmail] = useState(null);
  const [street, setStreet] = useState(null);
  const [sector, setSector] = useState(null);
  const [city, setCity] = useState(null);
  const [content, setContent] = useState(null);
  const [status, setStatus] = useState(null);
  const [newStatus, setNewStatus] = useState(null);
  const [date, setDate] = useState(null);
  const [showSpinner, setShowSpinner] = useState(null);
  const [paymentSource, setPaymentSource] = useState(null);
  const [promotion, setPromotion] = useState(null);
  const [promoId, setPromoId] = useState(null);

  async function getPromo() {
    console.log("called");
    let AUTH_TOKEN = localStorage.getItem("token");
    let headers = { headers: { "x-auth-token": AUTH_TOKEN } };

    let response = await http.get(`${URL}/api/admin/promos`, headers);

    if (response.status && response.status === 200) {
      response.data.forEach((promo) => {
        if (promo._id === promoId) {
          setPromotion(promo);
          return;
        }
      });
    }
  }

  async function updateOrder() {
    let data = { status: newStatus };

    let AUTH_TOKEN = localStorage.getItem("token");
    if (!AUTH_TOKEN || AUTH_TOKEN === "") return;

    let headers = { "x-auth-token": AUTH_TOKEN };
    let url = `${URL}/api/admin/orders/${id}/update`;

    let confirmed = window.confirm(
      "Seguro desea actualizar el estado de este pedido?"
    );

    if (!confirmed) return;

    setShowSpinner(true);

    let response = await http.put(url, data, headers);

    if (response.status && response.status === 200) {
      setShowSpinner(null);
      toast.success(response.data, { position: toast.POSITION.TOP_CENTER });
      navigate("/pedidos");
    }

    setShowSpinner(null);
  }

  async function getOrderOwner(customerId) {
    let AUTH_TOKEN = localStorage.getItem("token");
    let headers = {
      headers: { "x-auth-token": AUTH_TOKEN },
    };
    let url = `${URL}/api/users/${customerId}`;

    let response = await http.get(url, headers);

    if (response.status && response.status === 200) {
      let { first_name, last_name, phone, email, address } = response.data;
      setFirstName(first_name);
      setLastName(last_name);
      setPhone(phone);
      setEmail(email);
      setStreet(address.street);
      setCity(address.city);
      setSector(address.sector);
    }
  }

  function handleSelectChange({ currentTarget: input }) {
    setNewStatus(input.value);
  }

  async function getOrder() {
    let AUTH_TOKEN = localStorage.getItem("token");
    let url = `${URL}/api/admin/orders/${id}/single`;
    let response = await http.get(url, {
      headers: { "x-auth-token": AUTH_TOKEN },
    });

    if (response.status && response.status === 200) {
      console.log(response.data);
      getOrderOwner(response.data.customerId);
      setContent(response.data.content);
      setStatus(response.data.status);
      setDate(response.data.date);
      setPromoId(response.data.promotionId);
      setPaymentSource(response.data.payment_details);
      return;
    }
  }

  useEffect(() => {
    getOrder();
  }, [id]);

  useEffect(() => {
    if (!promoId) return;

    getPromo();
  }, [promoId]);

  return (
    <div id="product-details">
      <h2>Detalles de pedido</h2>&nbsp;
      <Form>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridName">
            <Form.Label>Nombre del cliente</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nombre del cliente"
              value={`${firstName && firstName} ${lastName && lastName}`}
              readOnly
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridPhone">
            <Form.Label>Telefono</Form.Label>
            <Form.Control
              type="text"
              placeholder="Telefono"
              value={phone}
              readOnly
            />
          </Form.Group>
        </Row>

        <Form.Group className="mb-3" controlId="formGridEmail">
          <Form.Label>Correo electronico</Form.Label>
          <Form.Control
            type="email"
            placeholder="name@example.com"
            value={email}
            readOnly
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formGridAddress">
          <Form.Label>Direccion</Form.Label>
          <Form.Control
            type="text"
            placeholder="2121 calle principal"
            value={street}
            readOnly
          />
        </Form.Group>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridCity">
            <Form.Label>Ciudad</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ciudad"
              value={city}
              readOnly
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridSector">
            <Form.Label>Sector</Form.Label>
            <Form.Control
              type="text"
              placeholder="Sector"
              value={sector}
              readOnly
            />
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridPaymentSource">
            <Form.Label>Fuente de Pago</Form.Label>
            <Form.Control
              type="text"
              placeholder="Fuente de pago"
              value={!paymentSource ? "N/A" : paymentSource.source}
              readOnly
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridPromotion">
            <Form.Label>Promocion</Form.Label>
            <Form.Control
              type="text"
              placeholder="Promocion"
              value={!promotion ? "N/A" : promotion.code}
              readOnly
            />
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridDate">
            <Form.Label>Fecha</Form.Label>
            <Form.Control
              type="text"
              placeholder="Fecha"
              value={date && date}
              readOnly
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridStatus">
            <Form.Label>Estado actual</Form.Label>
            <Form.Select
              disabled={
                status === "cancelado" || status === "completado" ? true : null
              }
              onChange={(e) => handleSelectChange(e)}
              value={newStatus && newStatus}
            >
              <option value="pendiente">Pendiente</option>
              <option value="en proceso">En proceso</option>
              <option value="en transito">En transito</option>
              <option value="completado">Completado</option>
              <option value="cancelado">Cancelado</option>
            </Form.Select>
          </Form.Group>
        </Row>
      </Form>
      <br />
      <Table striped bordered hover variant="light">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre del producto</th>
            <th>Marca</th>
            <th>Cantidad</th>
            <th>Sabor</th>
            <th>Peso</th>
          </tr>
        </thead>
        <tbody>
          {!content ? (
            <>
              <Spinner />
            </>
          ) : (
            content.map((product, idx) => (
              <tr key={idx + 1}>
                <td>{idx + 1}</td>
                <td>{product.product.name}</td>
                <td>{product.product.brand.name}</td>
                <td>{product.quantity}</td>
                <td>{product.flavor}</td>
                <td>{`${product.weight.weight} ${product.weight.measure}`}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
      <br />
      <div className="orderStatus">
        <Stack gap={2} className="col-md-5 mx-auto">
          <Button
            variant="secondary"
            onClick={updateOrder}
            disabled={
              status === "cancelado" || status === "completado" ? true : null
            }
          >
            Guardar cambios&nbsp;&nbsp;
            {showSpinner && <Spinner />}
          </Button>
          <Button
            variant="outline-secondary"
            onClick={() => navigate("/pedidos")}
          >
            Cancelar
          </Button>
        </Stack>
      </div>
      <br />
      <br />
    </div>
  );
}

export default OrderDetails;
