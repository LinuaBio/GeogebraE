# GeogebraE: Geogebra Embedding 🎏

<svg style="weight: 128px; height: 128px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g stroke-linecap="round" stroke-linejoin="round"><path fill="none" stroke="#666" stroke-width="33.34" d="M432.345 250.876c0 87.31-75.98 158.088-169.705 158.088-93.726 0-169.706-70.778-169.706-158.088 0-87.31 75.98-158.09 169.706-158.09 93.725 0 169.705 70.78 169.705 158.09z" transform="matrix(1.0156 .01389 -.20152 .9924 42.924 8.75)"></path><path fill="#99f" stroke="#000" stroke-width="15.55" d="M644.286 145.571c0 26.431-20.787 47.858-46.429 47.858-25.642 0-46.428-21.427-46.428-47.858 0-26.43 20.786-47.857 46.428-47.857 25.642 0 46.429 21.427 46.429 47.857z" transform="matrix(.96842 0 0 .91438 -225.59 242.796)"></path><path fill="#99f" stroke="#000" stroke-width="15.55" d="M644.286 145.571c0 26.431-20.787 47.858-46.429 47.858-25.642 0-46.428-21.427-46.428-47.858 0-26.43 20.786-47.857 46.428-47.857 25.642 0 46.429 21.427 46.429 47.857z" transform="matrix(.96842 0 0 .91438 -151.12 72.004)"></path><path fill="#99f" stroke="#000" stroke-width="15.55" d="M644.286 145.571c0 26.431-20.787 47.858-46.429 47.858-25.642 0-46.428-21.427-46.428-47.858 0-26.43 20.786-47.857 46.428-47.857 25.642 0 46.429 21.427 46.429 47.857z" transform="matrix(.96842 0 0 .91438 -421.29 266.574)"></path><path fill="#99f" stroke="#000" stroke-width="15.55" d="M644.286 145.571c0 26.431-20.787 47.858-46.429 47.858-25.642 0-46.428-21.427-46.428-47.858 0-26.43 20.786-47.857 46.428-47.857 25.642 0 46.429 21.427 46.429 47.857z" transform="matrix(.96842 0 0 .91438 -483.632 100.362)"></path><path fill="#99f" stroke="#000" stroke-width="15.55" d="M644.286 145.571c0 26.431-20.787 47.858-46.429 47.858-25.642 0-46.428-21.427-46.428-47.858 0-26.43 20.786-47.857 46.428-47.857 25.642 0 46.429 21.427 46.429 47.857z" transform="matrix(.96842 0 0 .91438 -329.052 -23.649)"></path></g></svg>

**✨使用 GeoGebra 制作** | **🎉Made with GeoGebra** | **⚗️By BioLinua**

![](https://img.shields.io/badge/By-Geogebra-gree)
![version](https://img.shields.io/github/v/release/LinuaBio/GeogebraE.svg?style=flat-square)
![](https://img.shields.io/badge/license-GPL-blue.svg?style=popout-square)
[![](https://img.shields.io/badge/Gitee-red)](https://gitee.com/biolinua/GeogebraE)

GeogebraE是Geogebra的思源嵌入式程序. 

GeoGebra官方网站: https://www.geogebra.org

参考: [Apps Embedding](https://wiki.geogebra.org/en/Reference:GeoGebra_Apps_Embedding)
| 反馈地址: [GitHub-GeoGebraE](https://github.com/LinuaBio/GeogebraE/issues)
| 反馈地址: [Gitee-GeoGebraE](https://gitee.com/biolinua/GeogebraE/issues)

注：因为包含了离线包，包大小为19.7MB，所以该挂件大小达20.2MB

# 预览&功能介绍

<style>
#GeogebraE_imgBody{
    flex-direction: row;
    display: flex !important;
    height: 350px;
    width: 100%;
    overflow-y: hidden;
    overflow-x: auto;
}
.GeogebraE_imgItem{
    width: 575px;
    height: 100%;
    flex: none;
}
</style>
<div id="GeogebraE_imgBody">
    <div class="GeogebraE_imgItem" style="background: url('https://gitee.com/biolinua/GeogebraE/raw/main/assets/preview_001.png');background-size: cover"></div>
    <div class="GeogebraE_imgItem" style="background: url('https://gitee.com/biolinua/GeogebraE/raw/main/assets/preview_002.png');background-size: cover"></div>
    <div class="GeogebraE_imgItem" style="background: url('https://gitee.com/biolinua/GeogebraE/raw/main/assets/preview_003.png');background-size: cover"></div>
    <div class="GeogebraE_imgItem" style="background: url('https://gitee.com/biolinua/GeogebraE/raw/main/assets/preview_004.png');background-size: cover"></div>
    <div class="GeogebraE_imgItem" style="background: url('https://gitee.com/biolinua/GeogebraE/raw/main/assets/preview_005.png');background-size: cover"></div>
</div>

注: 图片是v0.0.2的界面，由于与v0.0.3没太大区别，故沿用v0.0.2的预览图

### 功能键:
1. Model: 切换模式
2. Function: 功能菜单
   1. ToImage: 将活动窗口转换为图片
   2. InsetBlock: 将活动窗口转换为图片，并插入GeogebraE挂件块下方
   3. loadFromV2: 从v0.0.2保存的数据加载，并重新保存为v0.0.3格式
   4. online: 切换到在线模式
   5. offline: 切换到离线模式(实验)，如果有些功能无法正常使用，请切换到在线版本
   6. Reload: 重新加载挂件
3. Save: 保存当前内容。若需保存为文件, 请使用左边栏的菜单, 加载文件同理

# 关于离线版本👇

对[官方提供的包](https://download.geogebra.org/installers/5.0/geogebra-math-apps-bundle-5-0-772-0.zip)拆解后保留的精简文件，不过尚未清楚会哪些功能无法使用，如果碰到此情况请使用在线版本"Function/online"，
并将问题反馈给我

| 反馈地址: [GitHub-GeoGebraE](https://github.com/LinuaBio/GeogebraE/issues)
| 反馈地址: [Gitee-GeoGebraE](https://gitee.com/biolinua/GeogebraE/issues)

<!-- # 离线版本👇

使用这个版本，你需要下载: 

https://download.geogebra.org/installers/5.0/geogebra-math-apps-bundle-5-0-772-0.zip

并将压缩包内的“GeoGebra”文件夹解压，放在"你的笔记空间/data/widgets/GeogebraE/"目录, 其大小是97MB

在"你的笔记空间/data/widgets/GeogebraE/"下找到"index.html", 并按照文件内的提示修改文件

最后，重新加载插件 -->

# License 😶‍🌫️

本程序遵循Geogebra使用的非商业开源协议 [![](https://img.shields.io/badge/By-GPT-blue)](https://www.gnu.org/licenses/gpl-3.0.html)


### GeoGebra License information:

You are free to copy, distribute and transmit GeoGebra for non-commercial purposes. For details see https://www.geogebra.org/license

# v0.0.5
- 取消“Resize”功能按键
- 加入“Reload”功能按键
- 加入图片下载功能
- 加入"把活动界面转换为图片并插入GeogebraE挂件块下方"

# v0.0.4
- 加入自动离线版本，如出现Bug可以切换为在线模式

# v0.0.3
- 加入对于在线使用的网络请求结果显示
- 更换数据存储方案
- 移除“Evaluator”模式
- 移除“Load”按钮

# v0.0.2
- 修复单个笔记使用多个GeogebraE无法保存的问题
- 修复离线版本不能使用的问题
- 更换preview图

# v0.0.1
- 简单的将Geogebra嵌入到思源挂件中