import { BaseAPI } from '../base';
import { InnowayApiService } from '../../innoway-api.service';

export class ReponseObject {
  constructor(public code: number, public results: string) { }
}

export class FileUploader extends BaseAPI {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'file-uploader');
  }

  async uploadImage(file) {
    console.log('bambi sap upload');
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.imgur.com/3/image', false);
    xhr.setRequestHeader('Authorization', 'Client-ID d4de8224fa0042f');
    xhr.setRequestHeader('Content-Type', 'multipart/form-data');
    xhr.send(file);
    console.log('bambi da upload');
    const responseObject = JSON.parse(xhr.response);
    console.log('bambi sap upload', responseObject);
    return responseObject.data;
  }
}
