import React, { useState, useEffect } from "react";
import http from "../services/httpService";
import { Spinner } from "react-bootstrap";

const Home = (props) => {
  const URL = process.env.REACT_APP_API_URL;
  const [products, setProducts] = useState(null);
  const [orders, setOrders] = useState(null);
  const [pendingOrders, setPendingOrders] = useState(null);
  const [completedOrders, setCompletedOrders] = useState(null);
  const [customers, setCustomers] = useState(null);

  async function getProducts() {
    return new Promise(async (resolve, reject) => {
      let url = `${URL}/api/products`;
      let response = await http.get(url);

      if (response.status && response.status === 200) {
        setProducts(response.data);
        resolve(response.data);
      }
    });
  }

  async function getOrders() {
    return new Promise(async (resolve, reject) => {
      let url = `${URL}/api/admin/orders`;
      let token = localStorage.getItem("token");

      let response = await http.get(url, {
        headers: { "x-auth-token": token },
      });

      if (response.status && response.status === 200) {
        setOrders(response.data);
        resolve(response.data);
      }
    });
  }

  async function getPendingOrders(status) {
    return new Promise(async (resolve, reject) => {
      let token = localStorage.getItem("token");

      let response = await http.get(
        `${URL}/api/admin/orders/${status}/filter`,
        {
          headers: { "x-auth-token": token },
        }
      );

      if (response.status && response.status === 200) {
        setPendingOrders(response.data);
        resolve(response.data);
      }
    });
  }

  async function getCompletedOrders(status) {
    return new Promise(async (resolve, reject) => {
      let token = localStorage.getItem("token");

      let response = await http.get(
        `${URL}/api/admin/orders/${status}/filter`,
        {
          headers: { "x-auth-token": token },
        }
      );

      if (response.status && response.status === 200) {
        setCompletedOrders(response.data);
        resolve(response.data);
      }
    });
  }

  async function getCustomers() {
    return new Promise(async (resolve, reject) => {
      let url = `${URL}/api/admin/customers`;
      let token = localStorage.getItem("token");

      let response = await http.get(url, {
        headers: { "x-auth-token": token },
      });

      if (response.status && response.status === 200) {
        resolve(response.data);
      }
    });
  }

  async function execute() {
    let data = await getCustomers();
    setCustomers(data.customers);
    await getProducts();
    await getOrders();
    await getPendingOrders("pendiente");
    await getCompletedOrders("completado");
  }

  useEffect(() => {
    execute();
  }, []);

  return (
    <React.Fragment>
      <div id="home">
        <div className="home-header">
          <p>Bienvenido al sistema de administracion</p>
        </div>
        <div className="meta-data-wrap">
          <div>
            <span className="meta-data-num">
              {!customers ? <Spinner /> : customers.length}
            </span>
            <p className="meta-data-title">Clientes</p>
          </div>
          <div>
            <span className="meta-data-num">
              {!products ? <Spinner /> : products.length}
            </span>
            <p className="meta-data-title">Productos</p>
          </div>
          <div>
            <span className="meta-data-num">
              {!orders ? <Spinner /> : orders.length}
            </span>
            <p className="meta-data-title">Pedidos</p>
          </div>
          <div>
            <span className="meta-data-num">
              {!pendingOrders ? <Spinner /> : pendingOrders.length}
            </span>
            <p className="meta-data-title">Pedidos pendientes</p>
          </div>
          <div>
            <span className="meta-data-num">
              {!completedOrders ? <Spinner /> : completedOrders.length}
            </span>
            <p className="meta-data-title">Pedidos completados</p>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Home;
