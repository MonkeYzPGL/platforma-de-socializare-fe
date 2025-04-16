import React from 'react';
import { useHistory } from 'react-router-dom';
import './NotFound.css';

const NotFoundPage = () => {
    const history = useHistory();

    const goHome = () => {
        history.push('/');
    };

    return (
        <div className="not-found-container">
            <button className="not-found-button" onClick={goHome}>
                Go back Home
            </button>
        </div>
    );
};

export default NotFoundPage;
