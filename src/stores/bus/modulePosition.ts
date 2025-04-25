import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/bus/positionAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: "position_id",
      code: '',
    }
  },
  api,
);

class modulePosition {
  state = () => {
    return {
      ...crudBase.state,
    }
  }
  actions = {
    ...crudBase.actions,
  }
}

const store = new modulePosition();
const useStore = defineStore('modulePosition', store);

export default useStore;