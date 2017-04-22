---
layout: post
category: H5
tags: dataset, html5, H5
description: 安卓和IOS web开发时遇到的bug，总结两个设备展示和处理上的不同。
---


#### 前言：
最新测试安卓机上不需要FastClick了，但是IOS的需要，而且部分安卓系统用fastclick后不能触发select了，所以最好是禁掉安卓机的fastclick，IOS开启fastclick。

#### select 焦点问题：
##### 现象：
IOS，多个select，点选的时候，选择器弹出页面发生位移，导致焦点错位
##### 原因：
由于fastclick 的核心方法是要触发两次点击而第二次点击有是获取的第一次点击的位置信息，
导致多个select选择时，IOS上，如果页面发生位移焦点就会下移
##### 解决办法：

在源码里的onTouchEnd事件下有一段判断是否需要needsFocus的代码。。问题的根源啊，

    // Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
    // Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
    if (!deviceIsIOS || targetTagName !== 'select') {
         this.targetElement = null;
         event.preventDefault();
    }

这断代码大致是为了在ios 下 select 时 this.targetElement  不置空继续执行原生选择事件，好打开select menu，但是却导致了二次触发。也就是当ios下页面过长，触发select导致页面滑动的情况下发生二次触发，焦点错位的原因。

所以要做的就是把这段判断改了就好

    // Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
    // Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
    // if (!deviceIsIOS || targetTagName !== 'select') {}
    this.targetElement = null;
    event.preventDefault();


这样就能在ios下fastclick select 同时不引起焦点错位。

#### textarea 光标定位

##### 现象：
textarea 点击之后光标一直定位到文字末尾，不能点到哪定到哪
##### 原因：
fastclick在onTouchEnd中判断needsfocus放到了判断needsclick的前面
而needsfocus中textarea返回true是写死的
所以没办法给textarea添加needsclick类来使用原生点击
建议在onTouchEnd开头判断needsclick类，毕竟手动添加的类优先级应该是最高的
##### 解决办法：
    var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

    //解决光标定位
    if(targetElement == null || this.needsClick(targetElement)){
        return false;
    }

    if (!this.trackingClick) {
        return true;
    }
    .....

#### label点击没有fastclick

##### 现象:
label点击fastclcik不生效

##### 解决代码：
这个解决办法有问题，最新版的fastclick貌似没问题。

    /**
     * 判断是否组合型label
     * @type {Boolean}
     */
    var isCompositeLabel = false;

    /**
     * Determine whether a given element requires a native click.
     *
     * @param {EventTarget|Element} target Target DOM element
     * @returns {boolean} Returns true if the element needs a native click
     */

    FastClick.prototype.needsClick = function(target) {

        //修复bug: 如果父元素中有 label
        var parent = target;

        while (parent && (parent.tagName.toLowerCase() !== "body")) {
            if(parent.tagName.toLowerCase() === "label") {
                isCompositeLabel = true;
                if ((/\bneedsclick\b/).test(parent.className)) return true;
            }
            parent = parent.parentNode;
        }

        ....

        // Cancel the event
        event.stopPropagation();
        // 允许组合型label冒泡
        if (!isCompositeLabel) {
            event.preventDefault();
        }


[引用连接>>](https://github.com/sdc-alibaba/SUI-Mobile/commit/dad2b3202a8a0f293cf98afecf803ae6d23f300c)





[jekyll]: http://jekyllrb.com/ "Jekyll 官方文档"
[emacs-jekyll]: https://github.com/diasjorge/jekyll.el "Emacs Jekyll 插件"
[emacs-jekyll-better]: https://github.com/tangjiujun/emacs.d/blob/master/custom-util/jekyll.el "修改后的 Emacs Jekyll 插件"