// 平铺数据结构
export const flatTree = function flatTree(data, childField = 'children', needChildField = true) {
  return data.reduce(function(prev, next) {
    prev.push(next);

    if (next[childField]) {
      const arr = flatTree(next[childField], childField);
      arr.forEach(function(item) {
        return prev.push(item);
      });
    }
    needChildField && delete next[childField];

    return prev;
  }, []);
};

// 获取指定索引所以子数据
export const flatTreeMap = function flatTreeMap(
  data,
  valueField,
  childrenField, // parentField: string,
  mapValue = null,
  map,
) {
  if (map === void 0) {
    map = new Map();
  }

  for (let index = 0; index < data.length; index++) {
    const item = data[index];
    map.set(item[valueField], mapValue ? item[mapValue] : item);
    const children = item[childrenField];

    if (children && (0, Array.isArray)(children)) {
      flatTreeMap(children, valueField, childrenField, mapValue, map);
    }
  }

  return map;
};
