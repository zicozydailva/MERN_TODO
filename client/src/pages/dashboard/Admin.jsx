import React from "react";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import { Link } from "react-router-dom";

const Admin = () => {
  return (
    <>
      <header>
        <Topbar />
        {/* <Sidebar /> */}
        <section className="links">
          <Link to="/users">
            <button className="btn">All Users</button>
          </Link>&nbsp; &nbsp;
          <Link to="/todos">
            <button className="btn">All Tasks</button>
          </Link>
          <Link to="/"> &nbsp; &nbsp;
            <button className="btn">Back Home</button>
          </Link>
        </section>
      </header>
    </>
  );
};

export default Admin;
