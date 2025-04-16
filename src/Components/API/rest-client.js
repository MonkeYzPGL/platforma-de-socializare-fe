function performRequest(request, callback){
    fetch(request)
        .then(function(response) {
            if (response.status === 204) {
                // 204 = No Content -> nu parsam nimic
                callback(null, response.status, null);
            } else {
                // Pentru orice altceva, încercăm să parsăm JSON
                response.json()
                    .then(json => {
                        if (response.ok) {
                            callback(json, response.status, null);
                        } else {
                            callback(null, response.status, json);
                        }
                    })
                    .catch(err => {
                        // Parsare eșuată (ex: server a trimis răspuns non-JSON)
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
