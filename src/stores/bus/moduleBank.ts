import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/bus/bankAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: "bank_id",
      code: '',
    }
  },
  api,
);

class moduleBank {
  state = () => {
    return {
      ...crudBase.state,
    }
  }
  actions = {
    ...crudBase.actions,
  }
}

const store = new moduleBank();
const useStore = defineStore('moduleBank', store);

export default useStore;