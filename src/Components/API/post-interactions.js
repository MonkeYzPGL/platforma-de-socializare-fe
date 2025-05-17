import RestApiClient from "./rest-client";

// Baza API-ului pentru postări
const BASE_URL = "http://socialplatform.ddns.net/posts";

/**
 * Like post by user
 * @param {number} userId 
 * @param {number} postId 
 * @param {function} callback 
 */
export const likePost = (userId, postId, callback) => {
  const request = new Request(`${BASE_URL}/${userId}/${postId}/like`, {
    method: "POST",
    headers: {
      Accept: "application/json"
    }
  });

  RestApiClient.performRequest(request, callback);
};

/**
 * Unlike post by user
 * @param {number} userId 
 * @param {number} postId 
 * @param {function} callback 
 */
export const unlikePost = (userId, postId, callback) => {
  const request = new Request(`${BASE_URL}/${userId}/${postId}/like`, {
    method: "DELETE",
    headers: {
      Accept: "application/json"
    }
  });

  RestApiClient.performRequest(request, callback);
};

/**
 * Get users who liked a post
 * @param {number} postId 
 * @param {function} callback 
 */
export const getLikes = (postId, callback) => {
  const request = new Request(`${BASE_URL}/${postId}/likes`, {
    method: "GET",
    headers: {
      Accept: "application/json"
    }
  });

  RestApiClient.performRequest(request, callback);
};

/**
 * Get comments for a post
 * @param {number} postId 
 * @param {function} callback 
 */
export const getComments = (postId, callback) => {
  const request = new Request(`${BASE_URL}/${postId}/comments`, {
    method: "GET",
    headers: {
      Accept: "application/json"
    }
  });

  RestApiClient.performRequest(request, callback);
};

/**
 * Add comment to post
 * @param {number} userId 
 * @param {number} postId 
 * @param {string} content 
 * @param {function} callback 
 */
export const addComment = (userId, postId, content, callback) => {
  const url = `http://socialplatform.ddns.net/posts/${userId}/${postId}/comment`;
  const request = new Request(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ content })  // asigură-te că trimiți doar { content }
  });

  RestApiClient.performRequest(request, callback);
};
