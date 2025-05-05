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

function getUserById(id, callback) {
    const request = new Request(HOST.user_api + "/" + id, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
  
    RestApiClient.performRequest(request, (result, status, error) => {
      if (status === 200) {
        console.log("Fetched user by id from: " + request.url);
      }
      callback(result, status, error);
    });
  }

function searchUserByUsername(username, callback) {
    const request = new Request(HOST.user_api + "/getByUsername/" + username, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });

    RestApiClient.performRequest(request, (result, status, error) => {
        if (status === 200) {
            console.log("Searched user by username from: " + request.url);
        }
        callback(result, status, error);
    });
}

function deleteProfilePicture(userId, callback) {
    const request = new Request(`${HOST.user_api}/profile-picture/${userId}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json'
        }
    });

    RestApiClient.performRequest(request, (result, status, error) => {
        if (status === 200) {
            console.log("Profile picture deleted successfully for user ID: " + userId);
        } else if (status === 204) {
            console.log("User not found for ID: " + userId);
        } else if (status === 500) {
            console.log("Error deleting profile picture.");
        }
        callback(result, status, error);
    });
}

function uploadProfilePicture(userId, file, callback) {
    const formData = new FormData();
    formData.append("file", file);

    const request = new Request(`${HOST.user_api}/profile-picture/${userId}`, {
        method: 'PUT',
        body: formData
    });

    RestApiClient.performRequest(request, (result, status, error) => {
        if (status === 200) {
            console.log("Profile picture uploaded successfully to: " + request.url);
        } else if (status === 204) {
            console.log("User not found for ID: " + userId);
        } else if (status === 500) {
            console.log("Upload failed.");
        }
        callback(result, status, error);
    });
}

function getProfilePictureUrl(userId, callback) {
    const request = new Request(`${HOST.user_api}/profile-picture/${userId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });

    RestApiClient.performRequest(request, (result, status, error) => {
        if (status === 200) {
            console.log("Profile picture URL fetched from: " + request.url);
        } else if (status === 204) {
            console.log("No profile picture found for user with ID: " + userId);
        }
        callback(result, status, error);
    });
}

function uploadUserPhoto(userId, photoTitle, file, callback) {
    const formData = new FormData();
    formData.append("file", file);

    const request = new Request(`${HOST.user_api}/photo/${userId}/${photoTitle}`, {
        method: 'PUT',
        body: formData
    });

    RestApiClient.performRequest(request, (result, status, error) => {
        if (status === 200) {
            console.log(`Photo '${photoTitle}' uploaded successfully for user ID: ${userId}`);
        } else if (status === 204) {
            console.log(`User not found: ${userId}`);
        } else {
            console.log(`Failed to upload photo '${photoTitle}'`);
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
    updateUser,
    getUserById,
    searchUserByUsername,
    getProfilePictureUrl,
    uploadProfilePicture,
    deleteProfilePicture,
    uploadUserPhoto
};
