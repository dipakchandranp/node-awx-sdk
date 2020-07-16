const AwxRestConnector = require("./src/awx_rest_connector");

const awx = new AwxRestConnector("HOST", "USERNAME", "PASSWORD");

awx.getApiResources().then(apiResources => {
  console.log(apiResources);
});
