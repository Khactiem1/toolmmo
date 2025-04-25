import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/sys/languageAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: "language_id",
      code: 'language_code',
    }
  },
  api,
);

class moduleLanguage {
  state = () => {
    return {
      ...crudBase.state,
    }
  }
  actions = {
    ...crudBase.actions,
  }
}

const store = new moduleLanguage();
const useStore = defineStore('moduleLanguage', store);

export default useStore;