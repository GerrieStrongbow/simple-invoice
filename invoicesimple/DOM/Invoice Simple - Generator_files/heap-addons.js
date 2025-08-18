/**
 * Author: EverCommerce
 * Author URI: https://www.evercommerce.com/
 * 
 * Copyright EverCommerce
 * All Rights Reserved.
 * 
 * NOTICE: Unauthorized copying of this file
 *         via any medium is strictly prohibited.
 *         Proprietary and confidential
 */
!function(){function e(e){var t=e/1e3;return Math.round(1e4*t)/1e4}var t=setInterval((function(){var a,n,o=window.performance.getEntriesByType("navigation"),r=window.performance.getEntriesByType("resource");if(o.length>0&&r.length>0){var l={pageLoadTime:null,totalTime:null,totalBytes:null,totalRequests:null},i=o[0];l.pageLoadTime=i.loadEventEnd-i.startTime,l.totalTime=i.responseEnd-i.requestStart;var s=r.map((function(e){return e.encodedBodySize}));l.totalBytes=s.reduce((function(e,t){return e+t}),0),l.totalRequests=r.length;var d={"Load Time (seconds)":e(l.pageLoadTime),"Total Time (seconds)":e(l.totalTime),"Total Size (kb)":(a=l.totalBytes,n=a/1024,Math.round(100*n)/100),"Total Requests":l.totalRequests};void 0!==window.heap&&window.heap.track("Page Speed",d),clearInterval(t)}}),1e3)}();
