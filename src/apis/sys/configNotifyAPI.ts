import baseApi from '@/apis/base/baseApi';
import httpClient from '@/apis/base/httpclient';

class configNotifyAPI extends baseApi {
  apiName = 'dictionary';
  controllerName = 'ConfigNotify';
  
}

export default new configNotifyAPI();