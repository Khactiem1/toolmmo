import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/bus/paymentMethodAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: "payment_method_id",
      code: 'payment_method_code',
    }
  },
  api,
);

class modulePaymentMethod {
  state = () => {
    return {
      ...crudBase.state,
    }
  }
  actions = {
    ...crudBase.actions,
  }
}

const store = new modulePaymentMethod();
const useStore = defineStore('modulePaymentMethod', store);

export default useStore;