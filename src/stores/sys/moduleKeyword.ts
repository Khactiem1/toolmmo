import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/sys/keywordAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: "keyword_id",
      code: '',
    }
  },
  api,
);

class moduleKeyword {
  state = () => {
    return {
      ...crudBase.state,
    }
  }
  actions = {
    ...crudBase.actions,
  }
}

const store = new moduleKeyword();
const useStore = defineStore('moduleKeyword', store);

export default useStore;