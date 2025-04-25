import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/sys/jobDefinitionAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: "job_definition_id",
      code: 'job_definition_code',
    }
  },
  api,
);

class moduleJobDefinition {
  state = () => {
    return {
      ...crudBase.state,
    }
  }
  actions = {
    ...crudBase.actions,
  }
}

const store = new moduleJobDefinition();
const useStore = defineStore('moduleJobDefinition', store);

export default useStore;