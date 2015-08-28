---
layout: post
category: sass，compass
tags: sass，compass
description: 如何安装 compass 编译 sass，如何编译，编译配置以及编译过程中遇到的问题。
---


### 安装compass  

  
1.安装ruby，在本地能运行 jekyll 就有已经搭建了 ruby  
  windows 用RubyInstaller  [连接](https://www.ruby-lang.org/zh_cn/downloads/);  
  
2.安装 compass  

    	gem install compass //默认会安装sass  

  2.1. compass 编译  

  		compass compile  
  
  2.2. compass 压缩编译  

    	compass compile --output-style compressed  
  
  2.3. 强制编译  

    	compass complie --force  
  
  2.4. 自动编译（sass文件发生变化后自动编译）  

    	compass watch  

3.问题：  
  
  3.1. 编码问题：在文件开头加 `@charset "utf-8"`  可以编译汉字  

  3.2. 去除编译生成的多余注释：在配置文件 config.rb 中设置 line_comments = false   
  



[jekyll]: http://jekyllrb.com/ "Jekyll 官方文档"
[emacs-jekyll]: https://github.com/diasjorge/jekyll.el "Emacs Jekyll 插件"
[emacs-jekyll-better]: https://github.com/tangjiujun/emacs.d/blob/master/custom-util/jekyll.el "修改后的 Emacs Jekyll 插件"