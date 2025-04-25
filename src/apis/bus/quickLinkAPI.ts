import baseApi from '@/apis/base/baseApi';
import httpClient from '@/apis/base/httpclient';

class quickLinkAPI extends baseApi {
  apiName = 'dictionary';
  controllerName = 'QuickLink';
  
}

export default new quickLinkAPI();