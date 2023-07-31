import {
    Dialog
} from "siyuan";
import GeogebraPage from '@/page/geogebra-page.svelte'
import { getWorkspaces, insertBlock } from "@/api";
import { writeLSB } from "./lsb";

let object = { isOffline: "true", model: "GeogebraE", base64: "" };

function loadJSFile(jsUrl: string, callback?: () => void) {
    const script = document.createElement('script');
    script.src = jsUrl;
    if (callback) {
        script.onload = callback;
    }
    document.head.appendChild(script);
}
function openDialog(id: string, callback) {
    let dialog = new Dialog({
        title: " ",
        content: `<div id="ggb-element"></div>`,
        width: this.isMobile ? "92vw" : "720px",
        height: this.isMobile ? "92vh" : "500px",
    });

    new GeogebraPage({
        target: dialog.element.querySelector(".b3-dialog__header"),
        props: {
            id: id,
        }
    });

    RenderingGE(object.model, 760, 500, (CheckedGgbApplet) => {
        let geogebraBox = document.getElementsByClassName(
            "b3-dialog__body"
        )[0] as HTMLElement;
        geogebraBox.style.overflow = "hidden";
        var observer = new ResizeObserver(function () {
            if (CheckedGgbApplet !== null) {
                CheckedGgbApplet.setSize(geogebraBox.clientWidth, geogebraBox.clientHeight);
            }
        });
        observer.observe(geogebraBox);
        callback(CheckedGgbApplet);
    });
}
function RenderingGE(model, width, height, callback) {
    object.model = model;
    var params = {
        appName: model,
        width: width,
        height: height,
        showToolBar: true,
        showAlgebraInput: true,
        showMenuBar: true,
    };
    new GGBApplet(params, "5.0");
    var applet = new GGBApplet(params, "5.0");
    if (object.isOffline == "true") {
        applet.setHTML5Codebase("/plugins/GeogebraE/geogebra/web3d/");
    }
    setTimeout(function () {
        applet.inject("ggb-element");
    }, 10);
    console.log(applet)

    let ggbAppletReadyInterval = setInterval(function () {
        //@ts-ignore
        if (typeof ggbApplet !== 'undefined' && typeof ggbApplet.setBase64 === 'function') {
            // console.log("Geogebra Loaded", typeof ggbApplet.setBase64)
            clearInterval(ggbAppletReadyInterval);
            //@ts-ignore
            callback(ggbApplet);
        }
    }, 500);
}

// function download(getImage = false) {
//     const imgUrl = `data:image/png;base64,${ggbApplet.getPNGBase64(1, false)}`
//     embedStringIntoImage(imgUrl, ggbApplet.getBase64(), ()=>{
//         if (getImage) {
//             console.log(imgUrl)
//             return imgUrl
//         } else {
//             const image = document.createElement('a')
//             image.href = imgUrl
//             image.setAttribute('download', 'Geogebra')
//             image.click()
//         }
//     })
// }
function download(getImage = false, callback) {
    const imgUrl = `data:image/png;base64,${ggbApplet.getPNGBase64(1, false)}`;
    writeLSB(imgUrl, ggbApplet.getBase64(), (err, outputBase64) => {
        if (err) {
            console.log(err)
            return
        }
        if (getImage) {
            callback(outputBase64);
        } else {
            const image = document.createElement('a');
            image.href = outputBase64;
            image.setAttribute('download', 'Geogebra');
            image.click();
        }
    })
}
function saveFile(base64Data: string, callback) {
    const fs = window.require('fs');
    // 提取 MIME 类型和数据部分
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    const base64Content = matches[2];

    // 将 Base64 数据解码为二进制数据
    const fileData = Buffer.from(base64Content, 'base64');

    // 将二进制数据写入文件
    getWorkspaces().then(r => {
        let path = r[0].path + '/data/plugins/GeogebraE/geogebra.png'
        fs.writeFile(path, fileData, 'binary', function (err) {
            if (err) {
                console.error('保存文件发生错误:', err);
            } else {
                console.log('文件已保存');
                callback(path)
            }
        });
    })
}
function InsetBlock(id: string) {
    download(true, (imgUrl) => {
        saveFile(imgUrl, (path) => {
            solveGet(request('/api/lute/html2BlockDOM', {
                dom: `<img src="${path}"/>`
            })).then(r => {
                console.log("insertBlock", id)
                // console.log(r)
                // protyle.insert(`![](${r.match(RegExp(`assets/.*?(?=")`))[0]})`)
                // getWorkspaces().then(path=>{
                //     insertLocalAssets([path[0].path+'/data/'+r.match(RegExp(`assets/.*?(?=")`))[0]], true, id)
                // })
                // setTimeout(() => {
                insertBlock('markdown', `![](${r.match(RegExp(`assets/.*?(?=")`))[0]})`, id)
                // }, 1000);
            })
        })
    })
}
function Save() {
    // const xmlString = ggbApplet.getXML();
    // self.saveData()
}
function LoadFromBase64(data: string) {
    ggbApplet.setBase64(data)
}
function ImageUrl2Base64(imageUrl: string, callback: (base64: string) => void) {
    var img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = function () {
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);
        var base64 = canvas.toDataURL();
        callback(base64);
    };
    img.src = imageUrl;
}

function getCursorPosition() {
    var cursorPos = {
        container: null,
        position: 0
    };

    if (window.getSelection) {
        var sel = window.getSelection();
        if (sel.rangeCount > 0) {
            var range = sel.getRangeAt(0);
            cursorPos.container = range.startContainer;
            cursorPos.position = range.startOffset;
        }
    }

    return cursorPos;
}
function deleteCharacterBeforeCursor() {
    var sel = window.getSelection();

    if (sel.rangeCount > 0) {
        var range = sel.getRangeAt(0);
        var container = range.startContainer;
        var offset = range.startOffset;

        if (offset >= 0) {
            range.setStart(container, offset);
            range.deleteContents();
        }
    }
}

async function solveGet(response) {
    let r = await response
    return r && r.code === 0 ? r.data : null
}
async function request(url, data) {
    return fetch(url, {
        body: JSON.stringify(data),
        method: 'POST',
        headers: {
            Authorization: `Token ' '`,
        }
    }).then(r => {
        if (r.status === 200)
            return r.json();
        else return null;
    });
}
export {
    RenderingGE, download, InsetBlock, Save, openDialog,
    LoadFromBase64, ImageUrl2Base64, loadJSFile, getCursorPosition,
    deleteCharacterBeforeCursor
}