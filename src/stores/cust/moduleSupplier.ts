import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/cust/supplierAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: "supplier_id",
      code: '',
    }
  },
  api,
);

class moduleSupplier {
  state = () => {
    return {
      ...crudBase.state,
    }
  }
  actions = {
    ...crudBase.actions,
  }
}

const store = new moduleSupplier();
const useStore = defineStore('moduleSupplier', store);

export default useStore;