import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  return (
    <div className="container text-center" style={{ paddingTop: "5rem" }}>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link to="/" className="button button-primary">
        Go to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
