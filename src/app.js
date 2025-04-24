import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

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
                    {/* <NavigationBar /> */}
                    <Switch>
                        <Route
                            exact
                            path='/account-created'
                            render={() => <AccountCreated />}
                        />

                        <Route
                            exact
                            path='/admin-table'
                            render={() => <AdminTablePage />}
                        /> 
                        
                        <Route
                            exact
                            path='/edit-profile'
                            render={() => <EditProfilePage />}
                        />

                        <Route
                            exact
                            path='/'
                            render={() => <FirstPage/>}
                        />

                        <Route
                            exact
                            path='/home-user'
                            render={() => <HomePage />}
                        />

                        <Route
                            exact
                            path='/password-changed'
                            render={() => <PasswordChanged />}
                        />

                        <Route
                            exact
                            path='/reset-password'
                            render={() => <ResetPassword />}
                        />

                        <Route
                            exact
                            path='/signup'
                            render={() => <SignUpPage/>}
                        />

                        <Route
                            exact
                            path='/user-table'
                            render={() => <UserTablePage />}
                        />

                        <Route render={() => <NotFoundPage />} />

                    </Switch>
                </div>
            </Router>
            </div>
        )
    };
}

export default App;
