import React, {useContext} from "react";
import {NavLink} from "react-router-dom";

import './MainNavigation.css';
import {AuthContext} from '../../context/auth-context';

const MainNavigation = () => {
    const {logout} = useContext(AuthContext);

    return (
        <AuthContext.Consumer>
            {(context) => (
                <header className="main-navigation">
                    <div className="main-navigation__logo">
                        <h1>Easy Event</h1>
                    </div>
                    <nav className="main-navigation__items">
                        <ul>
                            {!context.token && <li><NavLink to="/auth">Authenticate</NavLink></li>}
                            <li><NavLink to="/events">Events</NavLink></li>
                            {context.token && (
                                <>
                                    <li>
                                        <NavLink to="/bookings">Bookings</NavLink>
                                    </li>
                                    <li>
                                        <button onClick={logout}>Logout</button>
                                    </li>
                                </>
                            )}
                        </ul>
                    </nav>
                </header>
            )}
        </AuthContext.Consumer>
    )
};

export default MainNavigation;