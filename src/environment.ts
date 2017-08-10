const baseRoute: string = 'http://localhost:8000';

export default {
  debug: true,
  testing: true,
  processengine: {
    routes: {
      processes: `${baseRoute}/datastore/ProcessDef`,
      startProcess: `${baseRoute}/processengine/start`,
      processInstances: `${baseRoute}/datastore/Process`
    }
  }
};
