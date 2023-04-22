let widgetBlockEle = window.frameElement.parentElement.parentElement;
let id = widgetBlockEle.getAttribute('data-node-id');
let modelTmp = 'Graphing'
let base64Tmp = ''
let object
let object_index = -1

solveGet(getData('/api/storage/getLocalStorage')).then(r=>{
    object = r.GeogebraE
    // console.log(object)
    if(object == null){
        // object = [{key: id, model: modelTmp, base64: base64Tmp}]
        solveGet(getData('/api/storage/setLocalStorageVal', {
            app: "",
            key: "GeogebraE",
            val: object
        }))
        object_index = 0
        initGE("Graphing")
    }else{
        // console.log(object[object_index], object_index)
        for (let i = 0; i < object.length; i++) {
            // console.log(object[i].key)
            if(object[i].key == id){
                object_index = i
                console.log("isID: ", object_index)
            }
        }

        if(object_index == -1){
            // console.log("isNotID: ", object_index)
            object.push({key: id,model: modelTmp, base64: base64Tmp})
            object_index = object.length-1
        }

        // console.log(object[object_index], object_index)
        initGE(object[object_index].model)

        setTimeout(() => {
            ggbApplet.setBase64(object[object_index].base64)
            // console.clear()
        }, 1000);
    }
})

function Clean() {
    getData('/api/storage/setLocalStorageVal', {
        app: "",
        key: "GeogebraE",
        val: []
    })
}

function save() {
    // console.log("Save-modelTmp: ",modelTmp)
    object[object_index].model = modelTmp
    object[object_index].base64 = ggbApplet.getBase64()
    getData('/api/storage/setLocalStorageVal', {
        app: "",
        key: "GeogebraE",
        val: object
    })
    // console.log("Save: ",object)
}

function load() {
    ggbApplet.setBase64(object[object_index].base64)
}

function resize() {
    var GE = document.getElementById("GeogebraE")
    ggbApplet.setSize(GE.clientWidth-2, GE.clientHeight-35)
}

function initGE(model) {
    modelTmp = model
    // console.log("initGE: " ,modelTmp)
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

// Get Data
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
        let error_msg=`API Error:(${url})${response.status} ${response.statusText}`
        console.error(error_msg)
    })
    return resData
}