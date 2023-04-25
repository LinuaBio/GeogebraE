let GEframeElement = window.frameElement
let widgetBlockEle = GEframeElement.parentElement.parentElement;
let id = widgetBlockEle.getAttribute('data-node-id');
let object = { isOffline:'false', model: 'GeogebraE', base64: '' }
let webGet = 0
var observer = new PerformanceObserver(perf_observer);
function LoadPlugin() {
    observer.observe({entryTypes: ["resource"]});
    init()
}
function perf_observer(list) {
    var requests = getNetworkRequests(list.getEntriesByType('resource'));
    printRequest(requests);
}
function getNetworkRequests(
    entries = performance.getEntriesByType('resource'),
    type = ['script', 'xmlhttprequest']) {
    return entries.filter(entry =>{
        return type. indexOf(entry.initiatorType)>-1;
    })
}
function printRequest(requests) {
    requests.map(request  => {
        if(request.name.indexOf("geogebra") != -1){
            webGet++
            document.getElementById("CoverGE_inf").innerHTML ='GeoGebraE : ' + 10*webGet + "%";
            if(webGet == 8){
                observer.observe({ entryTypes: ["resource"] });
                document.getElementById("CoverGE_body").style.display = 'none';
                document.getElementById("GeogebraE").style.display = 'block';
                ggbApplet.setBase64(object.base64)
            }
        }
    })
}
function init() {
    solveGet(request('/api/attr/getBlockAttrs', {id:id})).then(r=>{
        if(r['custom-GeogebraE-model'] == null){
            request('/api/attr/setBlockAttrs', {id,
                attrs: {
                    "custom-GeogebraE-isOffline": object.isOffline.toString(),
                    "custom-GeogebraE-model": object.model,
                    "custom-GeogebraE-base64": object.base64,
                }
            })
        }else{
            object.isOffline = r['custom-GeogebraE-isOffline']
            object.model = r['custom-GeogebraE-model']
            object.base64 = r['custom-GeogebraE-base64']
        }
        RenderingGE(object.model)
    })
}
function save(inf = "保存成功") {
    object.base64 = ggbApplet.getBase64()
    request('/api/attr/setBlockAttrs', {id,
        attrs: {
            "custom-GeogebraE-isOffline": object.isOffline.toString(),
            "custom-GeogebraE-model": object.model,
            "custom-GeogebraE-base64": object.base64,
        }
    })
    request('/api/notification/pushMsg', {
        msg: inf,
        timeout: 2000
    })
}
function reload() {
    document.location.reload()
}
function loadFromV2() {
    solveGet(request('/api/storage/getLocalStorage')).then(r=>{
        var object_index = -1
        var objectTmp = r.GeogebraE
        if(objectTmp == null){
            request('/api/notification/pushMsg', {
                msg: "你没有来自版本0.0.2的数据",
                timeout: 3000
            })
        }else{
            for (let i = 0; i < objectTmp.length; i++) {
                if(objectTmp[i].key == id){
                    object_index = i
                }
            }
            if(object_index == -1){
                request('/api/notification/pushMsg', {
                    msg: "你没有来自版本0.0.2的数据",
                    timeout: 3000
                })
            }else{
                object.base64 = objectTmp[object_index].base64
                object.model = objectTmp[object_index].model
                RenderingGE(object.model)
                ggbApplet.setBase64(object.base64)
                request('/api/notification/pushMsg', {
                    msg: "加载成功，并更新为v0.0.3",
                    timeout: 3000
                })
            }
            request('/api/storage/removeLocalStorageVals', {
                app: "",
                keys: ["GeogebraE"],
            })
        }
    })
}
function offline(isOffline, reload=false) {
    object.isOffline = isOffline
    if(reload){
        setTimeout(() => {
            reload()
        }, 3000);
    }else{
        save("Offline: " + isOffline)
    }
}
function download(getImage=false) {
    const imgUrl = `data:image/png;base64,${ggbApplet.getPNGBase64(1,false)}`
    if(getImage){
        return imgUrl
    }else{
        const image = document.createElement('a')
        image.href = imgUrl
        image.setAttribute('download', 'Geogebra')
        image.click()
    }
}
function InsetBlock() {
    solveGet(request('/api/lute/html2BlockDOM', {
        dom: `<img src="${download(true)}"/>`
    })).then(r =>{
        // console.log(r.match(RegExp(`(?<=assets/).*?(?=")`))[0])
        request('/api/block/insertBlock', {
            dataType: 'markdown',
            data: `![](${r.match(RegExp(`assets/.*?(?=")`))[0]})`,
            previousID: id
        })
    })
}
function RenderingGE(model) {
    object.model = model
    var params = {
        "appName": model, 
        "width": GEframeElement.clientWidth, 
        "height": GEframeElement.clientHeight-35, 
        "showToolBar": true, 
        "showAlgebraInput": true, 
        "showMenuBar": true 
    };
    var applet = new GGBApplet(params, '5.0');
    // console.log("RenderingGE: ",object)
    if(object.isOffline == "true"){
        applet.setHTML5Codebase('/widgets/GeogebraE/geogebra/web3d/');
    }
    applet.inject('ggb-element');
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