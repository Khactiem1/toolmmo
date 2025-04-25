import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/bus/departmentAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: "department_id",
      code: 'department_code',
    }
  },
  api,
);

class moduleDepartment {
  state = () => {
    return {
      ...crudBase.state,
    }
  }
  actions = {
    ...crudBase.actions,
  }
}

const store = new moduleDepartment();
const useStore = defineStore('moduleDepartment', store);

export default useStore;