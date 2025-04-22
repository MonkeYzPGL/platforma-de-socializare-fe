import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, requiredRole, ...rest }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const admin = JSON.parse(localStorage.getItem('admin'));

  const isUser = !!user;
  const isAdmin = !!admin;

  const hasAccess =
    (requiredRole === 'admin' && isAdmin) ||
    (requiredRole === 'user' && isUser);

  return (
    <Route
      {...rest}
      render={(props) =>
        hasAccess ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};

export default PrivateRoute;
