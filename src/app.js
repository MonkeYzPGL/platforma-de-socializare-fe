import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import FirstPage from './FirstPage/FirstPage';
import SignUpPage from './SignUpPage/SignUpPage';
import FirstPage from './Components/FirstPage/FirstPage';
import ResetPassword from './Components/ResetPassword/ResetPassword';
import PasswordChanged from './Components/PasswordChanged/PasswordChanged';
import AccountCreated from  './Components/AccountCreated/AccountCreated';

import ErrorPage from './commons/errorhandling/error-page';

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
                        
                        {/*Error*/}
                        <Route
                            exact
                            path='/error'
                            render={() => <ErrorPage/>}
                        />

                        <Route render={() =><ErrorPage/>} />
                    </Switch>
                </div>
            </Router>
            </div>
        )
    };
}

export default App
