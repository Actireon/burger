import axios from 'axios';

import * as actionTypes from './actionTypes';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId
    };
};

export const authFail = error => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};

export const authLogout = () => {
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};

export const checkAuthTimeout = expirationTime => {
    return dispatch => {
        setTimeout(() => {
            dispatch(authLogout());
        }, expirationTime * 1000)
    };
};

export const auth = (email, password, isSignup) => {
    return dispatch => {
        dispatch(authStart());
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        };
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDgwWbLI0qkmcp0F0kaTX6k6-Pzmt88T4I';
        if (!isSignup) {
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDgwWbLI0qkmcp0F0kaTX6k6-Pzmt88T4I'
        }

        axios.post(url, authData)
            .then(res => {
                dispatch(authSuccess(res.data.idToken, res.data.localId));
                dispatch(checkAuthTimeout(res.data.expiresIn));
            })
            .catch(err => {
                dispatch(authFail(err.response.data.error));
            })
    };
};