import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/bus/newsListAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: "news_list_id",
      code: '',
    }
  },
  api,
);

class moduleNewsList {
  state = () => {
    return {
      ...crudBase.state,
    }
  }
  actions = {
    ...crudBase.actions,
  }
}

const store = new moduleNewsList();
const useStore = defineStore('moduleNewsList', store);

export default useStore;