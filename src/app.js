import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import FirstPage from './FirstPage/FirstPage';


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
