let widgetBlockEle = window.frameElement.parentElement.parentElement;
let id = widgetBlockEle.getAttribute('data-node-id');
let modleTmp
let LocalStorage

solveGet(getData('/api/storage/getLocalStorage')).then(r=>{
    LocalStorage = r
    if(r == null || r.GeogebraE[0] == null){
        solveGet(getData('/api/storage/setLocalStorageVal', {
            app: "",
            key: "GeogebraE",
            val: "notes"
        }))
        initGE("notes")
    }else{
        initGE(r.GeogebraE[0])
        setTimeout(() => {
            ggbApplet.setBase64(r.GeogebraE[1])
            console.clear()
        }, 1000);
    }
})

function save() {
    base64Tmp = ggbApplet.getBase64();
    LocalStorage.GeogebraE[1] = base64Tmp
    getData('/api/storage/setLocalStorageVal', {
        app: "",
        key: "GeogebraE",
        val: [modleTmp, base64Tmp]
    })
}

function load() {
    ggbApplet.setBase64(LocalStorage.GeogebraE[1])
}

function resize() {
    var GE = document.getElementById("GeogebraE")
    ggbApplet.setSize(GE.clientWidth-2, GE.clientHeight-35)
}

function initGE(model) {
    modleTmp = model
    var GE = document.getElementById("GeogebraE")
    var params = {
        "appName": model, 
        "width": GE.clientWidth-2, 
        "height": GE.clientHeight-35, 
        "showToolBar": true, 
        "showAlgebraInput": true, 
        "showMenuBar": true 
    };
    var applet = new GGBApplet(params, '5.0');
    applet.inject('ggb-element');
}

async function solveGet(response) {
    let r = await response
    return r && r.code === 0 ? r.data : null
}
async function getData(url, data) {
    let resData = null
    await fetch(url, {
        body: JSON.stringify(data),
        method: 'POST',
        headers: {
            Authorization: `Token ''`,
        }
    }).then(function (response) {
        if(response.ok){
            resData = response.json()
            return
        }
        let error_msg=`API Errer:(${url})${response.status} ${response.statusText}`
        console.error(error_msg)
    })
    return resData
}