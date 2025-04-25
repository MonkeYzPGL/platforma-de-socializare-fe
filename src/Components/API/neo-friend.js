import RestApiClient from "./rest-client";

const HOST = {
  friend_api: "http://socialplatform.ddns.net/api/v1/friends"
};

function getFriendList(userId, callback) {
  const request = new Request(`${HOST.friend_api}/${userId}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    }
  });

  RestApiClient.performRequest(request, (result, status, error) => {
    if (status === 200) {
      console.log("Friend list fetched from:", request.url);
    }
    callback(result, status, error);
  });
}

export { 
  getFriendList,
  
};
