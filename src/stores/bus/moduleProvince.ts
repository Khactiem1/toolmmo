import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/bus/provinceAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: "province_id",
      code: 'province_code',
    }
  },
  api,
);

class moduleProvince {
  state = () => {
    return {
      ...crudBase.state,
    }
  }
  actions = {
    ...crudBase.actions,
  }
}

const store = new moduleProvince();
const useStore = defineStore('moduleProvince', store);

export default useStore;