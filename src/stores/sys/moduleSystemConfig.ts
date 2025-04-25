import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/sys/systemConfigAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: "system_config_id",
      code: 'system_config_code',
    }
  },
  api,
);

class moduleSystemConfig {
  state = () => {
    return {
      ...crudBase.state,
    }
  }
  actions = {
    ...crudBase.actions,
  }
}

const store = new moduleSystemConfig();
const useStore = defineStore('moduleSystemConfig', store);

export default useStore;