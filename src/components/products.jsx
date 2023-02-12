import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { store } from "../app/store";
import { useState, useEffect } from "react";
import { getProducts } from "../features/productSlice";
import http from "../services/httpService";

function Products() {
  const url = process.env.REACT_APP_API_URL;
  const [products, setProducts] = useState(null);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState([]);

  async function setProduct() {
    let response = await http.get(`${url}/api/products`);
    store.dispatch(getProducts(response.data));
    setFiltered(response.data);
    return setProducts(response.data);
  }

  function handleChange({ currentTarget: input }) {
    setSearch(input.value);

    let searchResult = [];
    products.forEach((product) => {
      let name = product.name.toLowerCase();
      const match = name.match(input.value.toLowerCase());
      if (match) {
        searchResult.push(product);
      }
    });
    setFiltered(searchResult);
  }

  useEffect(() => {
    setProduct();
  }, []);

  return (
    <div id="products">
      <header>
        <p>Productos</p>
      </header>
      <div id="productControlBanner">
        <div>
          <Link to="/productos/nuevo">
            <Button variant="primary">
              Nuevo Producto&nbsp;
              <FontAwesomeIcon icon="fa-solid fa-plus" />
            </Button>{" "}
          </Link>
        </div>
        <div>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Buscar producto"
              className="me-2"
              aria-label="Search"
              value={search}
              onChange={(e) => handleChange(e)}
            />
          </Form>
        </div>
      </div>
      {!products ? (
        <span>
          <Spinner className="m-3" animation="grow" variant="light" />
        </span>
      ) : (
        <Table striped bordered hover variant="light">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre del producto</th>
              <th>Marca</th>
              <th>Categoria</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.length < 1 ? (
              <tr>
                <td>No hay productos disponibles</td>
              </tr>
            ) : (
              filtered.map((product, index) => (
                <tr key={product._id}>
                  <td>{index + 1}</td>
                  <td>{product.name}</td>
                  <td>{product.brand.name}</td>
                  <td>{product.category.name}</td>
                  <td>
                    <Link to={`/productos/${product._id}/editar`}>
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

export default Products;
