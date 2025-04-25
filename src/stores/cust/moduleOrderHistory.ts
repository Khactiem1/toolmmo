import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/cust/orderHistoryAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: "order_history_id",
      code: '',
    }
  },
  api,
);

class moduleOrderHistory {
  state = () => {
    return {
      ...crudBase.state,
    }
  }
  actions = {
    ...crudBase.actions,
  }
}

const store = new moduleOrderHistory();
const useStore = defineStore('moduleOrderHistory', store);

export default useStore;