import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

import PrivateRoute from './PrivateRoute';

import AccountCreated from  './Components/DefaultPages/AccountCreated/AccountCreated';
import AdminTablePage from './Components/AdminPages/AdminTable/AdminTable';
import EditProfilePage from './Components/UserPages/EditProfilePage/EditProfilePage';
import FirstPage from './Components/DefaultPages/FirstPage/FirstPage';
import HomePage from './Components/UserPages/HomePage/HomePage';
import NotFoundPage from './Components/DefaultPages/NotFoundPage/NotFound';
import PasswordChanged from './Components/DefaultPages/PasswordChanged/PasswordChanged';
import ResetPassword from './Components/DefaultPages/ResetPassword/ResetPassword';
import SignUpPage from './Components/DefaultPages/SignUpPage/SignUpPage';
import UserTablePage from './Components/AdminPages/UserTable/UserTable';

class App extends React.Component {

    render() {
        return (
            <div>
            <Router>
                <div>
                    <Switch>
                        <Route exact path='/' render={() => <FirstPage />} />
                        <Route exact path='/signup' render={() => <SignUpPage />} />
                        <Route exact path='/reset-password' render={() => <ResetPassword />} />
                        <Route exact path='/password-changed' render={() => <PasswordChanged />} />
                        <Route exact path='/account-created' render={() => <AccountCreated />} />

                        <PrivateRoute exact path='/home-user' component={HomePage} requiredRole="user" />
                        <PrivateRoute exact path='/edit-profile' component={EditProfilePage} requiredRole="user" />
                        <PrivateRoute exact path='/admin-table' component={AdminTablePage} requiredRole="admin" />
                        <PrivateRoute exact path='/user-table' component={UserTablePage} requiredRole="admin" />

                        <Route render={() => <NotFoundPage />} />
                    </Switch>

                </div>
            </Router>
            </div>
        )
    };
}

export default App;
