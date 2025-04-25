import baseApi from '@/apis/base/baseApi';
import httpClient from '@/apis/base/httpclient';

class paymentMethodAPI extends baseApi {
  apiName = 'dictionary';
  controllerName = 'PaymentMethod';
  
}

export default new paymentMethodAPI();