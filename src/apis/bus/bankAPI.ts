import baseApi from '@/apis/base/baseApi';
import httpClient from '@/apis/base/httpclient';

class bankAPI extends baseApi {
  apiName = 'dictionary';
  controllerName = 'Bank';

}

export default new bankAPI();