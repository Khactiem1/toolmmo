import baseApi from '@/apis/base/baseApi';

class registerPackageAPI extends baseApi {
  apiName = 'dictionary';
  controllerName = 'RegisterPackage';
}

export default new registerPackageAPI();