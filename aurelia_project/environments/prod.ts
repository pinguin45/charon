const baseRoute: string = 'http://localhost:8000';

export default {
  debug: false,
  testing: false,
  processengine: {
    poolingInterval: 5000,
    routes: {
      processes: `${baseRoute}/datastore/ProcessDef`,
      startProcess: `${baseRoute}/processengine/start`,
      processInstances: `${baseRoute}/datastore/Process`
    }
  }
};
