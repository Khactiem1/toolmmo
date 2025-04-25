import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/bus/featurePackageAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: "feature_package_id",
      code: 'feature_package_code',
    }
  },
  api,
);

class moduleFeaturePackage {
  state = () => {
    return {
      ...crudBase.state,
    }
  }
  actions = {
    ...crudBase.actions,
  }
}

const store = new moduleFeaturePackage();
const useStore = defineStore('moduleFeaturePackage', store);

export default useStore;