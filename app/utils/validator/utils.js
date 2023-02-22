/**
 * 获取一个实例的所有方法
 * @param obj 对象实例
 * @param option 参数
 *
 * ```js
 *     let validateFuncKeys: string[] = getAllMethodNames(this, {
 *     filter: key =>
 *   /validate([A-Z])\w+/g.test(key) && typeof this[key] === "function"
 *  });
 * ```
 */
function getAllMethodNames(obj, option) {
  let methods = new Set();
  // tslint:disable-next-line:no-conditional-assignment
  while ((obj = Reflect.getPrototypeOf(obj))) {
    let keys = Reflect.ownKeys(obj);
    keys.forEach((k) => methods.add(k));
  }
  let keys = Array.from(methods.values());
  return prefixAndFilter(keys, option);
}

/**
 * 获得实例的所有字段名
 * @param obj 实例
 * @param option 参数项
 *
 * ```js
 *     let keys = getAllFieldNames(this, {
 *      filter: key => {
 *    const value = this[key];
 *    if (isArray(value)) {
 *      if (value.length === 0) {
 *      return false;
 *    }
 *    for (const it of value) {
 *       if (!(it instanceof Rule)) {
 *         throw new Error("every item must be a instance of Rule");
 *      }
 *    }
 *    return true;
 *   } else {
 *    return value instanceof Rule;
 *    }
 *   }
 *  });
 * ```
 */
function getAllFieldNames(obj, option) {
  let keys = Reflect.ownKeys(obj);
  return prefixAndFilter(keys, option);
}

function prefixAndFilter(keys, option) {
  option &&
    option.prefix &&
    (keys = keys.filter((key) => key.toString().startsWith(option.prefix)));
  option && option.filter && (keys = keys.filter(option.filter));
  return keys;
}

module.exports = {
  getAllMethodNames,
  getAllFieldNames
};
