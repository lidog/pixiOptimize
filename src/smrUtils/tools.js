
const Util = {
  /**
   * 存储localStorage数据
   */
  saveLocalData: function (item, value) {
    if (item && value) {
      localStorage.setItem(item, value);
    }
  },
  /**
   * 获取localStorage数据
   */
  getLocalData: function (item) {
    return localStorage.getItem(item);
  },
  /**
   * 删除localStorage数据
   */
  removeLocalData: function (item) {
    return localStorage.removeItem(item);
  },
  /**
   * 清除localStorage数据
   */
  clearLocalData: function () {
    return localStorage.clear();
  },
  /**
   * 
   */
  getMaxFromArray: function (array) {
    return Math.max.apply(Math, array);
  },
  getMinFromArray: function (array) {
    return Math.min.apply(Math, array)
  }
}
export default Util