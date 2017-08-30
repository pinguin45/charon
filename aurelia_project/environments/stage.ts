const baseRoute: string = 'http://localhost:8000';

// tslint:disable-next-line no-default-export
export default {
  debug: true,
  testing: false,
  processlist: {
    pageLimit: 10,
  },
  processengine: {
    poolingInterval: 10000,
    routes: {
      processes: `${baseRoute}/datastore/ProcessDef`,
      startProcess: `${baseRoute}/processengine/start`,
      processInstances: `${baseRoute}/datastore/Process`,
      messageBus: `${baseRoute}/mb`,
      getidentity: `${baseRoute}/iam/getidentity`,
    },
  },
  events: {
    xmlChanged: 'xmlChanged',
  },
  createProcess: `/#/start/cc8c62d0-051e-4245-a3eb-02c3f2b9e94a`,
};
