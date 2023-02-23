import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import http from "../services/httpService";
import { Spinner } from "react-bootstrap";
import { Form } from "react-bootstrap";

function Orders() {
  const [orders, setOrders] = useState(null);
  const URL = process.env.REACT_APP_API_URL;
  const [filtered, setFiltered] = useState([]);
  const [filter, setFilter] = useState("pendiente");
  const [search, setSearch] = useState("");

  async function getOrders() {
    let url = `${URL}/api/admin/orders`;
    let AUTH_TOKEN = localStorage.getItem("token");

    if (!AUTH_TOKEN || AUTH_TOKEN === "") return;

    let response = await http.get(url, {
      headers: { "x-auth-token": AUTH_TOKEN },
    });

    if (response.status && response.status === 200) {
      setOrders(response.data);
      return;
    }
  }

  function handleChange({ currentTarget: input }) {
    setSearch(input.value);

    let searchResult = [];
    if (!orders) return;
    orders.forEach((order) => {
      let orderId = order.orderId.toLowerCase();
      const match = orderId.match(input.value.toLowerCase());
      if (match) {
        searchResult.push(order);
      }
    });
    setFiltered(searchResult);
  }

  useEffect(() => {
    getOrders();
  }, []);

  useEffect(() => {
    let matches = [];
    if (!orders) return;
    orders.forEach((order) => {
      if (order.status.toLowerCase() === filter) matches.push(order);
    });
    return setFiltered(matches);
  }, [orders, filter]);

  return (
    <div id="orders">
      <header>
        <p>Pedidos</p>
      </header>
      <div>
        <select
          name="filter"
          id="orders_filter"
          onChange={(e) => setFilter(e.currentTarget.value)}
        >
          <option value="pendiente">Pendientes</option>
          <option value="en proceso">En proceso</option>
          <option value="en transito">En transito</option>
          <option value="completado">Completados</option>
          <option value="cancelado">Cancelados</option>
        </select>

        <Form className="d-flex">
          <Form.Control
            type="search"
            placeholder="Search"
            className="me-2"
            aria-label="Search"
            value={search}
            onChange={(e) => handleChange(e)}
          />
        </Form>
      </div>
      {!orders ? (
        <span>
          <Spinner className="m-3" animation="grow" variant="light" />
        </span>
      ) : (
        <Table striped bordered hover variant="light" responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Pedido ID</th>
              <th>Estado</th>
              <th>Total pagado</th>
              <th>Fuente</th>
              <th>Cupon</th>
              <th>Fecha Inicial</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.length < 1 ? (
              <tr>
                <td>No hay pedidos disponibles</td>
              </tr>
            ) : (
              filtered.map((order, idx) => (
                <tr key={order._id}>
                  <td>{idx + 1}</td>
                  <td>{order.orderId}</td>
                  <td>{order.status}</td>
                  <td>${order.total}</td>
                  <td>{order.payment_details.source}</td>
                  <td>{order.promotionId ? "Si" : "No"}</td>
                  <td>{order.date}</td>
                  <td>
                    <Link to={`/pedidos/${order._id}/detalles`}>
                      Ver detalles
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default Orders;
