import { NavLink, useNavigate } from 'react-router-dom';
import './Header.css';
import { useContext } from 'react';
import AuthContext from '../../auth/auth/AuthContext';
import useUsername from '../../../hooks/use-username';

export default function Header() {

    const auth = useContext(AuthContext);
    const jwt = auth?.jwt;
    const role = auth?.role;
    const navigate = useNavigate();

    function logout() {
        auth?.newJwt('');
        navigate("/auth/login");
    }

    const username = useUsername()

    return (
        <div className='Header'>
            <div className="Sunny">Sunny</div>

            <nav>
                {jwt && role === "admin" && (
                    <>
                        <NavLink to="/admin" end>Dashboard</NavLink>
                        {" | "}
                        <NavLink to="/admin/add">Add Vacation</NavLink>
                        {" | "}
                        <NavLink to="/admin/reports">Reports</NavLink>
                    </>
                )}

                {jwt && role === "user" && (
                    <NavLink to="/vacations" end>Vacations</NavLink>
                )}
            </nav>

            <div>
                {jwt ? (
                    <>
                        welcome {username} | <button onClick={logout}>logout</button>
                    </>
                ) : (
                    <>
                        <NavLink to="/auth/login">sign in</NavLink>
                        {" | "}
                        <NavLink to="/auth/signup">sign up</NavLink>
                    </>
                )}
            </div>
        </div>
    );
}
