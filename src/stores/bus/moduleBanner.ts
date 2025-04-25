import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/bus/bannerAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: "banner_id",
      code: '',
    }
  },
  api,
);

class moduleBanner {
  state = () => {
    return {
      ...crudBase.state,
    }
  }
  actions = {
    ...crudBase.actions,
  }
}

const store = new moduleBanner();
const useStore = defineStore('moduleBanner', store);

export default useStore;