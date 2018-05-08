$(window).on("load", function() {
  
  // load the initial data
  setDate();
  getStatsData();
  getPowerDataCurrent(false);
  getPowerDataLastWeek(false);
  getGasDataLastWeek(false);

  // refresh chart data every 15 seconds
  window.setInterval(function() {
    getStatsData(true);
  }, 15000);

  // refresh chart data every 5 minutes
  window.setInterval(function() {
    setDate();
    getPowerDataCurrent(true);
  }, 300000);

  function setDate() {
    $("#date").text(moment(new Date()).format('MMMM Do YYYY'));
  }
  
});
