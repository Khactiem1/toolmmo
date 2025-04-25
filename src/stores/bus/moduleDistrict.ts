import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/bus/districtAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: "district_id",
      code: 'district_code',
    }
  },
  api,
);

class moduleDistrict {
  state = () => {
    return {
      ...crudBase.state,
    }
  }
  actions = {
    ...crudBase.actions,
  }
}

const store = new moduleDistrict();
const useStore = defineStore('moduleDistrict', store);

export default useStore;