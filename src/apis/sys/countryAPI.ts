import baseApi from '@/apis/base/baseApi';
import httpClient from '@/apis/base/httpclient';

class countryAPI extends baseApi {
  apiName = 'dictionary';
  controllerName = 'country';
  
}

export default new countryAPI();