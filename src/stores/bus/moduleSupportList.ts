import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/bus/supportListAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: "support_list_id",
      code: '',
    }
  },
  api,
);

class moduleSupportList {
  state = () => {
    return {
      ...crudBase.state,
    }
  }
  actions = {
    ...crudBase.actions,
  }
}

const store = new moduleSupportList();
const useStore = defineStore('moduleSupportList', store);

export default useStore;