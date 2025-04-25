import baseApi from '@/apis/base/baseApi';
import httpClient from '@/apis/base/httpclient';
import commonFn from '@/commons/commonFunction';
import axios from 'axios';

class fileAPI extends baseApi {
  apiName = 'file';
  controllerName = 'FileManagement';

  //khởi tạo ApiUrl
	//API được khởi tạo dựa trên apiName
	initAPI() {
		if (this.apiName) {
			this.baseUrl = window._apis[this.apiName] + 'api/v1/' + this.controllerName;
		}
	}

  /**
   * Get ra url nối với fileName
   */
  getUrlViewFile(): string{
    return window._apis['file'] + `storage`;
  };

  /**
   * Get ra url file để view
   */
  getFileViewUrl(fileName){
    return window._apis['file'] + `storage${fileName}`;
  }
  
  /**
   * Tải file lên server
   */
  async uploadFile(file: any, path: string, isUploadKeepNameFile: boolean = false) {
    const formData = new FormData();

    // Thêm file vào formData
    formData.append('file', file);
    const user = commonFn.getUser();
    
    // Gửi file lên server
    const result = await axios.post(this.getAPIUrl() + `/upload?path=${path}&isUploadKeepNameFile=${isUploadKeepNameFile}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${user.access_token}`,
      }
    })
    if(result?.data){
      return result.data;
    }
    return {};
  }

  /**
   * Xoá file theo đường dẫn
   */
  async deleteFile(path: any){
    let request = {
      url: this.getAPIUrl() + `/?path=${path}`,
    };
    return await httpClient.deleteAsync(request);
  }

  /**
   * Xoá file theo đường dẫn
   */
  async getAllFileInPath(path: string){
    let request = {
      url: this.getAPIUrl() + `/?path=${path}`,
    };
    return await httpClient.getAsync(request);
  } 
}

export default new fileAPI();
