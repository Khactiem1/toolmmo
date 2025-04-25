import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/bus/wardAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: "ward_id",
      code: 'ward_code',
    }
  },
  api,
);

class moduleWard {
  state = () => {
    return {
      ...crudBase.state,
    }
  }
  actions = {
    ...crudBase.actions,
  }
}

const store = new moduleWard();
const useStore = defineStore('moduleWard', store);

export default useStore;