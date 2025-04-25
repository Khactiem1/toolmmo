import { defineStore } from 'pinia'
import crudBaseStore from '@/stores/crudBaseStore'
import api from '@/apis/sys/errorReportAPI';

const crudBase = new crudBaseStore(
  {
    field: {
      key: "error_report_id",
      code: '',
    }
  },
  api,
);

class moduleErrorReport {
  state = () => {
    return {
      ...crudBase.state,
    }
  }
  actions = {
    ...crudBase.actions,
  }
}

const store = new moduleErrorReport();
const useStore = defineStore('moduleErrorReport', store);

export default useStore;