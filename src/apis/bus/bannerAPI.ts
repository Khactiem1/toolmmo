import baseApi from '@/apis/base/baseApi';
import httpClient from '@/apis/base/httpclient';

class bannerAPI extends baseApi {
  apiName = 'dictionary';
  controllerName = 'Banner';
  
}

export default new bannerAPI();