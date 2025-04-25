import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/cust/emoticonAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: "emoticon_id",
      code: 'emoticon_code',
    }
  },
  api,
);

class moduleEmoticon {
  state = () => {
    return {
      ...crudBase.state,
    }
  }
  actions = {
    ...crudBase.actions,
  }
}

const store = new moduleEmoticon();
const useStore = defineStore('moduleEmoticon', store);

export default useStore;