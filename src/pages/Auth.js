import React, {useState, useContext} from "react";

import './Auth.css';
import axios from '../core/axios';
import {AuthContext} from '../context/auth-context';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const {login} = useContext(AuthContext);
    const emailEl = React.createRef();
    const passwordEl = React.createRef();


    const submitHandler = e => {
        e.preventDefault();

        const email = emailEl.current.value;
        const password = passwordEl.current.value;

        if (email.trim().length === 0 || password.trim().length === 0) {
            return;
        }

        let requestBody = {
            query: `
                query Login($email: String!, $password: String!) {
                    login(email: $email, password: $password)
                    {
                        userId
                        token
                        tokenExpiration
                    }
                }
            `,
            variables: {
                email: email,
                password: password
            }
        };

        if (!isLogin) {
            requestBody = {
                query: `
                    mutation CreateUser($email: String!, $password: String!) {
                        createUser(userInput: {email: $email, password: $password})
                        {
                            _id
                            email
                        }
                    }
                `,
                variables: {
                    email: email,
                    password: password
                }
            };
        }

        axios.post('/graphql', requestBody)
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!')
                }

                return res.data
            })
            .then(resData => {
                if (resData.data.login.token) {
                    login(resData.data.login.token, resData.data.login.userId, resData.data.login.tokenExpiration)
                }
            })
            .catch(err => {
                console.log(err)
            })
    };

    const switchModeHandler = () => {
        setIsLogin(!isLogin)
    };

    return (
        <form className="auth-form" action="" onSubmit={submitHandler}>
            <div className="form-control">
                <label htmlFor="">E-Mail</label>
                <input type="email" id="email" ref={emailEl}/>
            </div>
            <div className="form-control">
                <label htmlFor="">Password</label>
                <input type="password" id="password" ref={passwordEl}/>
            </div>
            <div className="form-actions">
                <button type="submit">Submit</button>
                <button type="button" onClick={switchModeHandler}>Switch to {isLogin ? 'Signup' : 'Login'}</button>
            </div>
        </form>
    )
};

export default AuthPage