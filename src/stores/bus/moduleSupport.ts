import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/bus/supportAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: "support_id",
      code: '',
    }
  },
  api,
);

class moduleSupport {
  state = () => {
    return {
      ...crudBase.state,
    }
  }
  actions = {
    ...crudBase.actions,
  }
}

const store = new moduleSupport();
const useStore = defineStore('moduleSupport', store);

export default useStore;