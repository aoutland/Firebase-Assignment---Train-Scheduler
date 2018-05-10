// Initialize Firebase
  var config = {
    apiKey: "AIzaSyAiv7jZkWYhrUF3ydywmlE2vZFy-cuSFXQ",
    authDomain: "train-times-c7926.firebaseapp.com",
    databaseURL: "https://train-times-c7926.firebaseio.com",
    projectId: "train-times-c7926",
  };

 firebase.initializeApp(config);

var trainData = firebase.database();

$("#add-train-btn").on("click", function() {

  var trainName = $("#TrainInput").val().trim();
  var destination = $("#DestinationInput").val().trim();
  var firstTrainTime = moment($("#FirstTimeInput").val().trim(), "HH:mm").subtract(10, "years").format("X");
  var frequency = $("#FrequencyInput").val().trim();

  var newTrain = {

    name: trainName,
    destination: destination,
    firstTrain: firstTrainTime,
    frequency: frequency
  };

  // Uploads train data to the database
  trainData.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(firstTrainTime);
  console.log(newTrain.frequency);

  // Alert
  alert("Train schedule successfully updated");

  // Clears all of the text-boxes
  $("#TrainInput").val("");
  $("#DestinationInput").val("");
  $("#FirstTimeInput").val("");
  $("#FrequencyInput").val("");

  // Determine when the next train arrives.
  return false;
});

// 4. Create Firebase event for adding trains to the database and a row in the html when a user adds an entry
trainData.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // Store everything into a variable.
  var tName = childSnapshot.val().name;
  var tDestination = childSnapshot.val().destination;
  var tFrequency = childSnapshot.val().frequency;
  var tFirstTrain = childSnapshot.val().firstTrain;

  // Calculate the minutes until arrival using hardcore math
  // To calculate the minutes till arrival, take the current time in unix subtract the FirstTrain time
  // and find the modulus between the difference and the frequency.
  var differenceTimes = moment().diff(moment.unix(tFirstTrain), "minutes");
  var tRemainder = moment().diff(moment.unix(tFirstTrain), "minutes") % tFrequency;
  var tMinutes = tFrequency - tRemainder;

  // To calculate the arrival time, add the tMinutes to the currrent time
  var tArrival = moment().add(tMinutes, "m").format("hh:mm A");

  console.log(tMinutes);
  console.log(tArrival);
  console.log(moment().format("hh:mm A"));
  console.log(tArrival);
  console.log(moment().format("X"));

  // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + tName + "</td><td>" + tDestination + "</td><td>"
  + tFrequency + "</td><td>" + tArrival + "</td><td>" + tMinutes + "</td></tr>");
});