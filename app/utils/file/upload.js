/**
 * 文件上传相关
 * file_include,file_exclude,file_single_limit,file_total_limit,file_store_dir,siteDomain
 * id,path,type,name,extension,size,md5
 */
import uuid from 'uuid';
import moment from 'moment';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import { config } from '../config';
import { mkdirsSync } from '../fs-utils';

const baseDir = config.getItem('baseDir', process.cwd());

/**
 * 上传文件类，所有文件上传的基类
 */
export class Uploader {
  constructor(storeDir) {
    this.storeDir = storeDir;
  }
  /**
   * 处理文件对象
   * { size, encoding, fieldname, filename, mimeType, data }
   */
  async upload(files) {
    throw new Error('you must overload this method');
  }

  /**
   * 获得保存的路径名
   * @param filename 文件名
   */
  getStorePath(filename) {
    const filename2 = this.generateName(filename);
    const formatDay = this.getFormatDay();
    const dir = this.getExactStoreDir(formatDay);
    const exists = fs.existsSync(dir);
    if (!exists) {
      mkdirsSync(dir);
    }
    return {
      absolutePath: path.join(dir, filename2),
      relativePath: `${formatDay}/${filename2}`,
      realName: filename2,
    };
  }

  /**
   * 生成文件名
   * @param filename 文件名
   */
  generateName(filename) {
    const ext = path.extname(filename);
    return `${uuid.v4()}${ext}`;
  }

  /**
   * 获得确切的保存路径
   */
  getExactStoreDir(formatDay) {
    let storeDir = config.getItem('file.storeDir');
    if (!storeDir) {
      throw new Error('storeDir must not be undefined');
    }
    this.storeDir && (storeDir = this.storeDir);
    const extract = path.isAbsolute(storeDir)
      ? path.join(storeDir, formatDay)
      : path.join(baseDir, storeDir, formatDay);
    return extract;
  }

  /**
   * getFormatDay
   */
  getFormatDay() {
    return moment().format('YYYY/MM/DD');
  }

  /**
   * 生成图片的md5
   */
  generateMd5(item) {
    const buf = item.data;
    const md5 = crypto.createHash('md5');
    return md5.update(buf).digest('hex');
  }
}
