import Vue from "vue";
// v-drag: 弹窗拖拽+水平方向伸缩+对角线拉伸
Vue.directive("drag", {
  bind(el) {
    // el为指令绑定dom元素
    // dialogHeaderEl为标题栏，绑定mousedown事件进行拖拽
    const dialogHeaderEl = el.querySelector(".title");
    // dragDom为指令绑定dom元素，定义变量便于区分
    const dragDom = el;
    // 获取css所有属性兼容性写法 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null);
    // 定义鼠标按下事件
    const moveDown = (e) => {
      const clientX = e.clientX || e.changedTouches[0].clientX;
      const clientY = e.clientY || e.changedTouches[0].clientY;
      // e.clientX，Y：鼠标相对于浏览器可视窗口的X，Y坐标
      // offsetTop，offsetLeft：当前元素相对于其offsetParent元素的顶部，左边的距离，这里title无定位偏移，故为0
      const disX = clientX - dialogHeaderEl.offsetLeft; // 元素相对位置
      const disY = clientY - dialogHeaderEl.offsetTop; // 元素相对位置

      const screenWidth =
        document.documentElement.clientWidth || document.body.clientWidth; // 页面可视区宽度，兼容写法
      const screenHeight =
        document.documentElement.clientHeight || document.body.clientHeight; // 页面可视区高度，兼容写法

      const dragDomWidth = dragDom.offsetWidth; // 对话框宽度
      const dragDomheight = dragDom.offsetHeight; // 对话框高度

      const minDragDomLeft = dragDom.offsetLeft; // 对话框边界最小left值
      const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth; // 对话框边界最大left值

      const minDragDomTop = dragDom.offsetTop; // 对话框边界最小Top值
      const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomheight; // 对话框边界最大Top值
      // 获取到的值带px 正则匹配替换
      let styL = sty.left;

      // 为兼容ie
      if (styL === "auto") styL = "0px";
      let styT = sty.top;

      // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
      if (sty.left.includes("%")) {
        styL = +document.body.clientWidth * (+styL.replace(/%/g, "") / 100);
        styT = +document.body.clientHeight * (+styT.replace(/%/g, "") / 100);
      } else {
        styL = +styL.replace(/\px/g, "");
        styT = +styT.replace(/\px/g, "");
      }

      const onmousemove = function (e) {
        const clientX = e.clientX || e.changedTouches[0].clientX;
        const clientY = e.clientY || e.changedTouches[0].clientY;
        // 通过事件委托，计算移动的距离
        let left = clientX - disX;
        let top = clientY - disY;

        // 边界处理
        if (-left > minDragDomLeft) {
          left = -minDragDomLeft;
        } else if (left > maxDragDomLeft) {
          left = maxDragDomLeft;
        }

        if (-top > minDragDomTop) {
          top = -minDragDomTop;
        } else if (top > maxDragDomTop) {
          top = maxDragDomTop;
        }

        // 移动当前元素
        dragDom.style.left = `${left + styL}px`;
        dragDom.style.top = `${top + styT}px`;

        // 将此时的位置传出去
        // binding.value({x:e.pageX,y:e.pageY})
      };
      document.onmousemove = onmousemove;
      document.addEventListener("touchmove", onmousemove, { passive: false });
      // 鼠标抬起停止弹窗移动
      const onmouseup = function () {
        document.onmousemove = null;
        document.onmouseup = null;
        document.removeEventListener("touchmove", onmousemove);
        document.removeEventListener("touchend", onmouseup);
      };
      document.onmouseup = onmouseup;
      document.addEventListener("touchend", onmouseup, { passive: false });
    };
    dialogHeaderEl.addEventListener("touchstart", moveDown, { passive: false });
    dialogHeaderEl.onmousedown = moveDown;

    // 定义鼠标悬停样式
    const CURSORTYPE = {
      top: "n-resize",
      bottom: "s-resize",
      left: "w-resize",
      right: "e-resize",
      right_top: "ne-resize", // right_top写法是便于后面代码数据处理
      left_top: "nw-resize",
      left_bottom: "sw-resize",
      right_bottom: "se-resize",
      default: "default",
    };

    // 判断鼠标悬浮指针类型
    const checkType = (obj) => {
      const { x, y, left, top, width, height } = obj;
      let type;
      if (
        x > left + width - 5 &&
        el.scrollTop + y <= top + height - 5 &&
        top + 5 <= y
      ) {
        type = "right";
      } else if (
        left + 5 > x &&
        el.scrollTop + y <= top + height - 5 &&
        top + 5 <= y
      ) {
        type = "left";
      } else if (
        el.scrollTop + y > top + height - 5 &&
        x <= left + width - 5 &&
        left + 5 <= x
      ) {
        type = "bottom";
      } else if (top + 5 > y && x <= left + width - 5 && left + 5 <= x) {
        type = "top";
      } else if (x > left + width - 5 && el.scrollTop + y > top + height - 5) {
        type = "right_bottom";
      } else if (left + 5 > x && el.scrollTop + y > top + height - 5) {
        type = "left_bottom";
      } else if (top + 5 > y && x > left + width - 5) {
        type = "right_top";
      } else if (top + 5 > y && left + 5 > x) {
        type = "left_top";
      }
      return type || "default";
    };
    // 判断边界条件
    const boundaryLimit = (obj) => {
      const {
        left,
        top,
        width,
        height,
        diffX,
        diffY,
        screenHeight,
        screenWidth,
        arr,
      } = obj;
      if (arr[0] == "right" || arr[1] == "right") {
        if (width + diffX > screenWidth - left) {
          dragDom.style.width = screenWidth - left + "px";
        } else {
          dragDom.style.width = width + diffX + "px";
        }
      }
      if (arr[0] == "left" || arr[1] == "left") {
        if (width - diffX > width + left) {
          dragDom.style.width = width + left + "px";
          dragDom.style.left = -parseInt(sty.marginLeft) + "px";
        } else {
          dragDom.style.width = width - diffX + "px";
          // left实际 = left + marginLeft 计算时需要将marginLeft减掉
          dragDom.style.left = left + diffX - parseInt(sty.marginLeft) + "px";
        }
      }
      if (arr[0] == "top" || arr[1] == "top") {
        if (height - diffY > height + top) {
          dragDom.style.height = height + top + "px";
          dragDom.style.top = -parseInt(sty.marginTop) + "px";
        } else {
          dragDom.style.height = height - diffY + "px";
          // top实际 = top + marginTop 计算时需要将marginTop减掉
          dragDom.style.top = top + diffY - parseInt(sty.marginTop) + "px";
        }
      }
      if (arr[0] == "bottom" || arr[1] == "bottom") {
        if (height + diffY > screenHeight - top) {
          dragDom.style.height = screenHeight - top;
        } else {
          dragDom.style.height = height + diffY + "px";
        }
      }
    };

    const onmousemove = function (e) {
      const x = e.clientX || e.changedTouches[0].clientX;
      const y = e.clientY || e.changedTouches[0].clientY;
      const left = dragDom.offsetLeft;
      const top = dragDom.offsetTop;
      const width = dragDom.clientWidth;
      const height = dragDom.clientHeight;
      let type = checkType({ x, y, left, top, width, height });
      dragDom.style.cursor = CURSORTYPE[type] || "default";
    };
    dragDom.onmousemove = onmousemove;
    dragDom.addEventListener("touchmove", onmousemove, { passive: false });
    const onmousedown = (e) => {
      // 单击置顶
      let arr = document.querySelectorAll(".parameter");
      arr.forEach((i) => {
        i.style.zIndex = 1000;
      });
      dragDom.style.zIndex = 1001;

      const x = e.clientX || e.changedTouches[0].clientX;
      const y = e.clientY || e.changedTouches[0].clientY;
      const width = dragDom.clientWidth;
      const height = dragDom.clientHeight;
      const left = dragDom.offsetLeft;
      const top = dragDom.offsetTop;
      const screenWidth =
        document.documentElement.clientWidth || document.body.clientWidth;
      const screenHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      // dragDom.style.userSelect = 'none'
      let type = checkType({ x, y, left, top, width, height });
      // 判断是否为弹窗头部
      if (
        x > left &&
        x < left + width &&
        y > top + 5 &&
        y < top + dialogHeaderEl.clientHeight
      ) {
        // dialogHeaderEl.onmousedown = moveDown
      } else {
        const onmousemove = function (e) {
          // 移动时禁用默认事件
          e.preventDefault();
          let endX = e.clientX || e.changedTouches[0].clientX;
          let endY = e.clientY || e.changedTouches[0].clientY;
          let diffX = endX - x;
          let diffY = endY - y;
          let arr;
          // 将type转换为数组格式，简化代码判断调用即可
          if (type.indexOf("_") == -1) {
            arr = [type, ""];
          } else {
            arr = type.split("_");
          }
          boundaryLimit({
            left,
            top,
            width,
            height,
            diffX,
            diffY,
            screenHeight,
            screenWidth,
            arr,
          });
        };
        document.onmousemove = onmousemove;
        document.addEventListener("touchmove", onmousemove, { passive: false });
        // 拉伸结束
        const onmouseup = function () {
          document.onmousemove = null;
          document.onmouseup = null;
          document.removeEventListener("touchmove", onmousemove);
          document.removeEventListener("touchend", onmouseup);
        };
        document.onmouseup = onmouseup;
        document.addEventListener("touchend", onmouseup, { passive: false });
      }
    };
    dragDom.onmousedown = onmousedown;
    dragDom.addEventListener("touchstart", onmousedown, { passive: false });
  },
});
