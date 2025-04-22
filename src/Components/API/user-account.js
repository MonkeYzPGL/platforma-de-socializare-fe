
//import { RiGitPullRequestFill } from "react-icons/ri";
import RestApiClient from "./rest-client";
const HOST = {
    user_api: "http://socialplatform.ddns.net/api/v1/userAccount"
}

function userLogin(username, password, callback) {
    const payload = {
        username: username,
        password: password
    };

    const request = new Request(HOST.user_api + "/login", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    });

    RestApiClient.performRequest(request, (result, status, error) => {
        if (status === 200) {
            console.log("URL: " + request.url);
        }
        callback(result, status, error);
    });
}

function signup(userData, callback) {
    const request = new Request(HOST.user_api, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    });

    RestApiClient.performRequest(request, (result, status, error) => {
        if (status === 200) {
            console.log("User created at: " + request.url);
        }
        callback(result, status, error);
    });
}

function resetPassword(email, newPassword, callback) {
    const payload = {
        password: newPassword
    };

    const request = new Request(HOST.user_api + "/resetPassword/" + email, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    });

    RestApiClient.performRequest(request, (result, status, error) => {
        if (status === 200) {
            console.log("Password reset request sent to: " + request.url);
        }
        callback(result, status, error);
    });
}

function getAllUsers(callback) {
    const request = new Request(HOST.user_api + "/all", {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });

    RestApiClient.performRequest(request, (result, status, error) => {
        if (status === 200) {
            console.log("Fetched all users from: " + request.url);
        }
        callback(result, status, error);
    });
}

function deleteUser(id, callback){
    const payload = { id: id };

    const request = new Request(HOST.user_api + "/" + id, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    RestApiClient.performRequest(request, (result,status,error) => {
        if(status === 200){
            console.log("Delete of the user request sent to:" + request.url);
        }
        callback(result, status, error);
    });
}

function updateUser(userData, callback) {
    const request = new Request(HOST.user_api + "/" + userData.id, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });

    RestApiClient.performRequest(request, (result, status, error) => {
        if (status === 200) {
            console.log("User updated at: " + request.url);
        }
        callback(result, status, error);
    });
}

export {

    userLogin,
    signup,
    resetPassword,
    getAllUsers,
    deleteUser,
    updateUser
};
