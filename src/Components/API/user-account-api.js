
import RestApiClient from "./rest-client";
const HOST = {
    user_api: "http://localhost:8080/api/v1/userAccount"
}

function login(username, password, callback) {
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

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, (result, status, error) => {
        if (status === 200) {
            console.log(result);
        }
        callback(result, status, error);
    });
}


export {

    login,

};
