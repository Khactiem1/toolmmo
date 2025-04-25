import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/bus/companyInfoAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: "company_info_id",
      code: '',
    }
  },
  api,
);

class moduleCompanyInfo {
  state = () => {
    return {
      ...crudBase.state,
    }
  }
  actions = {
    ...crudBase.actions,
  }
}

const store = new moduleCompanyInfo();
const useStore = defineStore('moduleCompanyInfo', store);

export default useStore;