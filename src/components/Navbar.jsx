import { Link, NavLink } from "react-router-dom";

function Navbar({ user }) {
  const isAdmin = user?.role_id === 1;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        {/* 🧭 Smart brand link */}
        <Link
          className="navbar-brand fw-bold"
          to={user ? "/equipment" : "/"}
        >
          PE Equipment
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {/* 🧩 Only show menu items if logged in */}
          {user && (
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item">
                <NavLink to="/equipment" className="nav-link">
                  Equipment
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink to="/profile" className="nav-link">
                  Profile
                </NavLink>
              </li>

              {/* 👑 Admin dropdown */}
              {isAdmin && (
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="adminDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Admin
                  </a>
                  <ul
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="adminDropdown"
                  >
                    <li>
                      <NavLink className="dropdown-item" to="/approve-users">
                        Approve Users
                      </NavLink>
                    </li>
                    <li>
                      <NavLink className="dropdown-item" to="/add-equipment">
                        Add Equipment
                      </NavLink>
                    </li>
                    <li>
                      <NavLink className="dropdown-item" to="/manage-roles">
                        Manage Roles
                      </NavLink>
                    </li>
                  </ul>
                </li>
              )}

              <li className="nav-item">
                <NavLink to="/logout" className="nav-link text-danger">
                  Logout
                </NavLink>
              </li>
            </ul>
          )}

          {/* 🧑‍💻 If not logged in */}
          {!user && (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink to="/" className="nav-link">
                  Login / Register
                </NavLink>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
