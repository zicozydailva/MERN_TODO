import React from "react";
import { Link } from "react-router-dom";

const NotAdmin = () => {
  return (
    <div className="section-center">
      <h1 className="danger">Access Not Allowed!!!</h1>
      <h3>Admin Only!!!</h3>
      <button className="btn">
        <Link to="/">Back Home</Link>
      </button>
    </div>
  );
};

export default NotAdmin;
