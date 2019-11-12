var populateLogs = function() {
  var logContainer = document.querySelector("#log");
  logContainer.innerHTML = null

  window.payload.forEach(log => {
    console.log("cool")
  });
}