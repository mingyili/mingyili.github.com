/*!
 * Last Update : 2016-02-25 04:04:09
 */
function process(a,b){var c="js/";if("css"==b&&(c="css/"),"object"==typeof a)for(var d=a.length,e=0;d>e;e++)a[e]=c+a[e].replace(/(^\s*)|(\s*$)/g,"");else a=c+a.replace(/(^\s*)|(\s*$)/g,"");return a}function loadPageJs(a){var b=void 0!=a.data("js")?a.data("js").split(","):"";b&&""!=b&&(b=process(b),seajs.use(b,function(){$("#J_circle").circle&&$("#J_circle").circle()}))}function loadPageCss(a){var b=void 0!=a.data("css")?a.data("css").split(","):"";b&&""!=b&&(b=process(b,"css"),seajs.use(b))}window.onload=function(){var a=$(".page.page-current");loadPageCss(a),loadPageJs(a)},$(document).on("pageAnimationStart",function(a,b,c){loadPageCss(c)}),$(document).on("pageInit",function(a,b,c){loadPageJs(c)});