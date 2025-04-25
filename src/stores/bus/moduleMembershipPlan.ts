import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/bus/membershipPlanAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: 'membership_plan_id',
      code: '',
    }
  },
  api,
);

class moduleMembershipPlan {
  state = () => {
    return {
      ...crudBase.state,
    }
  }
  actions = {
    ...crudBase.actions,
  }
}

const store = new moduleMembershipPlan();
const useStore = defineStore('moduleMembershipPlan', store);

export default useStore;