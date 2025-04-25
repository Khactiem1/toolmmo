import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/bus/quickLinkAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: "quick_link_id",
      code: '',
    }
  },
  api,
);

class moduleQuickLink {
  state = () => {
    return {
      ...crudBase.state,
    }
  }
  actions = {
    ...crudBase.actions,
  }
}

const store = new moduleQuickLink();
const useStore = defineStore('moduleQuickLink', store);

export default useStore;