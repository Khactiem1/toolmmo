import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/cust/voucherEventAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: "voucher_event_id",
      code: 'voucher_event_code',
    }
  },
  api,
);

class moduleVoucherEvent {
  state = () => {
    return {
      ...crudBase.state,
    }
  }
  actions = {
    ...crudBase.actions,
  }
}

const store = new moduleVoucherEvent();
const useStore = defineStore('moduleVoucherEvent', store);

export default useStore;