import * as PIXI from 'pixi.js';
import {
    Util,
} from "@/utils/SMR/index";
import { DashLine } from 'pixi-dashed-line';
//import service from '@/utils/request';
const ACT_IDX = 21;
//const NoACT_IDX = 20;
class Route_O {
    constructor(Parent) {
        this.container = Parent;
        this.lnG_pre = new PIXI.Graphics();
        this.lnG_pre.name = 'lnG_pre';  //绘Graphics加标签
        this.lnG_nxt = new PIXI.Graphics();
        this.lnG_nxt.name = 'lnG_nxt';  //绘Graphics加标签
        // this.lnG_whole = new PIXI.Graphics();
        // this.lnG_whole.name = 'lnG_whole';  //绘Graphics加标签
        this.Coord_pre = [];
        this.Coord_nxt = [];
        this.rtText = '';
        this.xPos = 0;
        this.yPos = 0;
        //this.trackNumber = 0;
        this.selectTrack = null;
        this.ticker = new PIXI.Ticker();
        this.xPoint_old = 0;
        this.yPoint_old = 0;
        //this.dash_pre = null;
``        
        this.ticker.add(() => {
            let trackSet = JSON.parse(Util.getLocalData('track'));
            if (trackSet) {
                if (this.selectTrack.TrackNumber in trackSet) {
                    let track = trackSet[this.selectTrack.TrackNumber];
                    let xPoint = track.xPoint;
                    let yPoint = track.yPoint;
                    if ((Math.abs(xPoint-this.xPoint_old)>0.05) || (Math.abs(yPoint-this.yPoint_old)>0.05)){
                        //console.log('xPoint:',xPoint, 'yPoint:',yPoint);
                        this.get_publish_route(); 
                        this.xPoint_old = xPoint;
                        this.yPoint_old = yPoint;
                    }    
                }
            }
            
        });
    };
    start_dynamic_route_trace(){
        // if (! this.lnG_whole) this.lnG_whole = new PIXI.Graphics();
        // if (!this.container.getChildByName('lnG_whole', false)) {  
        //     this.container.addChild(this.lnG_whole);
        // }
        console.log(this.selectTrack)
        if (! this.lnG_pre) this.lnG_pre = new PIXI.Graphics();
        this.lnG_pre.clear();
        if (!this.container.getChildByName('lnG_pre', false)) {  
            this.container.addChild(this.lnG_pre);
            //this.dash_pre = new DashLine(this.lnG_pre, {dash: [20, 10],  width: 10,  color: 0xffa500, })
        }
        if (! this.lnG_nxt) this.lnG_nxt = new PIXI.Graphics();
        this.lnG_nxt.clear();
        if (!this.container.getChildByName('lnG_nxt', false)) {  
            this.container.addChild(this.lnG_nxt);
        }

        this.get_publish_route();  //不论是否动态，先绘一次。
        this.ticker.start();
        this.ticker.minFPS = 4;
        this.ticker.maxFPS = 4;
        
    };
    stop_dynamic_route_trace(){
        this.ticker.stop();
        if (this.lnG_pre) this.lnG_pre.clear();
        if (this.lnG_nxt) this.lnG_nxt.clear();
    };

    async get_publish_route(){
        const res = await fetch(`http://188.2.76.155:9080/smr/api/v1/route/taxiways/?trackNumber=${this.selectTrack.TrackNumber}`); //获得当前航班的发布路径
        const jsn = await res.json();

        if (jsn.errorType == 0){
            if (jsn.data.routeText.length >0){
                //console.log(jsn.data);
                if (jsn.data.coordinatesGone.length>0)
                {
                    let rtAry_pre = jsn.data.coordinatesGone;
                    let len_pre = rtAry_pre.length;
                    this.lnG_pre.clear();
                    this.lnG_pre.zIndex = ACT_IDX;
                    const dash_pre = new DashLine(this.lnG_pre, {dash: [20, 10],  width: 10,  color: 0xffa500, });
                    
                    for (let i = 0; i < len_pre; i++) {
                        if (i == 0){
                            dash_pre.moveTo(rtAry_pre[i][0], rtAry_pre[i][1]);
                        } else {    
                            dash_pre.lineTo(rtAry_pre[i][0], rtAry_pre[i][1]);
                        }    
                    }
                }
                if (jsn.data.coordinatesNotGo.length>0)
                {
                    //const rtAry = jsn.data.lineCoordinates;//整个路径数据
                    const rtAry_nxt = jsn.data.coordinatesNotGo;
                    const len_nxt = rtAry_nxt.length;
                    this.lnG_nxt.clear();
                    this.lnG_nxt.lineStyle({ width: 10, color: 0xffa500, alpha: 1 });
                    this.lnG_nxt.zIndex = ACT_IDX;
                    for (let i = 0; i < len_nxt; i++) {
                        if (i == 0){
                            this.lnG_nxt.moveTo(rtAry_nxt[i][0], rtAry_nxt[i][1]);
                        } else {    
                            this.lnG_nxt.lineTo(rtAry_nxt[i][0], rtAry_nxt[i][1]);
                        }    
                    }
                }    

            }    
        }
        //console.log(jsn);
    }


    // async routelock() {
    //     console.log('route track: ', this.trackNumber)
    //     // this.trackNumber = track.TrackNumber
    //     //锁定某航班,ozj
    //     if (this.locktk) { 
    //         this.locktk = null;
    //         if (this.m_rtlnG) {
    //             this.Container.removeChild(this.m_rtlnG);
    //             this.m_rtlnG.clear();
    //             this.m_rtlnPt = [];
    //             this.mn_rtText = '';
    //             this.xPos = 0;
    //             this.yPos = 0;
    //             let rttools = document.getElementById('rttools');
    //             rttools.style.display = 'none';
    //         }
    //         if (this.rtlncyG) {
    //             this.Container.removeChild(this.rtlncyG);
    //             this.rtlncyG.clear();
    //             this.cy_rtText = '';
    //         }
    //         if (this.rtlnzdG) {
    //             this.Container.removeChild(this.rtlnzdG);
    //             this.rtlnzdG.clear();
    //             this.zd_rtText = '';
    //         }
    //     } else {
    //         this.locktk = 'CSN5053';
    //         this.m_rtlnG.name = 'm_rtlnG';  //绘Graphics加标签
    //         this.rtlncyG.name = 'rtlncyG';
    //         this.rtlnzdG.name = 'rtlnzdG';

    //         if (!this.Container.getChildByName('m_rtlnG', false)) {  //加进手工要绘制的Graphics
    //             this.Container.addChild(this.m_rtlnG);
    //         }
    //         let rttools = document.getElementById('rttools');  //显示本工具栏
    //         rttools.style.display = 'block'; 
    //         const res = await fetch(`http://188.2.76.155:9080/smr/api/v1/route/two-taxiways/?trackNumber=${this.trackNumber}`); //获得当前锁定航班的路径
    //         const jsn = await res.json();

    //         if (jsn.code == 200 && jsn.errorType == 0) {
    //             const rtAry = jsn.data.routeResultArray;
    //             let len = rtAry.length;

    //             for (let k = 0; k < len; k++) {
    //                 let tmpG = null;
    //                 if (rtAry[k].routeType == 0) {
    //                     //最短路径
    //                     tmpG = this.rtlnzdG;
    //                     tmpG.lineStyle({ width: 10, color: 0x73E4E5, alpha: 1 });
    //                     this.zd_rtText = rtAry[k].routeText;
    //                     this.zd_Coord = [...rtAry[k].lineCoordinates];  //坐标点复制
    //                     document.getElementById('rtTexts_zd').innerText = this.zd_rtText;
                        
    //                 } else if (rtAry[k].routeType == 1) {
    //                     //常用路径
    //                     tmpG = this.rtlncyG;
    //                     tmpG.lineStyle({ width: 10, color: 0xFFFFFF, alpha: 1 });
    //                     this.cy_rtText = rtAry[k].routeText;
    //                     console.log(this.cy_rtText);
    //                     this.cy_Coord = [...rtAry[k].lineCoordinates];  //坐标点复制
    //                     document.getElementById('rtTexts_cy').innerText = this.cy_rtText;
    //                 }

    //                 if (tmpG) {
    //                     let lnAlen = rtAry[k].lineCoordinates.length;
    //                     for (let i = 0; i < lnAlen; i++) {  //绘出路径
    //                         if (i == 0)
    //                         tmpG.moveTo(rtAry[k].lineCoordinates[i][0], rtAry[k].lineCoordinates[i][1]);
    //                         tmpG.lineTo(rtAry[k].lineCoordinates[i][0], rtAry[k].lineCoordinates[i][1]);
    //                     }
    //                     tmpG.hitArea = tmpG.getBounds();
    //                     let gplen = tmpG.geometry.points.length;
    //                     if (gplen > 0) {
    //                         let hitAreaAry = [];
    //                         let ptlen = gplen >> 1;
    //                         let ct = 0;
    //                         for (let j = 0; j < ptlen; j++) {
    //                             if (ct % 2 == 0) {
    //                                 hitAreaAry.push(tmpG.geometry.points[j << 1], tmpG.geometry.points[(j << 1) + 1]);
    //                             }
    //                             ct++;
    //                         }
    //                         ct = 0
    //                         for (let j = ptlen - 1; j > 0; j--) {
    //                             if (ct % 2 == 0) {
    //                                 hitAreaAry.push(
    //                                 tmpG.geometry.points[j << 1],
    //                                 tmpG.geometry.points[(j << 1) + 1]
    //                                 )
    //                             }
    //                             ct++
    //                         }
    //                         tmpG.hitArea = new PIXI.Polygon(hitAreaAry)
    //                     }

    //                     tmpG.interactive = true
    //                     tmpG.cursor = 'pointer'
    //                     const that = this
    //                     tmpG.on('pointerdown', function (event) {
    //                         //console.log(that.;
    //                         if (!that.isManRt) {
    //                             //console.log(event,event.target);
    //                             let rtexts = document.getElementById('rtTexts');
    //                             let rtexts_zd = document.getElementById('rtTexts_zd');
    //                             let rtexts_cy = document.getElementById('rtTexts_cy');
    //                             if (event.target.name == 'rtlncyG') {
    //                                 rtexts_cy.innerText = that.cy_rtText;
    //                                 //this.selidx = 2;
    //                                 that.route_sel(2);
    //                             } else if (event.target.name == 'rtlnzdG') {
    //                                 rtexts_zd.innerText = that.zd_rtText;
    //                                 //this.selidx = 1;
    //                                 that.route_sel(1);
    //                             } else if (event.target.name == 'm_rtlnG') {
    //                                 rtexts.innerText = that.mn_rtText;
    //                                 //this.selidx = 0;
    //                                 that.route_sel(0);
    //                             }
    //                         }
    //                     })

    //                     this.Container.addChild(tmpG)
    //                 }
    //             }
    //         }
    //     }
    // }
    // async manRoute(e) {
    //     //ozj,获得鼠标点所在位置的XY值(单位米),手工点规划路径
    //     // console.log(this.locktk, this.isManRt);
    //     if (this.locktk && this.isManRt) {
    //         //锁定某航班,并设路径规划
    //         let len = this.m_rtlnPt.length
    //         if (len == 0) {
    //             //若是第一个点,需先获得航迹坐标
    //             const res = await fetch(
    //             `http://:9080/smr/api/v1/tracklocation/?trackNumber=${this.trackNumber}`
    //             )
    //             const jsn = await res.json()
    //             this.xPos = jsn.xPosition
    //             this.yPos = jsn.yPosition
    //         }
    //         // this.m_rtlnPt.push(x0, y0) //加进点
    //         this.m_rtlnPt.push(this.Container.toLocal(e.global).x, this.Container.toLocal(e.global).y)
    //         try {
    //             service({
    //             url: '/smr/api/v1/route/shortest-route',
    //             method: 'POST',
    //             data: {
    //                     //post请求参数
    //                     trackNumber: this.trackNumber,
    //                     passingPoints: this.m_rtlnPt,
    //                     beginX: this.xPos,
    //                     beginY: this.yPos,
    //                     }
    //             }).then(
    //             response => {
    //             const json = response //await response.json()
    //             if (json.errorType == 0) {
    //                 //点击位置合法
    //                 console.log('路径点合法!')
    //                 this.selidx = 0;
    //                 this.m_rtlnG.name = 'm_rtlnG'
    //                 if (this.m_rtlnPt.length > 2) this.m_rtlnG.clear()
    //                 this.m_rtlnG.lineStyle({ width: 10, color: 0x73E573, alpha: 1, })
    //                 this.m_rtlnG.beginFill(0x73E573)
    //                 this.m_rtlnG.drawCircle(this.xPos, this.yPos, 20.0); //绘出起始点
    //                 let ptlen = this.m_rtlnPt.length >> 1
    //                 for (let i = 0; i < ptlen; ++i) {
    //                 this.m_rtlnG.drawCircle(
    //                     this.m_rtlnPt[i << 1],
    //                     this.m_rtlnPt[(i << 1) + 1],
    //                     10.0
    //                 ) //绘出点击点
    //                 }
    //                 this.m_rtlnG.endFill()
    //                 let lCoord = json.data.lineCoordinates
    //                 let len = lCoord.length

    //                 for (let i = 0; i < len; i++) {
    //                 if (i == 0){
    //                     this.m_rtlnG.moveTo(lCoord[i][0], lCoord[i][1])
    //                 }else{
    //                     this.m_rtlnG.lineTo(lCoord[i][0], lCoord[i][1])
    //                 }                  
    //                 }
    //                 this.mn_Coord = [...lCoord];  //坐标点复制
    //                 let rtexts = document.getElementById('rtTexts')
    //                 rtexts.innerText = json.data.routeText
    //                 this.mn_rtText = json.data.routeText
    //             } else {
    //                 console.log('路径点不合法!')
    //                 this.m_rtlnPt.pop()
    //                 this.m_rtlnPt.pop() //点击位置合法,去掉最后一个点
    //             }
    //             //console.log(json);
    //             console.log(response)
    //             })
    //         } catch (err) {
    //             console.log(err)
        
    //         }

    //     }
    // };

    // async preroute() {
    //     //路径规划，上一步,ozj
    //     if (this.m_rtlnPt.length > 0) {
    //       //去掉最后一个点
    //       this.m_rtlnPt.pop()
    //       this.m_rtlnPt.pop()
    //     }
    //     let rtexts = document.getElementById('rtTexts')
    //     if (this.m_rtlnPt.length > 0) {
  
    //       try {
    //         service({
    //           url: '/smr/api/v1/route/shortest-route',
    //           method: 'POST',
    //           data: {
    //                   //post请求参数
    //                   trackNumber: this.trackNumber,
    //                   passingPoints: this.m_rtlnPt,
    //                   beginX: this.xPos,
    //                   beginY: this.yPos,
    //                 }
    //         }).then(response => {
    //           // console.log(response)
    //           const json = response // await response.json()
    //           console.log(this.m_rtlnPt)
    //           this.m_rtlnG.clear()
    //           this.m_rtlnG.lineStyle({
    //             width: 8,
    //             color: 0x73E573,
    //             alpha: 1,
    //           })
    //           this.m_rtlnG.beginFill(0x73E573)
    //           this.m_rtlnG.drawCircle(
    //             this.xPos,
    //             this.yPos,
    //             30.0
    //           ) //绘出起始点
    //           let ptlen = this.m_rtlnPt.length >> 1
    //           for (let i = 0; i < ptlen; ++i) {
    //             this.m_rtlnG.drawCircle(
    //               this.m_rtlnPt[i << 1],
    //               this.m_rtlnPt[(i << 1) + 1],
    //               10.0
    //             ) //绘出点击点
    //           }
    //           this.m_rtlnG.endFill()
    //           let lCoord = json.data.lineCoordinates
    //           let len = lCoord.length
  
    //           for (let i = 0; i < len; i++) {
    //             if (i == 0) {
    //               this.m_rtlnG.moveTo(lCoord[i][0], lCoord[i][1])
    //             } else {
    //               this.m_rtlnG.lineTo(lCoord[i][0], lCoord[i][1])
    //             }
    //           }
  
    //           rtexts.innerText = json.data.routeText
    //         })
    //       } catch (err) {
    //         console.log(err)
    //       }
    //     } else {
    //       //去掉最后一个点后，已没有数据点
    //       this.m_rtlnG.clear()
    //       rtexts.innerText = ''
    //     }
    // };

    // route_sel_redraw(idx, drawcolor){
    //     let tmpG = null;
    //     let Coord = [];
    //     switch (idx) {
    //         case 0:  //选择手工规划路径
    //             tmpG = this.m_rtlnG;
    //             Coord = this.mn_Coord;
    //             if (this.m_rtlnPt.length > 2) tmpG.clear();
    //             tmpG.lineStyle({ width: 10, color: drawcolor, alpha: 1, });
    //             tmpG.beginFill(0x73E573);
    //             tmpG.drawCircle(this.xPos, this.yPos, 20.0); //绘出起始点
    //             let ptlen = this.m_rtlnPt.length >> 1;
    //             for (let i = 0; i < ptlen; ++i) {
    //                 tmpG.drawCircle(
    //                     this.m_rtlnPt[i << 1],
    //                     this.m_rtlnPt[(i << 1) + 1],
    //                     10.0
    //                 ); //绘出点击点
    //             }
    //             tmpG.endFill();

    //             let len0 = Coord.length;
    //             for (let i = 0; i < len0; i++) {
    //                 if (i == 0){
    //                     tmpG.moveTo(Coord[i][0], Coord[i][1]);
    //                 }else{
    //                     tmpG.lineTo(Coord[i][0], Coord[i][1]);
    //                 }                  
    //             }
    //             break;
    //         case 1:  //选择最短路径
    //             tmpG = this.rtlnzdG;
    //             Coord = this.zd_Coord;
    //             if (Coord.length > 0) tmpG.clear();
    //             tmpG.lineStyle({ width: 10, color: drawcolor, alpha: 1 });
    //             let btn2 = document.getElementById('btn_selzd');
    //             btn2.style.backgroundColor = drawcolor;
    //             let len1 = Coord.length;
    //             for (let i = 0; i < len1; i++) {
    //                 if (i == 0){
    //                     tmpG.moveTo(Coord[i][0], Coord[i][1]);
    //                 }else{
    //                     tmpG.lineTo(Coord[i][0], Coord[i][1]);
    //                 }                  
    //             }
    //             break;
    //         case 2:  //选择常用路径
    //             tmpG = this.rtlncyG;
    //             Coord = this.cy_Coord;
    //             if (Coord.length > 0) tmpG.clear();
    //             tmpG.lineStyle({ width: 10, color: drawcolor, alpha: 1 });
    //             let btn3 = document.getElementById('btn_selcy');
    //             btn3.style.backgroundColor = drawcolor;
    //             let len2 = Coord.length;
    //             for (let i = 0; i < len2; i++) {
    //                 if (i == 0){
    //                     tmpG.moveTo(Coord[i][0], Coord[i][1]);
    //                 }else{
    //                     tmpG.lineTo(Coord[i][0], Coord[i][1]);
    //                 }                  
    //             }
    //             break;
    //     }
    // };

    // route_sel(routeidx){
    //     if (this.selidx == routeidx) return;
    //     switch (this.selidx) {
    //         case 0:  //选择手工规划路径
    //             this.route_sel_redraw(this.selidx, "0x8FCC8F"); 
    //             document.getElementById('btn_selsd').style.backgroundColor = "#8FCC8F";
    //             break;
    //         case 1:  //选择最短路径
    //             this.route_sel_redraw(this.selidx, "0x8FCBCC"); 
    //             document.getElementById('btn_selzd').style.backgroundColor = "#8FCBCC";
    //             break;
    //         case 2:  //选择常用路径
    //             this.route_sel_redraw(this.selidx, "0xD8D8D8"); 
    //             document.getElementById('btn_selcy').style.backgroundColor = "#D8D8D8";
    //             break;
    //     }

    //     switch (routeidx) {
    //         case 0:  //选择手工规划路径
    //             this.route_sel_redraw(routeidx, "0x73E573"); 
    //             document.getElementById('btn_selsd').style.backgroundColor = "#73E573";
    //             this.selidx = 0;
    //             break;
    //         case 1:  //选择最短路径
    //             this.route_sel_redraw(routeidx, "0x73E4E5"); 
    //             document.getElementById('btn_selzd').style.backgroundColor = "#73E4E5";
    //             this.selidx = 1;
    //             break;
    //         case 2:  //选择常用路径
    //             this.route_sel_redraw(routeidx, "0xFFFFFF"); 
    //             document.getElementById('btn_selcy').style.backgroundColor = "#FFFFFF";
    //             this.selidx = 2;
    //             break;
    //     }

        
    // };

}

export { Route_O };