import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

import PrivateRoute from './PrivateRoute';

import AccountCreated from  './Components/DefaultPages/AccountCreated/AccountCreated';
import AddFriendPage from './Components/UserPages/AddFriendsPage/AddFriends';
import AddPhotoPage from './Components/UserPages/AddPhotoPage/AddPhoto';
import AdminTablePage from './Components/AdminPages/AdminTable/AdminTable';
import ChatPage from './Components/UserPages/ChatPage/Chat';
import EditProfilePage from './Components/UserPages/EditProfilePage/EditProfilePage';
import FriendFeedPage from './Components/UserPages/FeedPage/Feed';
import FirstPage from './Components/DefaultPages/FirstPage/FirstPage';
import FriendList from './Components/UserPages/FriendListPage/FriendList';
import HomePage from './Components/UserPages/HomePage/HomePage';
import NotFoundPage from './Components/DefaultPages/NotFoundPage/NotFound';
import PasswordChanged from './Components/DefaultPages/PasswordChanged/PasswordChanged';
import PendingRequests from './Components/UserPages/PendingRequestsPage/PendingRequests';
import ResetPassword from './Components/DefaultPages/ResetPassword/ResetPassword';
import SignUpPage from './Components/DefaultPages/SignUpPage/SignUpPage';
import UserTablePage from './Components/AdminPages/UserTable/UserTable';
import ViewProfilePage from './Components/UserPages/ViewProfilePage/ViewProfile';

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
                        <Route exact path='/view-profile/:id' render={() => <ViewProfilePage />}/>

                        <PrivateRoute exact path='/home-user' component={HomePage} requiredRole="user" />
                        <PrivateRoute exact path='/edit-profile' component={EditProfilePage} requiredRole="user" />
                        <PrivateRoute exact path='/add-friends' component={AddFriendPage} requiredRole="user" />
                        <PrivateRoute exact path='/friend-list' component={FriendList} requiredRole="user" />
                        <PrivateRoute exact path="/pending-requests" component={PendingRequests} requiredRole="user" />
                        <PrivateRoute exact path="/add-photo" component={AddPhotoPage} requiredRole="user" />
                        <PrivateRoute exact path="/feed" component={FriendFeedPage} requiredRole="user" />

                        <PrivateRoute exact path='/admin-table' component={AdminTablePage} requiredRole="admin" />
                        <PrivateRoute exact path='/user-table' component={UserTablePage} requiredRole="admin" />

                        <Route exact path="/chat" render={() => <ChatPage />} />
    
                        <PrivateRoute exact path='/chat/:user2' component={ChatPage} requiredRole="user" />
                    </Switch>

                </div>
            </Router>
            </div>
        )
    };
}

export default App;
