import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
// import Message from '../components/Message'
// import Loader from '../components/Loader'
import FormContainer from "../components/FormContainer";
import { login } from "../actions/userActions";
import React from "react";
import { BackgroundColor } from "chalk";

function LoginScreen({ location, history }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  console.log(location)
  const redirect = location.search ? location.search.split("=")[1] : "/";  // we shall come back to this  
  console.log(redirect)
  // console.log(login)
  console.log(history)
  console.log(userInfo)
  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
      console.log(history)
      console.log(location)
    }
  }, [history, userInfo, redirect, location]);

  const submitHandler = (e) => {
    e.preventDefault();
    //DISPATCH LOGIN OF USER
    dispatch(login(email, password));
  }; 

  return (
    <FormContainer>
      <h1>Sign In</h1>
      {error && <h6 style= {{backgroundColor : 'red' , display: 'inline' }}>{error}</h6>}
      <Form onSubmit={submitHandler}>
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

        <Button type="submit" variant="primary">
          Sign In
        </Button>
      </Form>

      <Row className='py-3'>
        <Col>
          New Customer?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
          <h6 style= {{color : 'red' , display: 'inline'}}><u><i>Register</i> </u> </h6>
          </Link>
        </Col>
      </Row>

    </FormContainer>
  );
}

export default LoginScreen;
