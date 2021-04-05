import { Link } from "react-router-dom";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { getOrderDetails, payOrder, deliverOrder } from "../actions/orderActions";
import { useState, useEffect } from "react";

import axios from "axios";

import {PayPalButton} from  "react-paypal-button-v2"
import {
  ORDER_PAY_RESET, ORDER_DELIVER_RESET
  
} from '../constance/orderConstance'

const OrderScreen = ({ match }) => {
  const orderId = match.params.id;

  const[sdkReady, setSdkReady] = useState(false)

  const dispatch = useDispatch();

  const orderDetails = useSelector((state) => state.orderDetails); // it can be defined anywhere
  const { order, loading, error } = orderDetails; // ************************************************************************************************

  const orderPay = useSelector((state) => state.orderPay)
  const { loading: loadingPay, success: successPay } = orderPay

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin


  const orderDeliver = useSelector((state) => state.orderDeliver)
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver
  
  useEffect(() => {
      const addPaypalScript = async ()=>{
      const {data:clientId} = await axios.get('/api/config/paypal')
      console.log(clientId)
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.scr = `https://www.paypal.com/sdk/js?client-id=${clientId}`
      script.async = true
      script.onload = () => {
        setSdkReady(true)
      }
      document.body.appendChild(script)
    
     // <script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID"></script>
    }


    if (!order || successPay || order._id !== orderId || successDeliver) {
      dispatch({ type: ORDER_PAY_RESET })
      dispatch({ type: ORDER_DELIVER_RESET })
      dispatch(getOrderDetails(orderId))
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPaypalScript()
      } 
      else {
        setSdkReady(true)
      }
    }
  }, [dispatch, orderId, successPay, order, successDeliver])

  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult)
    dispatch(payOrder(orderId, paymentResult))
    // setSdkReady(false)
    // dispatch({ type: ORDER_PAY_RESET })
  }


  const deliverHandler = () =>{
    dispatch(deliverOrder(orderId))
  }



  return loading ? (
    <h1> Loading ... </h1>
  ) : error ? (
    <h1> {error} </h1>
  ) : (
    <>
      <h1> Order : {order._id}</h1>

      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name:</strong>
                {order.user.name}
              </p>
              <p>
                <a href={`mailto:${order.user.email}`}>
                  <strong>Email:</strong>
                  {order.user.email}
                </a>
              </p>
              <p>
                <strong>Address:</strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>

              {order.isDelivered ? (
                <h6
                  style={{
                    backgroundColor: "green",
                    display: "inline",
                    color: "white",
                  }}
                >
                  {" "}
                  Delivered On {order.deliveredAt}
                </h6>
              ) : (
                <h6
                  style={{
                    backgroundColor: "red",
                    display: "inline",
                    color: "white",
                  }}
                >
                  {" "}
                  Not Delivered{" "}
                </h6>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <p>
                <h2>Payment Method</h2>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>

              {order.isPaid ? (
                <h6
                  style={{
                    backgroundColor: "green",
                    display: "inline",
                    color: "white",
                  }}
                >
                  {" "}
                  {order.paidAt}
                </h6>
              ) : (
                <h6
                  style={{
                    backgroundColor: "red",
                    display: "inline",
                    color: "white",
                  }}
                >
                  {" "}
                  Not Paid{" "}
                </h6>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <h6 style={{ backgroundColor: "red", display: "inline" }}>
                  Your order is empty
                </h6>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {loadingPay && <h6> Loading ... </h6>}
                  {order.isPaid ? (
                    <h6 style={{
                      backgroundColor: "green",
                      display: "inline",
                      color: "white",
                    }}> <center > Paid</center></h6>
                  ) : (
                    <PayPalButton
                      amount={order.totalPrice}
                      onSuccess={successPaymentHandler}
                    />
                  )}

                  {userInfo &&
                    userInfo.isAdmin &&
                    order.isPaid &&
                    !order.isDelivered && (
                      <ListGroup.Item>
                        <Button
                          type='button'
                          className='btn btn-block'
                          onClick={deliverHandler}
                        >
                          Mark As Delivered
                        </Button>
                      </ListGroup.Item>
                    )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
