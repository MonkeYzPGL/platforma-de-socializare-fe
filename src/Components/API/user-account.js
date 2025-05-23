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

function getUserPhotos(userId, callback) {
    const request = new Request(`${HOST.user_api}/photos/${userId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });

    RestApiClient.performRequest(request, (result, status, error) => {
        if (status === 200) {
            console.log(`Fetched photos for user ID: ${userId}`);
        } else if (status === 204) {
            console.log(`No photos found for user ID: ${userId}`);
        } else {
            console.log(`Failed to fetch photos for user ID: ${userId}`);
        }
        callback(result, status, error);
    });
}

function deleteUserPhoto(userId, photoTitle, callback) {
    const request = new Request(`${HOST.user_api}/photo/${userId}/${photoTitle}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json'
        }
    });

    RestApiClient.performRequest(request, (result, status, error) => {
        if (status === 200) {
            console.log(`Photo '${photoTitle}' deleted successfully for user ID: ${userId}`);
        } else {
            console.log(`Failed to delete photo '${photoTitle}' for user ID: ${userId}`);
        }
        callback(result, status, error);
    });
}

function uploadPhotoToAlbum(userId, albumName, photoName, file, callback) {
    const formData = new FormData();
    formData.append("file", file);

    const request = new Request(`${HOST.user_api}/album/${userId}/${albumName}/${photoName}`, {
        method: 'PUT',
        body: formData
    });

    RestApiClient.performRequest(request, (result, status, error) => {
        if (status === 200) {
            console.log(`Photo '${photoName}' uploaded successfully to album '${albumName}' for user ID: ${userId}`);
        } else if (status === 204) {
            console.log(`User not found for ID: ${userId}`);
        } else {
            console.log(`Failed to upload photo '${photoName}' to album '${albumName}'`);
        }
        callback(result, status, error);
    });
}

function getUserAlbums(userId, callback) {
    const request = new Request(`${HOST.user_api}/album/${userId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });

    RestApiClient.performRequest(request, (result, status, error) => {
        if (status === 200) {
            console.log(`Fetched albums for user ID: ${userId}`);
        } else if (status === 204) {
            console.log(`No albums found for user ID: ${userId}`);
        } else {
            console.log(`Failed to fetch albums for user ID: ${userId}`);
        }
        callback(result, status, error);
    });
}

function getAlbumPhotos(userId, albumName, callback) {
    const request = new Request(`${HOST.user_api}/album/${userId}/${albumName}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });

    RestApiClient.performRequest(request, (result, status, error) => {
        if (status === 200) {
            console.log(`Fetched photos from album '${albumName}' for user ID: ${userId}`);
        } else if (status === 204) {
            console.log(`No photos found in album '${albumName}' for user ID: ${userId}`);
        } else {
            console.log(`Failed to fetch photos from album '${albumName}' for user ID: ${userId}`);
        }
        callback(result, status, error);
    });
}

function deleteUserAlbum(userId, albumName, callback) {
    const request = new Request(`${HOST.user_api}/album/${userId}/${albumName}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json'
        }
    });

    RestApiClient.performRequest(request, (result, status, error) => {
        if (status === 200) {
            console.log(`Album '${albumName}' deleted successfully for user ID: ${userId}`);
        } else if (status === 204) {
            console.log(`User not found for ID: ${userId}`);
        } else if (status === 500) {
            console.log(`Failed to delete album '${albumName}' for user ID: ${userId}`);
        }
        callback(result, status, error);
    });
}

function getPostByImageUrl(imageUrl, callback) {
    const encodedUrl = encodeURIComponent(imageUrl);

    const request = new Request(`${HOST.user_api}/postPhoto?imageUrl=${encodedUrl}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });

    RestApiClient.performRequest(request, (result, status, error) => {
        if (status === 200) {
            console.log("Fetched post by image URL from:", request.url);
        } else {
            console.warn("Failed to fetch post for image URL:", imageUrl);
        }
        callback(result, status, error);
    });
}

export const getUsernameById = (id, callback) => {
  fetch(`http://socialplatform.ddns.net/api/v1/userAccount/getUsername/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json"
    }
  })
    .then(res => res.json())
    .then(data => callback(data, 200))
    .catch(err => callback(null, 500, err));
};


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
    uploadUserPhoto,
    getUserPhotos,
    deleteUserPhoto,
    uploadPhotoToAlbum,
    getUserAlbums, 
    getAlbumPhotos, 
    deleteUserAlbum,
    getPostByImageUrl
};
