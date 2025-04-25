import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/cust/transactionAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: "transaction_id",
      code: 'transaction_code',
    }
  },
  api,
);

class moduleTransaction {
  state = () => {
    return {
      ...crudBase.state,
    }
  }
  actions = {
    ...crudBase.actions,
  }
}

const store = new moduleTransaction();
const useStore = defineStore('moduleTransaction', store);

export default useStore;