import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/sys/functionConfigAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: "function_config_id",
      code: 'function_config_code',
    }
  },
  api,
);

class moduleFunctionConfig {
  state = () => {
    return {
      ...crudBase.state,
    }
  }
  actions = {
    ...crudBase.actions,
  }
}

const store = new moduleFunctionConfig();
const useStore = defineStore('moduleFunctionConfig', store);

export default useStore;