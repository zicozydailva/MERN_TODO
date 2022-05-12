import { Link } from "react-router-dom";
import "./userList.css";
import Topbar from "../../components/topbar/Topbar";
import axios from "axios";
import { useEffect } from "react";
import { useAppContext } from "../../context/appContext";
import moment from "moment";

export default function UserList() {
  const { myUsers, getUsers } = useAppContext();
  const { data } = myUsers;
  console.log(data);
  useEffect(() => {
    getUsers();
  }, []);
  return (
    <>
      <Topbar />
      <div className="userList">
        <h2>All Current Users</h2>
        <div className="userWrapper">
          {data?.users.map((user) => (
            <div className="usersContainer" key={user.email}>
              <h4>
                <strong>Name:</strong> {user.name}
              </h4>
              <h5>
                <strong>Email:</strong>
                {user.email}
              </h5>
              <h5>
                <strong>CreatedAt:</strong> {moment(user.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
              </h5>
            </div>
          ))}
        </div>
        &nbsp; &nbsp;
        <Link to="/admin">
          <button className="btn">Back Home</button>
        </Link>
      </div>
    </>
  );
}
