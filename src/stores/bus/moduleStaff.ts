import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/bus/staffAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: "staff_id",
      code: '',
    }
  },
  api,
);

class moduleStaff {
  state = () => {
    return {
      ...crudBase.state,
    }
  }
  actions = {
    ...crudBase.actions,
  }
}

const store = new moduleStaff();
const useStore = defineStore('moduleStaff', store);

export default useStore;