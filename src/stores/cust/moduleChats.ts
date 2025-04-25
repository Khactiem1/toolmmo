import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/cust/chatsAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: "message_id",
      code: '',
    }
  },
  api,
);

class moduleChats {
  state = () => {
    return {
      ...crudBase.state,
    }
  }
  actions = {
    ...crudBase.actions,
  }
}

const store = new moduleChats();
const useStore = defineStore('moduleChats', store);

export default useStore;