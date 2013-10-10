function getElementsByClassName( className, tagName ){ 
    var elements = [], all = document.getElementsByTagName( tagName || "*" ); 
    for(var i=0; i < all.length; i++){ 
        if(all[i].className == className){ 
            elements[elements.length] = all[i]; 
        } 
    } 
    return elements; 
}
// ---------------- 顶部导航条 ---------------------
function scrollitems(){
    window.onscroll = function(){
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        var top_nav = document.getElementById("nav");
		
        if( top_nav != null ){
            if( scrollTop >= 110 ) { 
                top_nav.className = "nav-fix nav-fix-top "; 
            } else { 
                top_nav.className = "nav";
            }
        }
//底部返回顶部隐藏和显示
        var go_top = document.getElementById("go-top");
        if( go_top != null ){
            if( scrollTop >= 300 ) { 
                go_top.style.display = "block"; 
            } else { 
                go_top.style.display = "none"; 
            }
        }
// 底部文章导航目录自动现实隐藏
        var bottom_nav = document.getElementById("nav-fix-bottom");
        if( bottom_nav != null ){
            if( scrollTop >= 200 ) { 
                bottom_nav.style.display = "block"; 
            } else { 
                bottom_nav.style.display = "none"; 
            }
        }
    }
}
// ---------------- 文章底部导航条 ---------------------
// 为选中 h3 添加 padding-top: 50px; 并清除其余 h3 的 padding-top
function add_h3_padding(item) {
    var h3_titles = document.getElementsByTagName("h3");
    for(var i = 0; i < h3_titles.length; i++ ){
        h3_titles[i].style.paddingTop = "0px";
        if(item.innerHTML == h3_titles[i].innerHTML){
            h3_titles[i].style.paddingTop = "50px";
        }
    }
}
// 底部文章导航目录自动现实隐藏

function toggle_bottom_catelog(){
    window.onscroll = function(){
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        var bottom_nav = document.getElementById("nav-fix-bottom");
        if( bottom_nav != null ){
            if( scrollTop >= 200 ) { 
                bottom_nav.style.display = "block"; 
            } else { 
                bottom_nav.style.display = "none"; 
            }
        }
    }
}

// 填充底部文章导航目录
function fill_bottom_navbar () {
    var nav_bar = document.getElementById("page-nav-list");
    if(nav_bar != null) {
        var h3_titles = document.getElementsByTagName("h3");
        var str = '<ul>';
        for(var i = 0; i < h3_titles.length; i++ ){
            h3_titles[i].id = 'subnav-' + i;
            str += '<li><a href="#subnav-' + i + '" onclick="add_h3_padding(this)">'
                + h3_titles[i].innerHTML + '</a></li>';
        }
        nav_bar.innerHTML = str + '</ul>';
    }
}

// ---------------- 分类 或 标签 ---------------------
// 单击 topic_list 中的 分类 或 标签 时，显示对应的 topic
function show_topic( topic ) {
    var topics = getElementsByClassName("show");
    for( i = 0; i < topics.length; i++ ){
        topics[i].style.display = "none";
        if(topic.innerHTML == topics[i].id){
            topics[i].style.display = "block";
        }
    }
}

// 把页面中的 标签 和 分类 选出，并放在 fill_topic 中
function fill_topic() {
    var topic_list = document.getElementById("topic-list");
    var topic_list_c = document.getElementById("topic-list-c");
    var topics = getElementsByClassName("show");
    var str = '' ;
    var str_c = '<ul>';

    for( i = 0; i < topics.length; i++ ){
        str += '<a href="#" class="badge badge-list" onclick="show_topic(this)">' + topics[i].id + '</a>' ;
        str_c += '<li><a href="#" onclick="show_topic(this)">' + topics[i].id + '</a></li>' ;
    }
    str_c += '</ul>';
	if( topic_list_c != null ||  topic_list != null ){
	    topic_list_c.innerHTML = str_c ;
		topic_list.innerHTML = str ;
	}
}

// 点击 Post 页面标签，或者分类时，根据 锚链接 跳转到相对应的位置
function anchor_redirect(){
    var topics = getElementsByClassName("show");
    for( i = 0; i < topics.length; i++ ){
        topics[i].style.display = "block";
        if( window.location.hash.substr(7) == topics[i].id){
            topics[i].style.display = "block";
        }
    }
	
}

// ---------------- 页面加载完成后 ---------------------
window.onload = function(){	
    fill_bottom_navbar();
    fill_topic();
    anchor_redirect();
    scrollitems();
	 
}
