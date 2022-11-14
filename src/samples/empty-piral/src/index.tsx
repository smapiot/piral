import { startLoadingPilets, initializeApi, createListener } from 'piral-base';

const events = createListener();

startLoadingPilets({
  createApi(target) {
    return initializeApi(target, events);
  },   
  fetchPilets() {
    return Promise.resolve([]);
  },
});
