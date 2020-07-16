# node-awx-sdk

node-aws-sdk is a utility library for connecting a node js application to Ansible AWX using ReST APIs.

## Installation

```
  npm install node-awx-sdk

```

## Usage

```
  // require node-awx-sdk module
  cosnt AwxSdk  = require("node-awx-sdk")

  // initialize with your configuration
  const host = "https://your-awx-server-domain-with-post";
  cosnt username =  "awx username"
  cosnt password = "password"
  const awx = new AwxSdk(host, username, password);

```

### Test sdk

```
  // retrieve awx token
  awx.getToken().then(token => {
    console.log(token);
  });

  // retrieve API resources
  awx.getApiResources().then(apiResources => {
    console.log(apiResources);
  });

```

### Using AWX SDK for other ReST api calls

AWX ReST services provides predefined set of APIs to do all the CURD operation.
When we call `awx.getApiResources()` will get all the API list provided by AWX as below:

```
  {
    ping: '/api/v2/ping/',
    instances: '/api/v2/instances/',
    instance_groups: '/api/v2/instance_groups/',
    config: '/api/v2/config/',
    settings: '/api/v2/settings/',
    me: '/api/v2/me/',
    dashboard: '/api/v2/dashboard/',
    organizations: '/api/v2/organizations/',
    users: '/api/v2/users/',
    projects: '/api/v2/projects/',
    project_updates: '/api/v2/project_updates/',
    teams: '/api/v2/teams/',
    credentials: '/api/v2/credentials/',
    credential_types: '/api/v2/credential_types/',
    credential_input_sources: '/api/v2/credential_input_sources/',
    applications: '/api/v2/applications/',
    tokens: '/api/v2/tokens/',
    metrics: '/api/v2/metrics/',
    inventory: '/api/v2/inventories/',
    inventory_scripts: '/api/v2/inventory_scripts/',
    inventory_sources: '/api/v2/inventory_sources/',
    inventory_updates: '/api/v2/inventory_updates/',
    groups: '/api/v2/groups/',
    hosts: '/api/v2/hosts/',
    job_templates: '/api/v2/job_templates/',
    jobs: '/api/v2/jobs/',
    job_events: '/api/v2/job_events/',
    ad_hoc_commands: '/api/v2/ad_hoc_commands/',
    system_job_templates: '/api/v2/system_job_templates/',
    system_jobs: '/api/v2/system_jobs/',
    schedules: '/api/v2/schedules/',
    roles: '/api/v2/roles/',
    notification_templates: '/api/v2/notification_templates/',
    notifications: '/api/v2/notifications/',
    labels: '/api/v2/labels/',
    unified_job_templates: '/api/v2/unified_job_templates/',
    unified_jobs: '/api/v2/unified_jobs/',
    activity_stream: '/api/v2/activity_stream/',
    workflow_job_templates: '/api/v2/workflow_job_templates/',
    workflow_jobs: '/api/v2/workflow_jobs/',
    workflow_approvals: '/api/v2/workflow_approvals/',
    workflow_job_template_nodes: '/api/v2/workflow_job_template_nodes/',
    workflow_job_nodes: '/api/v2/workflow_job_nodes/'
  }
```

To call any of these service you can use `awx.call` or `awx.callDynamic`.

#### `awx.call`

There are three parameter for this function,

1. API method : GET, POST, PUT, OPTION, DELETE, etc all that supported by AWX
2. apiResourcesName: url property name from the response of `awx.getApiResources()`
3. Data needs to be passed to the API service, this is optional based on the AWX definition.

Example:

```
  awx.call("GET", "applications").then(response => {
    // Do what ever you want to do with this response
  })
```

If you want to send some data to AWX while making API call can pass that as the
third argument of this `awx.call` function as below:

```
  let data = {
    // your json object
  }
  awx.call("POST", "workflow_job_templates", data).then(response => {
    // Do what ever you want to do with this reponse
  })
```

#### `awx.callDynamic`

There are three parameter for this function,

1. API method : GET, POST, PUT, OPTION, DELETE, etc all that supported by AWX
2. dynamic URL provided by AWX for different resources.
3. Data needs to be passed to the API service, this is optional based on the AWX definition.

Example:

```
  awx.callDynamic("GET", `/api/workflow_job_nodes/21/`).then(response => {
    // Do what ever you want to do with this response
  })
```

If you want to send some data to AWX while making API call can pass that as the
third argument of this `awx.call` function as below:

```
  let data = {
    // your json object
  }
  awx.callDynamic("POST",` /api/workflow_job_nodes/`, data).then(response => {
    // Do what ever you want to do with this reponse
  })
```
