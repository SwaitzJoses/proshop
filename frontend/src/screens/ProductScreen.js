import React, { useState, useEffect } from "react";
// import products from "../products";
// import axios from 'axios'
import {
  Button,
  Row,
  Col,
  Image,
  Container,
  ListGroup,
  Form,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "../components/Rating";
import { useDispatch, useSelector } from "react-redux";
import { detailsProduct, createProductReview } from "../actions/productActions";
import { PRODUCT_CREATE_REVIEW_RESET } from "../constance/productConstance";
import Meta from '../components/Meta'

const ProductScreen = ({ history, match }) => {
  const [qty, setQty] = useState(1);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  //// const product = products.find(p => p._id === match.params.i);
  //// console.log(product)

  // const [product, setProduct]= useState([]);

  const dispatch = useDispatch();
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const {
    success: successProductReview,
    loading: loadingProductReview,
    error: errorProductReview,
  } = productReviewCreate;

  useEffect(() => {
    // const fetchProduct = async () => {
    //     const {data} = await axios.get(`/api/products/${match.params.i}`)
    //     setProduct(data)
    // }
    // fetchProduct()\

    if (successProductReview) {
      setRating(0);
      setComment("");
    }

    dispatch(detailsProduct(match.params.e));
    console.log(match);
    console.log(history);
    dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
  }, [dispatch, match, history, successProductReview]);

  const addToCartHandler = () => {
    history.push(`/cart/${match.params.e}?qty=${qty}`); // history - redirect
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      createProductReview(match.params.e, {
        rating,
        comment,
      })
    );
  };

  return (
    <><Meta title={product.name} />
      <Button variant="light" className="my-2 p-2">
        <Link to="/">
          <h5>BACK</h5>
        </Link>
      </Button>
      <br />

      <h2> {product.name}</h2>
      <br />

      <Container>
        <Row>
          <Col xs={6} md={4} lg={6}>
            <Image src={product.image} fluid />
          </Col>
          <Col>
            <h1>{`$${product.price}`}</h1>
            <Row>
              <Col>
                <Rating
                  value={product.rating}
                  text={`${product.reviews.length} reviews`}
                />
              </Col>
            </Row>

            <Row>
              <Col>
                <br />

                <h6 className="my-4">
                  About:
                  <br />
                  {product.description}
                </h6>
              </Col>
            </Row>
          </Col>
          <Col>
            <ListGroup variant="flush">
              <ListGroup.Item>
                Price : $ <strong>{product.price}</strong>
              </ListGroup.Item>
              <ListGroup.Item>
                Status :{" "}
                {product.countInStock > 0 ? "In Stock" : "Out Of Stock"}
              </ListGroup.Item>

              {product.countInStock > 0 && (
                <ListGroup.Item>
                  <Row>
                    <Col>Quantity Available :</Col>

                    <Col>
                      <Form.Control
                        as="select"
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                      >
                        {[...Array(product.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Row>
                </ListGroup.Item>
              )}

              <ListGroup.Item>
                <Button
                  variant="dark"
                  size="lg"
                  disabled={product.countInStock === 0}
                  onClick={addToCartHandler}
                >
                  <h5>ADD TO CART</h5>
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
        <br /> <br />
        <Row>
          <Col md={6}>
            <h5>Reviews</h5>
            {product.reviews.length === 0 && <h6>No Reviews</h6>}
            <ListGroup variant="flush">
              {product.reviews.map((review) => (
                <ListGroup.Item key={review._id}>
                  <strong>{review.name}</strong>
                  <Rating value={review.rating} />

                  <p>{review.comment}</p>
                </ListGroup.Item>
              ))}
              <ListGroup.Item>
                <h6>Write a Customer Review</h6>

                {errorProductReview && (
                  <h5>
                    {errorProductReview} <br />
                    Already Reviewed
                  </h5>
                )}
                {userInfo ? (
                  <Form onSubmit={submitHandler}>
                    <Form.Group controlId="rating">
                      <Form.Label>Rating</Form.Label>
                      <Form.Control
                        as="select"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                      >
                        <option value="">Select...</option>
                        <option value="1">1 - Poor</option>
                        <option value="2">2 - Fair</option>
                        <option value="3">3 - Good</option>
                        <option value="4">4 - Very Good</option>
                        <option value="5">5 - Excellent</option>
                      </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="comment">
                      <Form.Label>Comment</Form.Label>
                      <Form.Control
                        as="textarea"
                        row="3"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      ></Form.Control>
                    </Form.Group>
                    <Button
                      disabled={loadingProductReview}
                      type="submit"
                      variant="primary"
                    >
                      Submit
                    </Button>
                  </Form>
                ) : (
                  <h5>
                    Please <Link to="/login">sign in</Link> to write a review{" "}
                  </h5>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ProductScreen;
