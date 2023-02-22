const path = require('path');
const { merge, get, has, set } = require('lodash');

/**
 * Config类的实现
 * 帮助应用从文件中读取配置，目前仅支持从js文件中读取配置，加入json，yml
 *
 * ```js
 * const config = new Config();
 * config.getConfigFromFile("path/file");
 * ```
 *
 * 当然也支持从object对象中获取配置
 * ```js
 * config.getConfigFromObj({...});
 * ```
 *
 * 获取配置项
 * ```js
 * config.getItem("key");
 * ```
 */
class Config {
  constructor() {
    /**
     * 存储配置的容器
     */
    this.store = {};

    /**
     * 默认环境变量的前缀为starter
     */
    this._prefix = 'starter';

    this.envSuffix = '_ENV';

    /**
     * 当前工作目录
     */
    this.baseDir = process.cwd();
  }

  /**
   * 初始化工作目录
   * @param baseDir 工作目录
   */
  init(baseDir = process.cwd()) {
    this.baseDir = baseDir;
  }

  /**
   * 获取单个的配置项
   * ```js
   * const val = config.getItem("key");
   * ```
   *
   * 支持传入默认值，如果不存在该配置项，则返回传入的默认值
   *
   * ```js
   * const val = config.getItem("key","default");
   * // 如果config中存在key的配置项，则返回其配置项
   * // 否则返回 "default"
   * ```
   *
   * @param key 配置项的路径
   * @param defaultVal 可选参数，默认值
   */
  getItem(key, defaultVal) {
    return get(this.store, key, defaultVal);
  }

  /**
   * 检查是否存在某个配置项
   *
   * ```js
   * const exit = config.hasItem("key");
   * // 如果存在 exit 为true
   * // 不存在，则exit 为false
   * ```
   * @param key 配置项的路径
   */
  hasItem(key) {
    return has(this.store, key);
  }

  /**
   * 通过硬编码的方式设置配置项
   *
   * ```js
   * config.setItem("name","pedro");
   * // 设置 name 配置项的值为 pedro
   * // 如果config中已存在这个配置项，则覆盖原有的
   * ```
   * @param key 配置项的键
   * @param val 配置项的值
   */
  setItem(key, val) {
    set(this.store, key, val);
  }

  /**
   * 从js文件中导入配置
   *
   * ```js
   * config.getConfigFromFile("path/file");
   * ```
   * @param filepath js文件的路径，相对当前工作目录的路径
   */
  getConfigFromFile(filepath) {
    const mod = require(path.resolve(this.baseDir, filepath));
    this.store = merge(this.store, mod);
  }

  /**
   * 从object对象中导入配置
   *
   * ```js
   * config.getConfigFromObj({...});
   * ```
   * @param obj 配置对象 ，如 {}
   */
  getConfigFromObj(obj) {
    this.store = merge(this.store, obj);
  }

  /**
   * 判断是何种环境变量，默认为 debug
   */
  getEnv() {
    const env = this.getItem(this.prefix + this.envSuffix);
    return env && env.toLowerCase();
  }

  /**
   * 判断是否为debug环境
   */
  isDebug() {
    return this.getEnv() === 'debug';
  }

  /**
   * 从环境变量里面读取配置，只读取以 @prefix 开头的变量名
   */
  getConfigFromEnv() {
    const envs = {
      [this._prefix + this.envSuffix]: 'debug'
    };
    Object.keys(process.env).forEach((key) => {
      if (key.startsWith(this.prefix)) {
        const parts = key.split('_');
        if (parts.length === 2) {
          set(envs, parts[1], process.env[key]);
        } else if (parts.length > 2) {
          let k = key.replace(`${this.prefix}_`, '');
          k = k.replace('_', '.');
          set(envs, k, process.env[key]);
        }
      }
    });
    this.store = merge(this.store, envs);
  }

  get prefix() {
    return this._prefix;
  }

  set prefix(value) {
    this._prefix = value;
  }
}

module.exports = { Config };
