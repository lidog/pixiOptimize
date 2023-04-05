import moment from 'moment'
// 告警航班刷新时间间隔
export const alertFlightrefreshTime = 30000
// 小时架次刷新时间间隔
export const HourCountTime = 30000
// 席位负荷刷新时间间隔
export const positionLoadTime = 60000

// 航班延误统计-time 时间间隔
 export const airportTime = 30000
// 航班延误统计-time 时间间隔
 export const reasonTime = 30000
// 运行品质-time 时间间隔
 export const dynamicTime = 30000
//  盲降  时间间隔
 export const holdTime = 30000

//  请求时间参数(通用)
export const dateParams = {
  beginTime: '2022-06-10 00:00:00',
  endTime: `2022-06-10 ${moment(new Date()).format('HH:mm:ss')}`,
}

export const dateParams2 = {
  beginTime: '2022-06-10 00:00:00',
  endTime: `2022-06-10 ${moment(new Date()).format('HH:mm:ss')}`,
}
// 请求时间参数(运行跑道)
export const holdTimeParam = {
  beginTime: '2019-11-18 00:00:00',
  endTime: `2019-11-18 ${moment(new Date()).format('HH:mm:ss')}`,
}
export const flightPlanTimeParam = {
  planBeginTime: '2022-06-10 00:00:00',
  planEndTime: '2022-06-10 23:59:59',
}
// 请求时间参数(重要航班)
export const importFlyTimeParam = {
  beginTime: '2022-06-10 00:00:00', 
  endTime: `2022-06-10 ${moment(new Date()).format('HH:mm:ss')}`,
}
// 请求时间参数(重要航班)
export const positionTimeParam = {
  beginTime: '2022-08-09 07:00:00', 
  // endTime: `2022-08-09 ${moment(new Date()).format('HH:mm:ss')}`,
  endTime: '2022-08-09 08:00:00',
}
