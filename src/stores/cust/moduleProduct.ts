import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/cust/productAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: "product_id",
      code: '',
    }
  },
  api,
);

class moduleProduct {
  state = () => {
    return {
      ...crudBase.state,
    }
  }
  actions = {
    ...crudBase.actions,
  }
}

const store = new moduleProduct();
const useStore = defineStore('moduleProduct', store);

export default useStore;