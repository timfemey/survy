import { Link } from "react-router-dom";
import "./App.css";

function Header() {
  return (
    <>
      <header className="header">
        <h2>Survy</h2>
        <div>
          <Link className="links" to="/">
            Home
          </Link>
          {/* Design Header */}

          <Link className="links" to="/polls">
            Create Polls
          </Link>
        </div>
      </header>
    </>
  );
}

export default Header;
