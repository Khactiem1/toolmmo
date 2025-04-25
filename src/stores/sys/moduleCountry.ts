import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/sys/countryAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: "country_id",
      code: '',
    }
  },
  api,
);

class moduleCountry {
  state = () => {
    return {
      ...crudBase.state,
    }
  }
  actions = {
    ...crudBase.actions,
  }
}

const store = new moduleCountry();
const useStore = defineStore('moduleCountry', store);

export default useStore;