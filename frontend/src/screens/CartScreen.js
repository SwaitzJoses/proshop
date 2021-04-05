import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from "react-bootstrap";
// import Message from '../components/Message'
import { addToCart, removeFromCart } from "../actions/cartActions";


const CartScreen = ({ match, location, history }) => {
  const productId = match.params.i;

  const qty = location.search ? Number(location.search.split("=")[1]) : 1;

  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart1);
  const { cartItems2 } = cart;
  console.log(cartItems2);

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty));

     


    }
  }, [dispatch, productId, qty]);




  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

console.log( history.push)
// console.log(login)
  const checkoutHandler = () => {
    console.log("checkout");
    history.push("/login?redirect=shipping");
  };

  return (
    <Row>
      <Col md={8}>
        <h1>Shopping Cart</h1>
        {cartItems2.length === 0 ? (
          <h3>
            Your cart is empty{" "}
            <Link to="/">
              <Button>Go</Button>
            </Link>{" "}
          </h3>
        ) : (
          <ListGroup variant="flush">
            {cartItems2.map((item) => (
              <ListGroup.Item key={item.product}>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>${item.price}</Col>
                  <Col md={2}>
                    <Form.Control
                      as="select"
                      value={item.qty}
                      onChange={(e) =>
                        dispatch(
                          addToCart(item.product, Number(e.target.value))
                        )
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>

                  <Col md={2}>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => removeFromCartHandler(item.product)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>{" "}
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup>
            <ListGroup.Item>
              <h3>
                SUBTOTAL ({cartItems2.reduce((acc, item) => acc + item.qty, 0)})
              </h3>
              <h4>
                $
                {cartItems2
                  .reduce((acc, item) => acc + item.qty * item.price, 0)
                  .toFixed(2)}
              </h4>
            </ListGroup.Item>

            <ListGroup.Item>
              <Button
                type="button"
                className="btn-block"
                disabled={cartItems2.length === 0}
                onClick={() => checkoutHandler()}
              >
                CHECKOUT
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;
