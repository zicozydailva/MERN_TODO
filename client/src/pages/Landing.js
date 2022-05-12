import main from "../assets/images/todo.svg";
import Wrapper from "../assets/wrappers/LandingPage";
import { Link } from "react-router-dom";
const Landing = () => {
  return (
    <Wrapper>
      <nav>
      </nav>
      <div className="container page">
        {/* info */}
        <div className="info">
          <h1>
            Task <span>tracking</span> app
          </h1>
          <p>
            You list everything that you have to do, with the most important
            tasks at the top of the list, and the least important tasks at the
            bottom. By keeping such a list, you make sure that your tasks are
            written down all in one place so you don't forget anything
            important.
          </p>
          <Link to="/register" className="btn btn-hero">
            Login/Register
          </Link>
        </div>
        <img src={main} alt="todo hunt" className="img main-img" />
      </div>
    </Wrapper>
  );
};

export default Landing;
