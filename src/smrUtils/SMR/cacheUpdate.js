/**
 * 更新内存数据
 * @param {Array} cacheList     内存中数据的引用
 * @param {Array} operatedList  操作数据
 * @param {String} operation    操作类型
 * @param {String} key          查询字段
 */
function UpdateCacheList(cacheList, operatedList, operation, key) {
  //   let CacheHiatus = false;

  if (operation == "insert") {
    operatedList.forEach((element) => {
      let index = cacheList.findIndex((f) => f[key] === element[key]);
      if (index == -1) {
        cacheList.push(element);
      }
    });
  } else if (operation == "update") {
    operatedList.forEach((element) => {
      let index = cacheList.findIndex((f) => f[key] === element[key]);
      if (index > -1) {
        cacheList.splice(index, 1, element);
      }
      //内存中没有,eg:删除后恢复   则添加 ?
      else {
        cacheList.push(element);
        // CacheHiatus = true;
      }
    });
  } else if (operation == "delete") {
    operatedList.forEach((element) => {
      let index = cacheList.findIndex((f) => f[key] === element[key]);
      if (index > -1) {
        cacheList.splice(index, 1);
      }
    });
  }

  return cacheList;
}

/**
 * 级联更新受控航班
 * @param {*} cacheList     受控航班
 * @param {*} operatedList  变更的航班信息/流控信息
 * @param {*} operation     操作类型
 * @param {*} key           查询字段
 */
function UpdateCacheRelated(cacheList, operatedList, operation, key) {
  //key对应字段
  const mapKey = {
    flightId: [
      "callsign",
      "adep",
      "ades",
      "ttot",
      "stateTime",
      "stripState",
      "isAbolishFlag",
      "isDeleteFlag",
      "typeFlag",
    ],
    limitID: ["reason", "endTime", "deleteFlag"],
  };

  if (operation == "delete") {
    operatedList.forEach((element) => {
      cacheList = cacheList.filter((item) => item[key] !== element[key]);
    });
  }
  if (operation == "update") {
    operatedList.forEach((element) => {
      cacheList = cacheList.map((item) => {
        if (item[key] === element[key]) {
          for (let updateKey of mapKey[key]) {
            item[updateKey] = element[updateKey];
          }
        }
        return item;
      });
    });
  }
}

export default {
  UpdateCacheList,
  UpdateCacheRelated,
};
