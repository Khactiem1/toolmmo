import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/bus/brandAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: "brand_id",
      code: '',
    }
  },
  api,
);

class moduleBrand {
  state = () => {
    return {
      ...crudBase.state,
    }
  }
  actions = {
    ...crudBase.actions,
  }
}

const store = new moduleBrand();
const useStore = defineStore('moduleBrand', store);

export default useStore;