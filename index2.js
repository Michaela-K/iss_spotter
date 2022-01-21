// const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes } = require('./iss_promised');

// fetchMyIP()  //this function  returns a promise so we call then on its value and ctake in a callback which accepts the repons body
//   .then(fetchCoordsByIP)  
//   .then(fetchISSFlyOverTimes)
//   .then(body => console.log(body));

const { nextISSTimesForMyLocation } = require('./iss_promised');

// see index.js for printPassTimes 
// copy it from there, or better yet, moduralize and require it in both files

// Call 
nextISSTimesForMyLocation()
  .then((passTimes) => {
    printPassTimes(passTimes);  //?
  })
  .catch((error) => {
    console.log("It didn't work: ", error.message);
  });

  //Now, if there is ever an error anywhere along our chain of promises, execution will jump to our catch callback instead.