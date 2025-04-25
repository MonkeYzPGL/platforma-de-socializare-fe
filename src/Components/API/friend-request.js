import RestApiClient from "./rest-client";

const FRIEND_API = "http://socialplatform.ddns.net/api/v1";

function sendFriendRequest(senderId, receiverId, callback) {
  const request = new Request(`${FRIEND_API}/friend-request/send/${senderId}/${receiverId}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json'
    }
  });

  RestApiClient.performRequest(request, (result, status, error) => {
    if (status === 201) {
      console.log("Friend request sent!");
    }
    callback(result, status, error);
  });
}

function acceptFriendRequest(senderId, receiverId, callback) {
  const request = new Request(`${FRIEND_API}/friend-request/accept/${senderId}/${receiverId}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json'
    }
  });

  RestApiClient.performRequest(request, (result, status, error) => {
    if (status === 201) {
      console.log("Friend request accepted!");
    }
    callback(result, status, error);
  });
}

function getPendingRequests(userId, callback) {
  const request = new Request(`${FRIEND_API}/friend-request/pending/${userId}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });

  RestApiClient.performRequest(request, (result, status, error) => {
    if (status === 200) {
      console.log("Pending requests fetched!");
    }
    callback(result, status, error);
  });
}

function rejectFriendRequest(senderId, receiverId, callback) {
  const request = new Request(`${FRIEND_API}/friend-request/reject/${senderId}/${receiverId}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json'
    }
  });

  RestApiClient.performRequest(request, (result, status, error) => {
    if (status === 200) {
      console.log("Friend request rejected!");
    }
    callback(result, status, error);
  });
}

export {
  sendFriendRequest,
  acceptFriendRequest,
  getPendingRequests,
  rejectFriendRequest
};
