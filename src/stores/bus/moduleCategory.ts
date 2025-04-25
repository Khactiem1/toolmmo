import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/bus/categoryAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: "category_id",
      code: '',
    }
  },
  api,
);

class moduleService {
  state = () => {
    return {
      ...crudBase.state,
    }
  }
  actions = {
    ...crudBase.actions,
  }
}

const store = new moduleService();
const useStore = defineStore('moduleCategory', store);

export default useStore;