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

function getAllAdmins(callback) {
    const request = new Request(HOST.admin_api + "/all", {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });

    RestApiClient.performRequest(request, (result, status, error) => {
        if (status === 200) {
            console.log("Fetched all adminsfrom: " + request.url);
        }
        callback(result, status, error);
    });
}

function deleteAdmin(id, callback){
    const payload = { id: id };

    const request = new Request(HOST.admin_api + "/" + id, {
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

function updateAdmin(userData, callback) {
    const request = new Request(HOST.admin_api + "/" + userData.id, {
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

function createAdmin(userData, callback){
    const request = new Request(HOST.admin_api, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    });

    RestApiClient.performRequest(request, (result, status, error) => {
        if(status === 200){
            console.log("User created at: " + request.url);
        }
        callback(result, status, error);
    });
}

export {
    adminLogin,
    validateUser,
    getAllAdmins,
    deleteAdmin,
    updateAdmin,
    createAdmin
};