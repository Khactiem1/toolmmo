import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/cust/voucherAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: "voucher_id",
      code: 'voucher_code',
    }
  },
  api,
);

class moduleVoucher {
  state = () => {
    return {
      ...crudBase.state,
    }
  }
  actions = {
    ...crudBase.actions,
  }
}

const store = new moduleVoucher();
const useStore = defineStore('moduleVoucher', store);

export default useStore;