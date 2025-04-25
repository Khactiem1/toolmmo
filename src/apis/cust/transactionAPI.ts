import baseApi from '@/apis/base/baseApi';

class transactionAPI extends baseApi {
  apiName = 'dictionary';
  controllerName = 'Transaction';
}

export default new transactionAPI();