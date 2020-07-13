import React, {useState} from "react";

import './Auth.css';
import axios from '../core/axios';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
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
                query {
                    login(email: "${email}", password: "${password}")
                    {
                        userId
                        token
                        tokenExpiration
                    }
                }
            `
        };

        if (!isLogin) {
            requestBody = {
                query: `
                mutation {
                    createUser(userInput: {email: "${email}", password: "${password}"})
                    {
                        _id
                        email
                    }
                }
            `
            };
        }

        axios.post('http://localhost:3001/graphql', requestBody)
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!')
                }

                return res.data
            })
            .then(resData => {
                console.log(resData)
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