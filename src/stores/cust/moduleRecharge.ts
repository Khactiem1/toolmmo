import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/cust/rechargeAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: "recharge_id",
      code: '',
    }
  },
  api,
);

class moduleRecharge {
  state = () => {
    return {
      ...crudBase.state,
    }
  }
  actions = {
    ...crudBase.actions,
  }
}

const store = new moduleRecharge();
const useStore = defineStore('moduleRecharge', store);

export default useStore;