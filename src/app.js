import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

import AccountCreated from  './Components/AccountCreated/AccountCreated';
import FirstPage from './Components/FirstPage/FirstPage';
import HomePage from './Components/HomePage/HomePage';
import NotFoundPage from './Components/NotFoundPage/NotFound';
import PasswordChanged from './Components/PasswordChanged/PasswordChanged';
import ResetPassword from './Components/ResetPassword/ResetPassword';
import SignUpPage from './Components/SignUpPage/SignUpPage';

import ErrorPage from './commons/errorhandling/error-page';
import HomePage from './Components/HomePage/HomePage';
import EditProfilePage from './Components/EditProfilePage/EditProfilePage';


class App extends React.Component {

    render() {
        return (
            <div>
            <Router>
                <div>
                    {/* <NavigationBar /> */}
                    <Switch>

                        {/*Prima pagina*/}
                        <Route
                            exact
                            path='/'
                            render={() => <FirstPage/>}
                        />

                        {/*Sign Up*/}
                        <Route
                            exact
                            path='/signup'
                            render={() => <SignUpPage/>}
                        />

                        
                        {/*Reset Password*/}
                        <Route
                            exact
                            path='/reset-password'
                            render={() => <ResetPassword />}
                        />
                        
                        <Route
                            exact
                            path='/password-changed'
                            render={() => <PasswordChanged />}
                        />
                        
                        <Route
                            exact
                            path='/account-created'
                            render={() => <AccountCreated />}
                        />

                        <Route
                            exact
                            path='/home-user-page'
                            render={() => <HomePage />}
                        />

                        <Route
                            exact
                            path='/edit-profile-page'
                            render={() => <EditProfilePage />}
                        />

                        {/*Error*/}
                        <Route
                            exact
                            path='/error'
                            render={() => <ErrorPage/>}
                        />

                    </Switch>
                </div>
            </Router>
            </div>
        )
    };
}

export default App;
