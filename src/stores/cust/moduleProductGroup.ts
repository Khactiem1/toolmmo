
import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/cust/productGroupAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: "product_group_id",
      code: '',
    }
  },
  api,
);

class moduleProductGroup {
  state = () => {
    return {
      ...crudBase.state,
    }
  }
  actions = {
    ...crudBase.actions,
  }
}

const store = new moduleProductGroup();
const useStore = defineStore('moduleProductGroup', store);

export default useStore;