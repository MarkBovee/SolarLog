$(window).on("load", function() {
  
  // load the initial data
  setDate();
  getStatsData();
  getPowerDataDay(false);
  getPowerDataWeek(false);
  getGasDataDay(false);
  getGasDataWeek(false);

  // refresh chart data every 15 seconds
  window.setInterval(function() {
    getStatsData(true);
  }, 15000);

  // refresh chart data every 5 minutes
  window.setInterval(function() {
    setDate();
    getPowerDataDay(true);
    getPowerDataWeek(true);
    getGasDataDay(true);
    getGasDataWeek(true);
  }, 300000);

  function setDate() {
    $("#date").text(moment(new Date()).format('MMMM Do YYYY'));
  }
  
});
