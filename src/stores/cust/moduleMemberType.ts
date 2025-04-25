import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/cust/memberTypeAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: "member_type_id",
      code: 'member_type_code',
    }
  },
  api,
);

class moduleMemberType {
  state = () => {
    return {
      ...crudBase.state,
    }
  }
  actions = {
    ...crudBase.actions,
  }
}

const store = new moduleMemberType();
const useStore = defineStore('moduleMemberType', store);

export default useStore;