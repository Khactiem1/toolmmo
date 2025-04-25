import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/bus/contractTemplateAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: "contract_template_id",
      code: 'contract_template_code',
    }
  },
  api,
);

class moduleContractTemplate {
  state = () => {
    return {
      ...crudBase.state,
    }
  }
  actions = {
    ...crudBase.actions,
  }
}

const store = new moduleContractTemplate();
const useStore = defineStore('moduleContractTemplate', store);

export default useStore;