import { Link } from "react-router-dom";
import "./todoList.css";
import Topbar from "../../components/topbar/Topbar";
import { useAppContext } from "../../context/appContext";
import { useEffect } from "react";
import moment from "moment";

export default function TodoList() {
  const { allTodos, myTodos } = useAppContext();
  const { data } = myTodos;

  useEffect(() => {
    allTodos();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Topbar />
      <div className="links">
        <Link to="/admin">
          &nbsp;&nbsp;&nbsp;
          <button className="btn">Back</button>
        </Link>
      </div>
      <div className="todoList">
        {data?.todos?.map((todo) => (
          <div key={todo._id} className="todoItem">
            <h4>Title:{todo.title}</h4>
            <p>Message:{todo.message.substring(0, 50)}...</p>
            <p>
              <strong>CreatedAt:</strong>{" "}
              {moment(todo.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
