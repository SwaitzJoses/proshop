import React from "react";
import { Card } from "react-bootstrap";
import Rating from './Rating';
import { Link } from 'react-router-dom';

const Product = ({ product }) => {
  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant="top" />
        <Card.Body>
          <Card.Title as="div">
            <strong style={{fontWeight: "bold"}}>{product.name}</strong>
          </Card.Title>
        </Card.Body>
      </Link>
     
        <Card.Text as="div">
         <Rating value={product.rating} text={`${product.reviews.length} reviews`}/>
        </Card.Text>
        <Card.Text as="h3">${product.price}</Card.Text>
     
    </Card>
    // <div>
    // <Link to={`/product/${product.name}`}>A</Link></div>
  );
};

export default Product;
