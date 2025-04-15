
//import { RiGitPullRequestFill } from "react-icons/ri";
import RestApiClient from "./rest-client";
const HOST = {
    user_api: "http://socialplatform.ddns.net/api/v1/userAccount"
}

function login(username, password, callback) {
    const payload = {
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
            console.log("User created at: " + HOST.user_api);
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

export {

    login,
    signup,
    resetPassword

};
