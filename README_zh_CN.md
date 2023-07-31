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

### 功能键:
#### Geogebra窗口功能键
1. Model: 切换模式
2. Function: 功能菜单
   1. ToImage: 将活动窗口转换为图片，并弹出下载窗口
   2. InsetBlock: 将活动窗口转换为图片，并插入当前块下方
3. FullScreen: 全屏

#### '/'指令功能键
1. 打开GeogebraE

#### 图片右键菜单功能键
1. 用GeogebraE打开: 将隐写入geogebra文件信息的图片用geogebra打开. 你可以直接打开用"ToImage"转换的图片, 也可以打开用"InsetBlock"转换的图片

**此外，该插件的逻辑是保存图片优先，如果出现任何问题，如程序崩溃，意外退出等，你可以在assets中找到“InsetBlock”的图片，该图片已经过隐写术处理，文件名以“geogebra”为前缀**

# License 😶‍🌫️

本程序遵循Geogebra使用的非商业开源协议 [![](https://img.shields.io/badge/By-GPT-blue)](https://www.gnu.org/licenses/gpl-3.0.html)


### GeoGebra License information:

You are free to copy, distribute and transmit GeoGebra for non-commercial purposes. For details see https://www.geogebra.org/license

### 其他

为了缩减离线包的大小，语言包目前只支持中文与英文，如果有其他语言的需要请下载[GeoGebra语言包](https://download.geogebra.org/package/geogebra-math-apps-bundle)，解压并找到‘GeoGebra\HTML5\5.0\web3d\js\properties_keys_**.js’，星号代表语言，例如zh-CN是中文。找到你需要的语言，将其复制到该插件文件夹相同js目录下。

# 更新日志

## v0.0.8
- “InsetBlock”功能增强，使用LSB隐写术，直接将Geogebra文件保存到
   图片中。但值得注意的是，该功能会让图片大小增大
- 用“ToImage”功能键下载的图片，同样使用LSB隐写术
- 在图片的右键菜单中加入“用GeogebraE打开”，该功能适用于使用LSB隐写术保存的图片，
可以用Geogebra直接编辑图片的内容

## v0.0.7
- 更改为“插件”版本
- 加入“/”指令，调用GeogebraE
- 优化体验
- 加入“FullScreen”功能

## v0.0.6
- 将离线版本设为默认加载项

## v0.0.5
- 取消“Resize”功能按键
- 加入“Reload”功能按键
- 加入图片下载功能
- 加入"把活动界面转换为图片并插入GeogebraE挂件块下方"

## v0.0.4
- 加入自动离线版本，如出现Bug可以切换为在线模式

## v0.0.3
- 加入对于在线使用的网络请求结果显示
- 更换数据存储方案
- 移除“Evaluator”模式
- 移除“Load”按钮

## v0.0.2
- 修复单个笔记使用多个GeogebraE无法保存的问题
- 修复离线版本不能使用的问题
- 更换preview图

## v0.0.1
- 简单的将Geogebra嵌入到思源挂件中