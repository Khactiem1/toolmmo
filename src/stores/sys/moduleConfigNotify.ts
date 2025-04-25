import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/sys/configNotifyAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: "config_notify_id",
      code: 'config_notify_code',
    }
  },
  api,
);

class moduleConfigNotify {
  state = () => {
    return {
      ...crudBase.state,
    }
  }
  actions = {
    ...crudBase.actions,
  }
}

const store = new moduleConfigNotify();
const useStore = defineStore('moduleConfigNotify', store);

export default useStore;