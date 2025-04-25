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

export {
  sendFriendRequest
};
