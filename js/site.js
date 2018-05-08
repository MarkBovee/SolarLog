$(window).on("load", function() {
  
  // load the initial data
  setDate();
  getPowerStatsData();
  getPowerChartData(false);

  // refresh chart data every 15 seconds
  window.setInterval(function() {
    getPowerStatsData(true);
  }, 15000);

  // refresh chart data every 5 minutes
  window.setInterval(function() {
    setDate();
    getPowerChartData(true);
  }, 300000);

  function setDate() {
    $("#date").text(moment(new Date()).format('MM-DD-YYYY'));
  }
  
});
