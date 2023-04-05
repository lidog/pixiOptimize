/* eslint-disable no-unused-vars */
import { Graphics, Text, TextStyle, Ticker } from 'pixi.js'
import { GlowFilter } from 'pixi-filters';
import Bus from '@/utils/bus'
/**
 * 全局变量
 */
// const container_nsac = new Container()
// const container_nsac_text = new Container()
const NSAC_Arr = [];
let current_nsac;

const ticker_nsac = new Ticker();//Ticker.shared;
const g_TICK_nsac = 400; // 1000/40 = 25 frames per second 
let g_Time_nsac = 0;
const glowFilter = new GlowFilter({
  distance: 10,
  outerStrength: 4,
  innerStrength: 1,
  color: 0xffffff,
  quality: 0.7,
  knockout: false
});
const filter_objArr = [];

let ws_nsac;

/**
 * websocket 
 */
// ws_nsac = new WebSocket("ws://188.1.34.158:8091");

// ws_nsac.onopen = function () {
//   ws_nsac.send("frontEnd sending data...");
//   console.log("frontEnd sending data...");
// }

// ws_nsac.onmessage = function (evt) {
//   let received_msg = evt.data;
//   console.log("received data from backEnd!")
//   console.log(received_msg);

//   const reader = new FileReader();
//   let result = null;
//   if (received_msg instanceof Blob) {
//     reader.readAsText(received_msg, "UTF-8");
//     reader.onload = (e) => {
//       // result = JSON.parse(reader.result);
//       console.log('result:', reader.result);
//       // onMessage_nonSuspendAirConstruction(JSON.parse(reader.result))
//     }
//   }

// }


//接受不停航施工作业消息
function onMessage_nonSuspendAirConstruction (objArr) {
  for (let i = 0; i < objArr.length; i++) {
    NSAC_Arr.push(objArr[i]);
  }
  drawConstructionArea();
}

// 寻找多边形的顶点，并返回其中一个
function findCorners (ptArr) {
  let topLeftPoint = [];

  let minY = ptArr[1];
  let minY_X = ptArr[0];

  for (let i = 0; i < ptArr.length; i += 2) {
    let pt_X = ptArr[i];
    let pt_Y = ptArr[i + 1];

    if ((pt_Y < minY) || ((pt_Y == minY) && (pt_X < minY_X))) {
      minY = pt_Y;
      minY_X = pt_X;
    }
  }

  topLeftPoint.push(minY_X);
  topLeftPoint.push(minY);

  return topLeftPoint;
}

//绘制施工区域
function drawConstructionArea () {
  // NSAC_Arr = sNSAC_Arr;
  // if (!container_nsac) {
  //     container_nsac = new Container();
  //     container_nsac.x = CanAixCX;
  //     container_nsac.y = CanAixCY;
  //     surface.addChild(container_nsac);
  // }

  // if (!container_nsac_text) {
  //     container_nsac_text = new Container();
  //     container_nsac_text.x = CanAixCX;
  //     container_nsac_text.y = CanAixCY;
  //     surface.addChild(container_nsac_text);
  // }

  for (let j = 0; j < NSAC_Arr.length; j++) {
    let NSAC_Obj = NSAC_Arr[j];

    drawSingleConstruction(NSAC_Obj);
  }
}

//绘制单个施工区域
function drawSingleConstruction (NSAC_Obj, container_nsac) {
  // const NSAC_Obj = JSON.parse(JSON.stringify(nObj))
  let state = NSAC_Obj.state;
  let ptArr = NSAC_Obj.ptArr;
  let id = NSAC_Obj.id;

  if (!NSAC_Arr.find(element => element.id == id)) {
    NSAC_Arr.push(NSAC_Obj)
  }
  let poly = container_nsac.children.find(element => element.name == id);

  if (poly) {
    poly.clear();
  } else {
    poly = new Graphics();
    container_nsac.addChild(poly);
  }

  poly.name = id;

  let lineStyle;
  let fillColor, fillAlpha;
  let text, textColor;

  switch (state) {
    case 0:
      lineStyle = {
        width: 2,
        color: 0xff0000,
        alpha: 1
      };
      fillColor = 0xff0000;
      fillAlpha = 0;
      text = '待审批';
      textColor = '#ff0000';
      break;
    case 1:
      lineStyle = {
        width: 2,
        color: 0xff0000,
        alpha: 1
      };
      fillColor = 0xff0000;
      fillAlpha = 0;
      text = '已发布';
      textColor = '#ff0000';
      break;
    case 2:
      lineStyle = {
        width: 2,
        color: 0xff0000,
        alpha: 0
      };
      fillColor = 0xff0000;
      fillAlpha = 1;
      text = '已生效';
      textColor = '#ff0000';
      break;
    case 3:
      lineStyle = {
        width: 2,
        color: 0x000000,
        alpha: 1
      };
      fillColor = 0x00ff00;
      fillAlpha = 0;
      text = '失效确认';
      textColor = '#000000'//'#808080';
      break;
    case 4:
      lineStyle = {
        width: 2,
        color: 0x000000,
        alpha: 1
      };
      fillColor = 0x00ff00;
      fillAlpha = 0;
      text = '已失效';
      textColor = '#000000'//'#808080';
      break;
  }

  poly.lineStyle(lineStyle);
  if (state > 0) {
    poly.beginFill(fillColor, fillAlpha);
    poly.drawPolygon(ptArr);
    poly.endFill();
  } else {
    poly.drawDashedPolygon(ptArr, 0, 0, 0, 10, 5, 0);
  }

  let topLeftPoint = findCorners(NSAC_Obj.ptArr);

  if (state == 1) {
    var nowtime = new Date();
    var endtime = new Date(NSAC_Obj.beginTime);
    var lefttime = parseInt((endtime.getTime() - nowtime.getTime()) / 1000);

    if (lefttime > 0) {
      let mm = addZero(parseInt(lefttime / 60 % 60));
      let hh = addZero(parseInt(lefttime / (60 * 60)));
      let ss = addZero(parseInt(lefttime % 60));

      drawText(poly, `${hh}:${mm}:${ss}`, '#ff0000', findCorners(NSAC_Obj.ptArr));

      countDown_begin(NSAC_Obj, container_nsac, function (obj, str) {
        drawText(poly, str, '#ff0000', findCorners(obj.ptArr));
      }, function (obj, container) {
        stopTwinkle(obj, container);
        obj.state = 2;
        drawSingleConstruction(obj, container);
      });
    }
  } else if (state == 2) {
    // let richText = poly.children.find(element => element.name == id);
    // richText.visible = false;
    drawText(poly, text, textColor, topLeftPoint)

    //结束倒计时
    countDown_end(NSAC_Obj, function (obj) {
      obj.state = 3;
      obj.closeTime = new Date();
      drawSingleConstruction(obj, container_nsac);
    });
  } else if (state == 4) {
    drawText(poly, text, textColor, topLeftPoint);
    //失效倒计时
    countDown_close(NSAC_Obj, function (obj) {
      let poly = container_nsac.children.find(element => element.name == obj.id);
      // let richText = poly.children.find(element => element.name == id);

      poly.destroy();
      // richText.destroy();
      container_nsac.removeChild(poly)
      for (let len = NSAC_Arr.length, i = 0; i < len; i++) {
        if (NSAC_Arr[i].id == NSAC_Obj.id) {
          NSAC_Arr.splice(i, 1)
        }
        break
      }
    });
  } else {
    drawText(poly, text, textColor, topLeftPoint);
  }

  // if(poly.children.length > 0){
  //     for(let len = poly.children.length, i=0; i<len; i++){
  //         poly.children[i].destroy()
  //     }        
  // }

  // let richText = drawText(poly, text, textColor, topLeftPoint)
  // poly.addChild(richText)
  poly.scale.set(1, -1)

  return poly
}

//绘制文本
function drawText (poly, text, color, position) {
  let existText = poly.children.find(element => element.name == 'hint');
  if (existText) {
    poly.removeChild(existText);
  }

  const textStyle = new TextStyle({
    fontFamily: 'FZLANTY_ZHUNK--GBK1-0',
    fontSize: 20,
    // fontStyle: 'italic',
    // fontWeight: 'bold',
    fill: [color], // gradient
    stroke: color,
    strokeThickness: 1,
    // wordWrap: true,
    // wordWrapWidth: 440,
    // lineJoin: 'round',
    letterSpacing: 0,
    lineHeight: 9.75,
    fontWeight: 400
  });

  const richText = new Text(text, textStyle);
  poly.addChild(richText);

  const offset = 5;
  richText.x = position[0] - richText.width - offset;
  richText.y = position[1] - 24 - offset;

  richText.name = 'hint';

  richText.interactive = true;
  richText.cursor = 'pointer'

  /**
   * TODO
   * 修改为触摸事件
   */
  richText.on('pointerdown', (ev) => { textPointerDown(ev) });

  // return richText
}

//文本触点事件
function textPointerDown (ev) {
  // console.log('ev:',ev);
  // console.log('target:',ev.target.parent);
  current_nsac = NSAC_Arr.find(element => element.id == ev.target.parent.name);
  // console.log('current_nsac',current_nsac)
  Bus.$emit('nsacTextClicked', current_nsac)

  // let msg = `<div style="border-bottom:1px solid #000;">施工作业</div><div><div style="text-align:left;">`
  //     + `<div><span>施工区域：</span><span>${current_nsac.area.toString()}</span></div>`
  //     + `<div><span>作业名称：</span><span>${current_nsac.name}</span></div>`
  //     + `<div><span>开始时间：</span><span>${current_nsac.beginTime}</span></div>`
  //     + `<div><span>结束时间：</span><span>${current_nsac.endTime}</span></div>`
  //     + `<div><span>所属部门：</span><span>${current_nsac.dept}</span></div>`
  //     + `<div><span>车辆避让：</span><span>${current_nsac.vehicleAvoid ? '是' : '否'}</span></div>`
  //     + `<div><span>影响运行：</span><span>${current_nsac.affectOperation ? '是' : '否'}</span></div>`
  //     + `<div><span>施工进度：</span><span>${current_nsac.progress}</span></div>`
  //     + `<div><span>航行通告：</span><span>${current_nsac.navigationNotice}</span></div>`
  //     + `</div></div>`;

  // switch (current_nsac.state) {
  //     case 0:
  //         layer.msg(msg, {
  //             time: 0,
  //             area: '340px',
  //             btn: ['审批', '取消'],
  //             btnAlign: 'c',
  //             closeBtn: 0,
  //             // title: ['施工作业','font-family: MicrosoftYaHei-Bold;font-size: 14px;color: #D7D7D7;background: rgba(66,66,66,0.80);border: 1px solid rgba(51,51,51,1);border-radius: 2px;'],
  //             yes: function (index, layero) {
  //                 current_nsac.state = 1;
  //                 //TODO 测试用代码，需删除
  //                 let now = new Date();
  //                 current_nsac.beginTime = new Date(now.getTime() + 1000 * 20);
  //                 current_nsac.endTime = new Date(now.getTime() + 1000 * 30);

  //                 drawSingleConstruction(current_nsac);
  //                 app.renderer.render(app.stage);
  //                 layer.close(index);
  //             }
  //         });
  //         break;
  //     case 1:
  //     case 2:
  //         layer.msg(msg, {
  //             time: 0,
  //             area: '340px',
  //             btn: ['取消'],
  //             btnAlign: 'c',
  //             closeBtn: 0
  //         });
  //         break;
  //     case 3:
  //         layer.msg(`确认是否已经失效？`, {
  //             time: 0,
  //             btn: ['确定', '取消'],
  //             btnAlign: 'c',
  //             closeBtn: 0,
  //             shadeClose: true,
  //             // title: ['施工作业','font-family: MicrosoftYaHei-Bold;font-size: 14px;color: #D7D7D7;background: rgba(66,66,66,0.80);border: 1px solid rgba(51,51,51,1);border-radius: 2px;'],
  //             yes: function (index, layero) {
  //                 current_nsac.state = 4;
  //                 drawSingleConstruction(current_nsac);
  //                 app.renderer.render(app.stage);
  //                 layer.close(index);
  //             }
  //         });
  //         break;
  // }

  // layer.open({
  //     type: 0,
  //     title: ['施工作业','font-family: MicrosoftYaHei-Bold;font-size: 14px;color: #D7D7D7;'],
  //     // skin: 'layui-layer-lan',
  //     area: ['236px', '306px'],
  //     btn: ['审批通过'],
  //     btnAlign: 'c',
  //     yes: function(index, layero){
  //         console.log('approved!');
  //     },
  //     shadeClose: true, //点击遮罩关闭
  //     content: '<div style="padding: 50px; line-height: 22px; background-color: #393D49; color: #fff; font-weight: 300;">你知道吗？亲！<br>layer ≠ layui<br><br> layer 只是作为 layui 的一个弹层模块，由于其用户基数较大，所以常常会有人以为 layui 是 <del>layerui</del><br><br>layer 虽然已被 Layui 收编为内置的弹层模块，但仍然会作为一个独立组件全力维护、升级 ^_^</div>'
  //   });

  //示范一个公告层
  // layer.open({
  //     type: 1
  //     ,title: false //不显示标题栏
  //     ,closeBtn: false
  //     ,area: '300px;'
  //     ,shade: 0.8
  //     ,id: 'LAY_layuipro' //设定一个id，防止重复弹出
  //     ,resize: false
  //     ,btn: ['火速围观', '残忍拒绝']
  //     ,btnAlign: 'c'
  //     ,moveType: 1 //拖拽模式，0或者1
  //     ,content: '<div style="padding: 50px; line-height: 22px; background-color: #393D49; color: #fff; font-weight: 300;">内容<br>内容</div>'
  //     ,success: function(layero){
  //     var btn = layero.find('.layui-layer-btn');
  //     btn.find('.layui-layer-btn0').attr({
  //         href: 'http://www.layuion.com/'
  //         ,target: '_blank'
  //     });
  //     }
  // });
}

//绘制虚线多边形
Graphics.prototype.drawDashedPolygon = function (polygons, x, y, rotation, dash, gap, offsetPercentage) {
  var i;
  var p1;
  var p2;
  var dashLeft = 0;
  var gapLeft = 0;
  if (offsetPercentage > 0) {
    var progressOffset = (dash + gap) * offsetPercentage;
    if (progressOffset < dash) dashLeft = dash - progressOffset;
    else gapLeft = gap - (progressOffset - dash);
  }
  var rotatedPolygons = [];
  for (i = 0; i < polygons.length; i += 2) {
    var p = { x: polygons[i], y: polygons[i + 1] };
    var cosAngle = Math.cos(rotation);
    var sinAngle = Math.sin(rotation);
    var dx = p.x;
    var dy = p.y;
    p.x = (dx * cosAngle - dy * sinAngle);
    p.y = (dx * sinAngle + dy * cosAngle);
    rotatedPolygons.push(p);
  }
  for (i = 0; i < rotatedPolygons.length; i++) {
    p1 = rotatedPolygons[i];
    if (i == rotatedPolygons.length - 1) p2 = rotatedPolygons[0];
    else p2 = rotatedPolygons[i + 1];
    var dx = p2.x - p1.x;
    var dy = p2.y - p1.y;
    var len = Math.sqrt(dx * dx + dy * dy);
    var normal = { x: dx / len, y: dy / len };
    var progressOnLine = 0;
    this.moveTo(x + p1.x + gapLeft * normal.x, y + p1.y + gapLeft * normal.y);
    while (progressOnLine <= len) {
      progressOnLine += gapLeft;
      if (dashLeft > 0) progressOnLine += dashLeft;
      else progressOnLine += dash;
      if (progressOnLine > len) {
        dashLeft = progressOnLine - len;
        progressOnLine = len;
      } else {
        dashLeft = 0;
      }
      this.lineTo(x + p1.x + progressOnLine * normal.x, y + p1.y + progressOnLine * normal.y);
      progressOnLine += gap;
      if (progressOnLine > len && dashLeft == 0) {
        gapLeft = progressOnLine - len;

      } else {
        gapLeft = 0;
        this.moveTo(x + p1.x + progressOnLine * normal.x, y + p1.y + progressOnLine * normal.y);
      }
    }
  }
}
// 绘制虚线直线
// x1,y1起始点坐标
// x2,y2结束点坐标
// color线条颜色
Graphics.prototype.drawDashedLind = function (x1, y1, x2, y2) {
  this.moveTo(x1, y1);
  this.lineTo(x2, y2);
};
Graphics.prototype.drawDashedCircle = function () {};
/**
 * 倒计时
 */
function addZero (i) {
  return i < 10 ? "0" + i : i + "";
}

//施工开始倒计时 
function countDown_begin (obj, container, fn, fn2) {
  let timer = setInterval(function () {
    let nowtime = new Date();
    let endtime = new Date(obj.beginTime);
    let lefttime = parseInt((endtime.getTime() - nowtime.getTime()) / 1000);

    let mm = addZero(parseInt(lefttime / 60 % 60));
    let hh = addZero(parseInt(lefttime / (60 * 60)));
    let ss = addZero(parseInt(lefttime % 60));

    // console.log(`活动倒计时  ${hh} 时 ${mm} 分 ${ss} 秒 `);
    let str = `${hh}:${mm}:${ss}`;

    if (lefttime < 0) {
      clearInterval(timer);
      fn2(obj, container);
    } else {
      if (lefttime < 15) {
        if (!(filter_objArr.some(item => item.id == obj.id))) {
          filter_objArr.push(obj);
        }

        if (!ticker_nsac.started) {
          ticker_nsac.start();
          ticker_nsac.add(() => twinkleLoop(container));
        }
      }
      fn(obj, str);
    }
  }, 1000);
}

//施工结束倒计时
function countDown_end (obj, fn) {
  let timer = setInterval(function () {
    let nowtime = new Date();
    let endtime = new Date(obj.endTime);
    let lefttime = parseInt((endtime.getTime() - nowtime.getTime()) / 1000);

    if (lefttime < 0) {
      clearInterval(timer);
      fn(obj);
    }
  }, 1000);
}

//确认失效后自动消失倒计时
function countDown_close (obj, fn) {
  let timestart = 3;
  let timestep = -1;
  let timer = setInterval(function () {
    timestart += timestep;
    if (timestart < 0) {
      clearInterval(timer);
      fn(obj);
    }
  }, 1000);
}

/**
 * 图形闪烁效果
 */
function twinkleLoop (container) {
  let timeNow = (new Date()).getTime();
  let timeDiff = timeNow - g_Time_nsac;

  if (timeDiff < g_TICK_nsac)
    return;

  g_Time_nsac = timeNow;

  for (let i = 0; i < filter_objArr.length; i++) {
    let obj = filter_objArr[i];
    let poly = container.children.find(element => element.name == obj.id);
    if (poly.filters) {
      poly.filters = null;
    } else {
      poly.filters = [glowFilter];
    }
  }
}

function stopTwinkle (obj, container) {
  let index = filter_objArr.indexOf(filter_objArr.filter(item => item.id == obj.id)[0]);
  filter_objArr.splice(index, 1);

  if (filter_objArr.length === 0) {
    ticker_nsac.stop();
    // ticker_nsac.destroy();
    // ticker_nsac.remove(twinkleLoop(obj));
  }

  let poly = container.children.find(element => element.name == obj.id);
  poly.filters = null;
}
const NSAC_Obj_1 = {
  id: 1,
  name: '设备检修',
  area: ['Y', 'P2', '02L', 'P1', 'J6'],
  dept: '设备室',
  vehicleAvoid: true,
  affectOperation: true,
  progress: '进行中',
  navigationNotice: 'Y,P2,02L,P1,J6区域设备检修于2022/2/28 00:00结束。',
  beginTime: '2022/04/22,18:23:00',
  endTime: '2022/04/22,18:23:10',
  // ptArr: [-66, -296, -65, -297, -61, -299, -57, -304, -55, -310, -44, -307, -34, -305, -35, -300, -34, -293, -31, -288, -30, -287, -26, -284, -24, -283, -27, -271, -30, -259, -35, -259, -37, -259, -41, -258, -46, -253, -47, -251, -48, -248, -49, -245, -59, -247, -70, -250, -69, -253, -69, -256, -69, -257, -69, -257, -70, -261, -72, -266, -72, -266, -73, -267, -76, -269, -79, -271, -76, -283, -73, -295, -73, -295, -67, -296, -66, -296],
  ptArr: [
    -129.40052822504285, -573.5748282245098, -127.34230709840905,
    -574.6222619035228, -119.05617174260789, -578.8391005248999,
    -112.22333794429575, -588.1612612659465, -107.61336172632397,
    -600.1342367050047, -87.37760988767053, -594.9607586307083,
    -68.21940959625952, -590.062796665074, -69.43476462597651,
    -580.3153415212814, -68.33140070149513, -566.5072869117548,
    -62.66148969852944, -557.0134026876983, -59.790157885531606,
    -555.0469616759913, -52.712307136434035, -550.1996770161226,
    -48.54827481563771, -548.7578949656706, -54.56107259936392,
    -524.594374853756, -60.36294037582391, -501.2785933238172,
    -70.36627390683806, -501.8807501553019, -72.69515169424614,
    -501.22084807403166, -80.10145441141728, -499.12222874596654,
    -90.14756744262986, -490.72513217271353, -91.80549190366472,
    -486.7049977074651, -94.65784942895317, -479.78860810795965,
    -96.95765548027427, -473.6861751022879, -116.30841385535498,
    -478.70695696959314, -136.72881953037805, -484.00530269209037,
    -135.93434218702336, -490.69705251316344, -135.26545883505187,
    -495.8097195355424, -135.4409486595297, -497.67327161542636,
    -135.3984946046357, -497.66260022825867, -136.13005004656242,
    -504.99094440490916, -140.34442729667538, -514.9016602468046,
    -141.4548862791089, -515.7728629632024, -142.5653451212034,
    -516.6440657660413, -149.04465275375912, -521.7273654557624,
    -154.48092977307016, -524.2924178767402, -148.41328616936048,
    -548.6756405082691, -142.64373656645859, -571.8610306738447,
    -142.21253468285192, -571.7201292829304, -131.2162610031258,
    -572.6507978140586, -129.40052822504285, -573.5748282245098,
  ],
  state: 0,
}
const NSAC_Obj_2 = {
  id: 2,
  name: '设备检修2',
  area: ['Y', 'P2', '02L', 'P1', 'J6'],
  dept: '设备室',
  vehicleAvoid: true,
  affectOperation: true,
  progress: '进行中',
  navigationNotice: 'Y,P2,02L,P1,J6区域设备检修于2022/2/28 00:00结束。',
  beginTime: '2022/04/22,18:23:00',
  endTime: '2022/04/22,18:23:10',
  // ptArr: [-66, -296, -65, -297, -61, -299, -57, -304, -55, -310, -44, -307, -34, -305, -35, -300, -34, -293, -31, -288, -30, -287, -26, -284, -24, -283, -27, -271, -30, -259, -35, -259, -37, -259, -41, -258, -46, -253, -47, -251, -48, -248, -49, -245, -59, -247, -70, -250, -69, -253, -69, -256, -69, -257, -69, -257, -70, -261, -72, -266, -72, -266, -73, -267, -76, -269, -79, -271, -76, -283, -73, -295, -73, -295, -67, -296, -66, -296],
  ptArr: [
    27.048989554093776, -701.4025127320203, 28.089384970208986,
    -709.6219698414844, 35.03013914109793, -764.4563899036161,
    56.328443385167816, -759.5249150725468, 74.26837583624665,
    -722.7764225788873, 86.38588784769884, -726.2282201074378,
    111.1200278896454, -624.3025289213388, 115.30736000767043,
    -608.094242395975, 119.62973971106013, -592.069799049245,
    121.11874163901112, -585.9351145076143, 108.97494984131086,
    -582.4751602500396, 87.92705018637656, -576.4783154030447,
    87.41514355302766, -577.279427753833, 82.86720141743473,
    -584.3967706189758, 71.437871703716, -591.1792678822477,
    62.42764737876032, -593.2562689566197, 51.59622320988002,
    -592.2177060772792, 41.915049921051164, -586.921218339423,
    33.767533643450015, -577.5745086200841, 30.214692448798516,
    -568.1990179181685, 9.985295153902472, -573.3072810859991,
    -9.898793522075078, -578.3283785499674, 13.247526591417728,
    -636.5229175730933, 25.0090141334029, -685.2860804257721,
    27.048989554093776, -701.4025127320203,
  ],
  state: 0,
}
export { drawSingleConstruction, NSAC_Obj_1, NSAC_Obj_2 }