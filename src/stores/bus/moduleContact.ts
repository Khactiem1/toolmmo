import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/bus/contactAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: "contact_id",
      code: '',
    }
  },
  api,
);

class moduleContact {
  state = () => {
    return {
      ...crudBase.state,
    }
  }
  actions = {
    ...crudBase.actions,
  }
}

const store = new moduleContact();
const useStore = defineStore('moduleContact', store);

export default useStore;