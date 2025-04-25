import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/cust/customerAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: "customer_id",
      code: 'customer_code',
    }
  },
  api,
);

class moduleCustomer {
  state = () => {
    return {
      ...crudBase.state,
    }
  }
  actions = {
    ...crudBase.actions,
  }
}

const store = new moduleCustomer();
const useStore = defineStore('moduleCustomer', store);

export default useStore;