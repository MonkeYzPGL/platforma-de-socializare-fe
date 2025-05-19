function performRequest(request, callback){
    fetch(request)
        .then(function(response) {
            if (response.status === 204) {
                callback(null, response.status, null);
            } else {
                response.json()
                    .then(json => {
                        if (response.ok) {
                            callback(json, response.status, null);
                        } else {
                            callback(null, response.status, json);
                        }
                    })
                    .catch(err => {
                        callback(null, response.status, err);
                    });
            }
        })
        .catch(function (err) {
            callback(null, 1, err);
        });
}


module.exports = {
    performRequest
};
