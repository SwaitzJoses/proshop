import React, { useState, useEffect } from "react";
import { Link  } from "react-router-dom";
import { Form, Button, Row, Col, Table } from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from "react-redux";
// import Message from '../components/Message'
// import Loader from '../components/Loader'
import FormContainer from "../components/FormContainer";
import { getUserDetails, getUpdateUser } from "../actions/userActions";
import { USER_UPDATE_PROFILE_RESET } from "../constance/userConstance";
import {listMyOrders } from "../actions/orderActions";


const ProfileScreen = ({ location, history }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { error, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdate = useSelector((state) => state.userUpdate);
  const { success: successUpdate } = userUpdate;

  const orderListMy = useSelector((state) => state.orderListMy)
  const { loading: loadingOrders, error: errorOrders, orders } = orderListMy

  // const dispatch = useDispatch();
//console.log(userInfo._id)
  //   const redirect = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    } else {
      if (!user || !user.name || successUpdate) {
          // console.log(profile)
          
        dispatch({type : USER_UPDATE_PROFILE_RESET })
       dispatch(getUserDetails("profile")); // check router file , don't forget it.  

        dispatch(listMyOrders())
      } 
      else {
        setName(user.name)
        setEmail(user.email)
      }
    }
  }, [dispatch, history, user, userInfo, successUpdate]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      //   dispatch(register(name, email, password));
    //   dispatch(getUpdateUser(user._id, name, email, password));
    // dispatch(getUpdateUser( { id: user._id, name, email, password }));
    user.name = "Updating";
    user.email = "Updating";
    console.log(user.name)
    dispatch(getUpdateUser(  name, email, password ));
    console.log(name)
    // setName(name);
    }
  };

  return (
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>
        {message && (
          <h6 style={{ backgroundColor: "red", display: "inline" }}> 
            {message}
          </h6>
        )}
        {error && (
          <h6 style={{ backgroundColor: "red", display: "inline" }}>{error}</h6>
        )}

        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary">
            Update
          </Button>
        </Form>
      </Col>

      <Col md={9}>
        <h2> My Orders</h2>
        {loadingOrders ? (<h5>Loading ... </h5>): errorOrders ? (<h5> Error </h5>) : (
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                   <td>{order.createdAt.substring(0,10)}</td> 
                  <td>{order.totalPrice}</td>
                  <td>
                    {order.isPaid ? (
                      <h6>{order.paidAt.substring(0,10)}</h6>
                    ) : (
                      <i className='fas fa-times' style={{ color: 'red' }}></i>
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                     <h6>delivered</h6>
                    ) : (
                      <i className='fas fa-times' style={{ color: 'red' }}></i>
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button className='btn-sm' variant='light'>
                        Details
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
};

export default ProfileScreen;
