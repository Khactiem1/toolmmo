import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/cust/warehouseAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: "warehouse_id",
      code: '',
    }
  },
  api,
);

class moduleWarehouse {
  state = () => {
    return {
      ...crudBase.state,
    }
  }
  actions = {
    ...crudBase.actions,
  }
}

const store = new moduleWarehouse();
const useStore = defineStore('moduleWarehouse', store);

export default useStore;