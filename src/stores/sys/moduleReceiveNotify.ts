import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/sys/receiveNotifyAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: "receive_notify_id",
      code: 'receive_notify_code',
    }
  },
  api,
);

class moduleReceiveNotify {
  state = () => {
    return {
      ...crudBase.state,
    }
  }
  actions = {
    ...crudBase.actions,
  }
}

const store = new moduleReceiveNotify();
const useStore = defineStore('moduleReceiveNotify', store);

export default useStore;