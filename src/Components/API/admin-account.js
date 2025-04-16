//import { RiGitPullRequestFill } from "react-icons/ri";
import RestApiClient from "./rest-client";
const HOST = {
    admin_api: "http://socialplatform.ddns.net/api/v1/adminAccount"
}

function adminLogin(username, password, callback) {
    const payload = {
        username: username,
        password: password
    };

    const request = new Request(HOST.admin_api + "/login", {
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

function validateUser(userId, callback) {
    const request = new Request(HOST.admin_api + "/validate/" + userId, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });

    RestApiClient.performRequest(request, (result, status, error) => {
        if (status === 200) {
            console.log("User validated at:", request.url);
        }
        callback(result, status, error);
    });
}


export {
    adminLogin,
    validateUser,
};