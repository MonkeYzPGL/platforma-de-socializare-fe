import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import FirstPage from './Components/FirstPage/FirstPage';
import ResetPassword from './Components/ResetPassword/ResetPassword';


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
                        
                        {/*Reset Password*/}
                        <Route
                            exact
                            path='/reset-password'
                            render={() => <ResetPassword />}
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
