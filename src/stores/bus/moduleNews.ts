import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/bus/newsAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: "news_id",
      code: '',
    }
  },
  api,
);

class moduleNews {
  state = () => {
    return {
      ...crudBase.state,
    }
  }
  actions = {
    ...crudBase.actions,
  }
}

const store = new moduleNews();
const useStore = defineStore('moduleNews', store);

export default useStore;