import baseApi from '@/apis/base/baseApi';
import httpClient from '@/apis/base/httpclient';

class systemConfigAPI extends baseApi {
  apiName = 'dictionary';
  controllerName = 'SystemConfig';
  
}

export default new systemConfigAPI();