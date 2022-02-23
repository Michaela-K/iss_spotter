//It will contain most of the logic for fetching the data from each API endpoint.

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const request = require("request");

const fetchMyIP = function (callback) {
  // use request to fetch IP address from JSON API
  request("https://api.ipify.org?format=json", (error, response, body) => {
    if (error) {
      return callback(error, null);
    }
    //It should be the first set of checks before we try to parse the body.
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      return callback(Error(msg), null); //creates a new Error object that we can pass around
    }

    const ip = JSON.parse(body).ip;
    callback(null, ip);
    console.log("It worked! Returned ip:", ip);
  });
};
// module.exports = { fetchMyIP };

//takes in an IP address and returns the latitude and longitude for it.
const fetchCoordsByIP = function (ip, callback) {
  ip = "72.140.207.155";
  request(`http://ip-api.com/json/${ip}`, (error, response, body) => {
    if (error) {
     return callback(error, null);
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const data = JSON.parse(body);
      callback(null, data.lat, data.lon);

  });
};
// module.exports = {fetchCoordsByIP};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
 const fetchISSFlyOverTimes = function(coords, callback) {
   const lat = 43.877;
   const lon = -79.2262;
  let url = `https://iss-pass.herokuapp.com/json/?lat=${lat}&lon=${lon}`;
  request(url, (error, response, body) => {
    if (error) {
     return  callback(error, null);
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const times = JSON.parse(body).response;
    console.log(times);
      callback(null,times)
  });
};

// module.exports = {fetchISSFlyOverTimes};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
 const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};

// Only export nextISSTimesForMyLocation and not the other three (API request) functions.
// This is because they are not needed by external modules.
module.exports = { nextISSTimesForMyLocation };


