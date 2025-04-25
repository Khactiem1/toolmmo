import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/cust/registerPackageAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: "register_package_id",
      code: '',
    }
  },
  api,
);

class moduleRegisterPackage {
  state = () => {
    return {
      ...crudBase.state,
    }
  }
  actions = {
    ...crudBase.actions,
  }
}

const store = new moduleRegisterPackage();
const useStore = defineStore('moduleRegisterPackage', store);

export default useStore;