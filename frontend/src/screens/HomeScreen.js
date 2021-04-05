import React, { useState, useEffect } from "react";
// import products from '../products'
import { Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Product from "../components/Product";
// import axios from 'axios'
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../actions/productActions";
import Paginate from '../components/Paginate'
import ProductCarousel from '../components/ProductCarousal'
// import {helmet} from 'helmet'
import Meta from '../components/Meta'

const HomeScreen = ({match}) => {

  const keyword = match.params.keyword

  const pageNumber = match.params.pageNumber || 1


  // const [products, setProduct] = useState([]);
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { loading, error, productsl, page, pages  } = productList;

  useEffect(() => {
    // const fetchProducts = async () => {
    //     const {data} = await axios.get('/api/products')
    //     setProduct(data)
    // }
    // fetchProducts();

    dispatch(listProducts(keyword, pageNumber));
  }, [dispatch, keyword, pageNumber]);

  return (
    <>
    <Meta />
    {keyword && <> <Button variant="light" className="my-2 p-2">
    <Link to="/">
      <h5>BACK</h5>
    </Link>
  </Button>
  <br />
</>}
    {!keyword && <ProductCarousel />}
      <h1> Latest Products </h1>
     
      <Row>
        {" "}
        {productsl.map((product) => (
          <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
            <Product product={product} />{" "}
          </Col>
        ))}{" "}
      </Row>{" "}
      <Paginate
      pages={pages}
      page={page}
      keyword={keyword ? keyword : ''}
    />
    </>
  );
};

export default HomeScreen;
