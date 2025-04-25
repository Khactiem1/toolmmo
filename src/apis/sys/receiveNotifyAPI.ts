import baseApi from '@/apis/base/baseApi';
import httpClient from '@/apis/base/httpclient';

class receiveNotifyAPI extends baseApi {
  apiName = 'dictionary';
  controllerName = 'ReceiveNotify';
  
}

export default new receiveNotifyAPI();