import baseApi from '@/apis/base/baseApi';
import httpClient from '@/apis/base/httpclient';

class errorReportAPI extends baseApi {
  apiName = 'dictionary';
  controllerName = 'ErrorReport';
  
}

export default new errorReportAPI();