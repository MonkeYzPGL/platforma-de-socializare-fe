import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

import AccountCreated from  './Components/DefaultPages/AccountCreated/AccountCreated';
import EditProfilePage from './Components/EditProfilePage/EditProfilePage';
import FirstPage from './Components/DefaultPages/FirstPage/FirstPage';
import HomePage from './Components/DefaultPages/HomePage/HomePage';
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
                            path='/user-table'
                            render={() => <UserTablePage />}
                        />

                        <Route
                            exat
                            path='/edit-profile-page'
                            render={() => <EditProfilePage />}
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
