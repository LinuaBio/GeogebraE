(function(l2, r2) {
  if (!l2 || l2.getElementById("livereloadscript"))
    return;
  r2 = l2.createElement("script");
  r2.async = 1;
  r2.src = "//" + (self.location.host || "localhost").split(":")[0] + ":35729/livereload.js?snipver=1";
  r2.id = "livereloadscript";
  l2.getElementsByTagName("head")[0].appendChild(r2);
})(self.document);
"use strict";
const siyuan = require("siyuan");
const index = "";
/*
  @author: GeoGebra - Dynamic Mathematics for Everyone, http://www.geogebra.org
  @license: This file is subject to the GeoGebra Non-Commercial License Agreement, see http://www.geogebra.org/license. For questions please write us at office@geogebra.org.
*/
(function() {
  if (typeof window.GGBApplet == "function") {
    console.warn("deployggb.js was loaded twice");
    return;
  }
  var isRenderGGBElementEnabled = false;
  var scriptLoadStarted = false;
  var html5AppletsToProcess = null;
  var ggbHTML5LoadedCodebaseIsWebSimple = false;
  var ggbHTML5LoadedCodebaseVersion = null;
  var ggbHTML5LoadedScript = null;
  var GGBApplet = function() {
    var applet = {};
    var ggbVersion = "5.0";
    var parameters = {};
    var views = null;
    var html5NoWebSimple = false;
    var html5NoWebSimpleParamExists = false;
    var appletID = null;
    var initComplete = false;
    var html5OverwrittenCodebaseVersion = null;
    var html5OverwrittenCodebase = null;
    for (var i2 = 0; i2 < arguments.length; i2++) {
      var p2 = arguments[i2];
      if (p2 !== null) {
        switch (typeof p2) {
          case "number":
            ggbVersion = p2.toFixed(1);
            break;
          case "string":
            if (p2.match(new RegExp("^[0-9]\\.[0-9]+$"))) {
              ggbVersion = p2;
            } else {
              appletID = p2;
            }
            break;
          case "object":
            if (typeof p2.is3D !== "undefined") {
              views = p2;
            } else {
              parameters = p2;
            }
            break;
          case "boolean":
            html5NoWebSimple = p2;
            html5NoWebSimpleParamExists = true;
            break;
        }
      }
    }
    if (views === null) {
      views = { is3D: false, AV: false, SV: false, CV: false, EV2: false, CP: false, PC: false, DA: false, FI: false, PV: false, macro: false };
      if (parameters.material_id !== void 0 && !html5NoWebSimpleParamExists) {
        html5NoWebSimple = true;
      }
    }
    if (appletID !== null && parameters.id === void 0) {
      parameters.id = appletID;
    }
    var html5Codebase = "";
    var isHTML5Offline = false;
    var loadedAppletType = null;
    var html5CodebaseVersion = null;
    var html5CodebaseScript = null;
    var html5CodebaseIsWebSimple = false;
    var previewImagePath = null;
    var previewLoadingPath = null;
    var fonts_css_url = null;
    if (parameters.height !== void 0) {
      parameters.height = Math.round(parameters.height);
    }
    if (parameters.width !== void 0) {
      parameters.width = Math.round(parameters.width);
    }
    var parseVersion = function(d2) {
      return parseFloat(d2) > 4 ? parseFloat(d2) : 5;
    };
    applet.setHTML5Codebase = function(codebase, offline) {
      html5OverwrittenCodebase = codebase;
      setHTML5CodebaseInternal(codebase, offline);
    };
    applet.setJavaCodebase = applet.setJavaCodebaseVersion = applet.isCompiledInstalled = applet.setPreCompiledScriptPath = applet.setPreCompiledResourcePath = function() {
    };
    applet.setHTML5CodebaseVersion = function(version, offline) {
      var numVersion = parseFloat(version);
      if (numVersion !== NaN && numVersion < 5) {
        console.log("The GeoGebra HTML5 codebase version " + numVersion + " is deprecated. Using version latest instead.");
        return;
      }
      html5OverwrittenCodebaseVersion = version;
      setDefaultHTML5CodebaseForVersion(version, offline);
    };
    applet.getHTML5CodebaseVersion = function() {
      return html5CodebaseVersion;
    };
    applet.getParameters = function() {
      return parameters;
    };
    applet.setFontsCSSURL = function(url) {
      fonts_css_url = url;
    };
    applet.setGiacJSURL = function(url) {
    };
    applet.setJNLPFile = function(newJnlpFilePath) {
    };
    applet.setJNLPBaseDir = function(baseDir) {
    };
    applet.inject = function() {
      function isOwnIFrame() {
        return window.frameElement && window.frameElement.getAttribute("data-singleton");
      }
      var type = "auto";
      var container_ID = parameters.id;
      var container;
      var noPreview = false;
      for (var i3 = 0; i3 < arguments.length; i3++) {
        var p3 = arguments[i3];
        if (typeof p3 === "string") {
          p3 = p3.toLowerCase();
          if (p3.match(/^(prefer)?(java|html5|compiled|auto|screenshot)$/)) {
            type = p3;
          } else {
            container_ID = arguments[i3];
          }
        } else if (typeof p3 === "boolean") {
          noPreview = p3;
        } else if (p3 instanceof HTMLElement) {
          container = p3;
        }
      }
      continueInject();
      function continueInject() {
        if (!initComplete) {
          setTimeout(continueInject, 200);
          return;
        }
        type = detectAppletType(type);
        var appletElem = container || document.getElementById(container_ID);
        if (!appletElem) {
          console.log("possibly bug on ajax loading? ");
          return;
        }
        applet.removeExistingApplet(appletElem, false);
        if (parameters.width === void 0 && appletElem.clientWidth) {
          parameters.width = appletElem.clientWidth;
        }
        if (parameters.height === void 0 && appletElem.clientHeight) {
          parameters.height = appletElem.clientHeight;
        }
        if (!(parameters.width && parameters.height) && type === "html5") {
          delete parameters.width;
          delete parameters.height;
        }
        loadedAppletType = type;
        if (type === "screenshot") {
          injectScreenshot(appletElem, parameters);
        } else {
          var playButton = false;
          if (parameters.hasOwnProperty("playButton") && parameters.playButton || parameters.hasOwnProperty("clickToLoad") && parameters.clickToLoad) {
            playButton = true;
          } else if (parameters.hasOwnProperty("playButtonAutoDecide") && parameters.playButtonAutoDecide) {
            playButton = (!isInIframe() || isOwnIFrame()) && isMobileDevice();
          }
          if (playButton) {
            loadedAppletType = "screenshot";
            injectPlayButton(appletElem, parameters, noPreview, type);
          } else {
            injectHTML5Applet(appletElem, parameters, noPreview);
          }
        }
      }
      return;
    };
    function isInIframe() {
      try {
        return window.self !== window.top;
      } catch (e2) {
        return true;
      }
    }
    function isMobileDevice() {
      if (parameters.hasOwnProperty("screenshotGenerator") && parameters.screenshotGenerator) {
        return false;
      }
      return Math.max(screen.width, screen.height) < 800;
    }
    applet.getViews = function() {
      return views;
    };
    applet.isJavaInstalled = function() {
      return false;
    };
    var fetchParametersFromApi = function(successCallback) {
      var onSuccess = function(text2) {
        var jsonData = JSON.parse(text2);
        var isGeoGebra = function(element2) {
          return element2.type == "G" || element2.type == "E";
        };
        var item = jsonData.elements ? jsonData.elements.filter(isGeoGebra)[0] : jsonData;
        if (!item || !item.url) {
          onError();
          return;
        }
        parameters.fileName = item.url;
        updateAppletSettings(item.settings || {});
        views.is3D = true;
        var imageDir = "https://www.geogebra.org/images/";
        applet.setPreviewImage(previewImagePath || item.previewUrl, imageDir + "GeoGebra_loading.png", imageDir + "applet_play.png");
        successCallback();
      };
      var onError = function() {
        parameters.onError && parameters.onError();
        log("Error: Fetching material (id " + parameters.material_id + ") failed.", parameters);
      };
      var host = location.host.match(/(www|stage|beta|groot|alpha).geogebra.(org|net)/) ? location.host : "www.geogebra.org";
      var path = "/materials/" + parameters.material_id + "?scope=basic";
      sendCorsRequest("https://" + host + "/api/proxy.php?path=" + encodeURIComponent(path), onSuccess, onError);
    };
    function updateAppletSettings(settings) {
      var parameterNames = ["width", "height", "showToolBar", "showMenuBar", "showAlgebraInput", "allowStyleBar", "showResetIcon", "enableLabelDrags", "enableShiftDragZoom", "enableRightClick", "appName"];
      ["enableLabelDrags", "enableShiftDragZoom", "enableRightClick"].forEach(function(name2) {
        settings[name2] = !!settings[name2];
      });
      parameterNames.forEach(function(name2) {
        if (parameters[name2] === void 0 && settings[name2] !== void 0) {
          parameters[name2] = settings[name2];
        }
      });
      if (parameters.showToolBarHelp === void 0) {
        parameters.showToolBarHelp = parameters.showToolBar;
      }
    }
    function sendCorsRequest(url, onSuccess, onError) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.onload = function() {
        onSuccess(xhr.responseText);
      };
      xhr.onerror = onError;
      xhr.send();
    }
    applet.isHTML5Installed = function() {
      return true;
    };
    applet.getLoadedAppletType = function() {
      return loadedAppletType;
    };
    applet.setPreviewImage = function(previewFilePath, loadingFilePath, playFilePath) {
      previewImagePath = previewFilePath;
      previewLoadingPath = loadingFilePath;
    };
    applet.removeExistingApplet = function(appletParent, showScreenshot) {
      var i3;
      if (typeof appletParent === "string") {
        appletParent = document.getElementById(appletParent);
      }
      loadedAppletType = null;
      var removedID = null;
      for (i3 = 0; i3 < appletParent.childNodes.length; i3++) {
        var currentChild = appletParent.childNodes[i3];
        var className = currentChild.className;
        if (className === "applet_screenshot") {
          if (showScreenshot) {
            currentChild.style.display = "block";
            loadedAppletType = "screenshot";
          } else {
            currentChild.style.display = "none";
          }
        } else if (className !== "applet_scaler prerender") {
          appletParent.removeChild(currentChild);
          removedID = className && className.indexOf("appletParameters") != -1 ? currentChild.id : null;
          i3--;
        }
      }
      var appName = parameters.id !== void 0 ? parameters.id : removedID;
      var app = window[appName];
      if (app && typeof app.getBase64 === "function") {
        app.remove();
        window[appName] = null;
      }
    };
    applet.refreshHitPoints = function() {
      if (parseVersion(ggbHTML5LoadedCodebaseVersion) >= 5) {
        return true;
      }
      var app = applet.getAppletObject();
      if (app) {
        if (typeof app.recalculateEnvironments === "function") {
          app.recalculateEnvironments();
          return true;
        }
      }
      return false;
    };
    applet.startAnimation = function() {
      var app = applet.getAppletObject();
      if (app) {
        if (typeof app.startAnimation === "function") {
          app.startAnimation();
          return true;
        }
      }
      return false;
    };
    applet.stopAnimation = function() {
      var app = applet.getAppletObject();
      if (app) {
        if (typeof app.stopAnimation === "function") {
          app.stopAnimation();
          return true;
        }
      }
      return false;
    };
    applet.getAppletObject = function() {
      var appName = parameters.id !== void 0 ? parameters.id : "ggbApplet";
      return window[appName];
    };
    applet.resize = function() {
    };
    var valBoolean = function(value) {
      return value && value !== "false";
    };
    var injectHTML5Applet = function(appletElem, parameters2, noPreview) {
      if (parseVersion(html5CodebaseVersion) <= 4.2) {
        noPreview = true;
      }
      var loadScript = !isRenderGGBElementEnabled && !scriptLoadStarted;
      if (!isRenderGGBElementEnabled && !scriptLoadStarted || (ggbHTML5LoadedCodebaseVersion !== html5CodebaseVersion || ggbHTML5LoadedCodebaseIsWebSimple && !html5CodebaseIsWebSimple)) {
        loadScript = true;
        isRenderGGBElementEnabled = false;
        scriptLoadStarted = false;
      }
      var article = document.createElement("div");
      article.classList.add("appletParameters", "notranslate");
      var oriWidth = parameters2.width;
      var oriHeight = parameters2.height;
      parameters2.disableAutoScale = parameters2.disableAutoScale === void 0 ? GGBAppletUtils.isFlexibleWorksheetEditor() : parameters2.disableAutoScale;
      if (parameters2.width !== void 0) {
        if (parseVersion(html5CodebaseVersion) <= 4.4) {
          if (valBoolean(parameters2.showToolBar)) {
            parameters2.height -= 7;
          }
          if (valBoolean(parameters2.showAlgebraInput)) {
            parameters2.height -= 37;
          }
          if (parameters2.width < 605 && valBoolean(parameters2.showToolBar)) {
            parameters2.width = 605;
            oriWidth = 605;
          }
        } else {
          var minWidth = 100;
          if (valBoolean(parameters2.showToolBar) || valBoolean(parameters2.showMenuBar)) {
            if (parameters2.hasOwnProperty("customToolBar")) {
              parameters2.customToolbar = parameters2.customToolBar;
            }
            minWidth = valBoolean(parameters2.showMenuBar) ? 245 : 155;
          }
          if (oriWidth < minWidth) {
            parameters2.width = minWidth;
            oriWidth = minWidth;
          }
        }
      }
      article.style.border = "none";
      article.style.display = "inline-block";
      for (var key in parameters2) {
        if (parameters2.hasOwnProperty(key) && key !== "appletOnLoad") {
          article.setAttribute("data-param-" + key, parameters2[key]);
        }
      }
      if (fonts_css_url) {
        article.setAttribute("data-param-fontscssurl", fonts_css_url);
      }
      applet.resize = function() {
        GGBAppletUtils.responsiveResize(appletElem, parameters2);
      };
      window.addEventListener("resize", function(evt) {
        applet.resize();
      });
      var oriAppletOnload = typeof parameters2.appletOnLoad === "function" ? parameters2.appletOnLoad : function() {
      };
      if (!noPreview && parameters2.width !== void 0) {
        if (!parameters2.hasOwnProperty("showSplash")) {
          article.setAttribute("data-param-showSplash", "false");
        }
        var previewPositioner = appletElem.querySelector(".applet_scaler.prerender");
        var preRendered = previewPositioner !== null;
        if (!preRendered) {
          var previewContainer = createScreenShotDiv(oriWidth, oriHeight, parameters2.borderColor, false);
          previewPositioner = document.createElement("div");
          previewPositioner.className = "applet_scaler";
          previewPositioner.style.position = "relative";
          previewPositioner.style.display = "block";
          previewPositioner.style.width = oriWidth + "px";
          previewPositioner.style.height = oriHeight + "px";
        } else {
          var previewContainer = previewPositioner.querySelector(".ggb_preview");
        }
        if (window.GGBT_spinner) {
          window.GGBT_spinner.attachSpinner(previewPositioner, "66%");
        }
        if (parseVersion(html5CodebaseVersion) >= 5) {
          parameters2.appletOnLoad = function(api) {
            var preview = appletElem.querySelector(".ggb_preview");
            if (preview) {
              preview.parentNode.removeChild(preview);
            }
            if (window.GGBT_spinner) {
              window.GGBT_spinner.removeSpinner(previewPositioner);
            }
            if (window.GGBT_wsf_view) {
              $(window).trigger("resize");
            }
            oriAppletOnload(api);
          };
          if (!preRendered) {
            previewPositioner.appendChild(previewContainer);
          }
        } else {
          article.appendChild(previewContainer);
        }
        previewPositioner.appendChild(article);
        if (!preRendered) {
          appletElem.appendChild(previewPositioner);
        }
        setTimeout(function() {
          applet.resize();
        }, 1);
      } else {
        var appletScaler = document.createElement("div");
        appletScaler.className = "applet_scaler";
        appletScaler.style.position = "relative";
        appletScaler.style.display = "block";
        appletScaler.appendChild(article);
        appletElem.appendChild(appletScaler);
        parameters2.appletOnLoad = function(api) {
          applet.resize();
          oriAppletOnload(api);
        };
      }
      function renderGGBElementWithParams(article2, parameters3) {
        if (parameters3 && typeof parameters3.appletOnLoad === "function" && typeof renderGGBElement === "function") {
          renderGGBElement(article2, parameters3.appletOnLoad);
        } else {
          renderGGBElement(article2);
        }
        log("GeoGebra HTML5 applet injected and rendered with previously loaded codebase.", parameters3);
      }
      function renderGGBElementOnTube(a, parameters3) {
        if (typeof renderGGBElement === "undefined") {
          if (html5AppletsToProcess === null) {
            html5AppletsToProcess = [];
          }
          html5AppletsToProcess.push({ article: a, params: parameters3 });
          window.renderGGBElementReady = function() {
            isRenderGGBElementEnabled = true;
            if (html5AppletsToProcess !== null && html5AppletsToProcess.length) {
              html5AppletsToProcess.forEach(function(obj) {
                renderGGBElementWithParams(obj.article, obj.params);
              });
              html5AppletsToProcess = null;
            }
          };
          if (parseVersion(html5CodebaseVersion) < 5) {
            a.className += " geogebraweb";
          }
        } else {
          renderGGBElementWithParams(a, parameters3);
        }
      }
      if (loadScript) {
        scriptLoadStarted = true;
        for (var i3 = 0; i3 < article.childNodes.length; i3++) {
          var tag = article.childNodes[i3].tagName;
          if (tag === "TABLE") {
            article.removeChild(article.childNodes[i3]);
            i3--;
          }
        }
        if (ggbHTML5LoadedScript !== null) {
          var el = document.querySelector('script[src="' + ggbHTML5LoadedScript + '"]');
          if (el !== void 0 && el !== null) {
            el.parentNode.removeChild(el);
          }
        }
        var script = document.createElement("script");
        var scriptLoaded = function() {
          renderGGBElementOnTube(article, parameters2);
        };
        script.src = html5Codebase + html5CodebaseScript;
        ggbHTML5LoadedCodebaseIsWebSimple = html5CodebaseIsWebSimple;
        ggbHTML5LoadedCodebaseVersion = html5CodebaseVersion;
        ggbHTML5LoadedScript = script.src;
        log("GeoGebra HTML5 codebase loaded: '" + html5Codebase + "'.", parameters2);
        if (!html5OverwrittenCodebase && (!html5OverwrittenCodebaseVersion || html5OverwrittenCodebaseVersion == "5.0")) {
          if (html5CodebaseIsWebSimple) {
            webSimple.succeeded = webSimple.succeeded || webSimple();
          } else {
            web3d.succeeded = web3d.succeeded || web3d();
          }
          scriptLoaded();
        } else if (html5Codebase.requirejs) {
          require(["geogebra/runtime/js/web3d/web3d.nocache"], scriptLoaded);
        } else {
          script.onload = scriptLoaded;
          appletElem.appendChild(script);
        }
      } else {
        renderGGBElementOnTube(article, parameters2);
      }
      parameters2.height = oriHeight;
      parameters2.width = oriWidth;
    };
    var injectScreenshot = function(appletElem, parameters2, showPlayButton) {
      var previewContainer = createScreenShotDiv(parameters2.width, parameters2.height, parameters2.borderColor, showPlayButton);
      var previewPositioner = document.createElement("div");
      previewPositioner.style.position = "relative";
      previewPositioner.style.display = "block";
      previewPositioner.style.width = parameters2.width + "px";
      previewPositioner.style.height = parameters2.height + "px";
      previewPositioner.className = "applet_screenshot applet_scaler" + (showPlayButton ? " applet_screenshot_play" : "");
      previewPositioner.appendChild(previewContainer);
      var scale = GGBAppletUtils.getScale(parameters2, appletElem, showPlayButton);
      if (showPlayButton) {
        appletElem.appendChild(getPlayButton());
        if (!window.GGBT_wsf_view) {
          appletElem.style.position = "relative";
        }
      } else if (window.GGBT_spinner) {
        window.GGBT_spinner.attachSpinner(previewPositioner, "66%");
      }
      appletElem.appendChild(previewPositioner);
      if (scale !== 1 && !isNaN(scale)) {
        GGBAppletUtils.scaleElement(previewPositioner, scale);
        previewPositioner.style.width = parameters2.width + "px";
        previewPositioner.style.height = parameters2.height + "px";
        previewPositioner.parentNode.style.width = parameters2.width * scale + "px";
        previewPositioner.parentNode.style.height = parameters2.height * scale + "px";
      }
      applet.resize = function() {
        resizeScreenshot(appletElem, previewContainer, previewPositioner, showPlayButton);
      };
      window.addEventListener("resize", function(evt) {
        applet.resize();
      });
      applet.resize();
    };
    function resizeScreenshot(appletElem, previewContainer, previewPositioner, showPlayButton) {
      if (!appletElem.contains(previewContainer)) {
        return;
      }
      if (typeof window.GGBT_wsf_view === "object" && window.GGBT_wsf_view.isFullscreen()) {
        if (appletElem.id !== "fullscreencontent") {
          return;
        }
        window.GGBT_wsf_view.setCloseBtnPosition(appletElem);
      }
      var scale = GGBAppletUtils.getScale(parameters, appletElem, showPlayButton);
      if (previewPositioner.parentNode !== null) {
        if (!isNaN(scale) && scale !== 1) {
          GGBAppletUtils.scaleElement(previewPositioner, scale);
          previewPositioner.parentNode.style.width = parameters.width * scale + "px";
          previewPositioner.parentNode.style.height = parameters.height * scale + "px";
        } else {
          GGBAppletUtils.scaleElement(previewPositioner, 1);
          previewPositioner.parentNode.style.width = parameters.width + "px";
          previewPositioner.parentNode.style.height = parameters.height + "px";
        }
      }
      if (typeof window.GGBT_wsf_view === "object" && window.GGBT_wsf_view.isFullscreen()) {
        GGBAppletUtils.positionCenter(appletElem);
      }
      if (typeof window.GGBT_ws_header_footer === "object") {
        window.GGBT_ws_header_footer.setWsScrollerHeight();
      }
    }
    applet.onExitFullscreen = function(fullscreenContainer, appletElem) {
      appletElem.appendChild(fullscreenContainer);
    };
    var injectPlayButton = function(appletElem, parameters2, noPreview, type) {
      injectScreenshot(appletElem, parameters2, true);
      var play = function() {
        var elems = [];
        for (i3 = 0; i3 < appletElem.childNodes.length; i3++) {
          elems.push(appletElem.childNodes[i3]);
        }
        if (window.GGBT_wsf_view) {
          var content = window.GGBT_wsf_view.renderFullScreen(appletElem, parameters2.id);
          var container = document.getElementById("fullscreencontainer");
          var oldcontent = jQuery(appletElem).find(".fullscreencontent");
          if (oldcontent.length > 0) {
            content.remove();
            oldcontent.attr("id", "fullscreencontent").show();
            jQuery(container).append(oldcontent);
            window.dispatchEvent(new Event("resize"));
          } else {
            injectHTML5Applet(content, parameters2, false);
          }
          window.GGBT_wsf_view.launchFullScreen(container);
        } else {
          loadedAppletType = type;
          injectHTML5Applet(appletElem, parameters2, false);
        }
        if (!window.GGBT_wsf_view) {
          for (i3 = 0; i3 < elems.length; i3++) {
            appletElem.removeChild(elems[i3]);
          }
        }
      };
      var imgs = appletElem.getElementsByClassName("ggb_preview_play");
      for (var i3 = 0; i3 < imgs.length; i3++) {
        imgs[i3].addEventListener("click", play, false);
        imgs[i3].addEventListener("ontouchstart", play, false);
      }
      if (typeof window.ggbAppletPlayerOnload === "function") {
        window.ggbAppletPlayerOnload(appletElem);
      }
      if (isMobileDevice() && window.GGBT_wsf_view) {
        $(".wsf-element-fullscreen-button").remove();
      }
    };
    var getPlayButton = function() {
      var playButtonContainer = document.createElement("div");
      playButtonContainer.className = "ggb_preview_play icon-applet-play";
      if (!window.GGBT_wsf_view) {
        var css = '.icon-applet-play {   width: 100%;   height: 100%;box-sizing: border-box;position: absolute;z-index: 1001;cursor: pointer;border-width: 0px;   background-color: transparent;background-repeat: no-repeat;left: 0;top: 0;background-position: center center;   background-image: url("https://www.geogebra.org/images/worksheet/icon-start-applet.png");}.icon-applet-play:hover {background-image: url("https://www.geogebra.org/images/worksheet/icon-start-applet-hover.png");}';
        var style = document.createElement("style");
        if (style.styleSheet) {
          style.styleSheet.cssText = css;
        } else {
          style.appendChild(document.createTextNode(css));
        }
        document.getElementsByTagName("head")[0].appendChild(style);
      }
      return playButtonContainer;
    };
    var createScreenShotDiv = function(oriWidth, oriHeight, borderColor, showPlayButton) {
      var previewContainer = document.createElement("div");
      previewContainer.className = "ggb_preview";
      previewContainer.style.position = "absolute";
      previewContainer.style.zIndex = "90";
      previewContainer.style.width = oriWidth - 2 + "px";
      previewContainer.style.height = oriHeight - 2 + "px";
      previewContainer.style.top = "0px";
      previewContainer.style.left = "0px";
      previewContainer.style.overflow = "hidden";
      previewContainer.style.backgroundColor = "white";
      var bc = "lightgrey";
      if (borderColor !== void 0) {
        if (borderColor === "none") {
          bc = "transparent";
        } else {
          bc = borderColor;
        }
      }
      previewContainer.style.border = "1px solid " + bc;
      var preview = document.createElement("img");
      preview.style.position = "relative";
      preview.style.zIndex = "1000";
      preview.style.top = "-1px";
      preview.style.left = "-1px";
      if (previewImagePath !== null) {
        preview.setAttribute("src", previewImagePath);
      }
      preview.style.opacity = 0.7;
      if (previewLoadingPath !== null) {
        var previewOverlay;
        var pWidth, pHeight;
        if (!showPlayButton) {
          previewOverlay = document.createElement("img");
          previewOverlay.style.position = "absolute";
          previewOverlay.style.zIndex = "1001";
          previewOverlay.style.opacity = 1;
          preview.style.opacity = 0.3;
          pWidth = 360;
          if (pWidth > oriWidth / 4 * 3) {
            pWidth = oriWidth / 4 * 3;
          }
          pHeight = pWidth / 5.8;
          previewOverlay.setAttribute("src", previewLoadingPath);
          previewOverlay.setAttribute("width", pWidth);
          previewOverlay.setAttribute("height", pHeight);
          var pX = (oriWidth - pWidth) / 2;
          var pY = (oriHeight - pHeight) / 2;
          previewOverlay.style.left = pX + "px";
          previewOverlay.style.top = pY + "px";
          previewContainer.appendChild(previewOverlay);
        }
      }
      previewContainer.appendChild(preview);
      return previewContainer;
    };
    var detectAppletType = function(preferredType) {
      preferredType = preferredType.toLowerCase();
      if (preferredType === "html5" || preferredType === "screenshot") {
        return preferredType;
      }
      return "html5";
    };
    var modules = ["web", "webSimple", "web3d", "tablet", "tablet3d", "phone"];
    var setDefaultHTML5CodebaseForVersion = function(version, offline) {
      html5CodebaseVersion = version;
      if (offline) {
        setHTML5CodebaseInternal(html5CodebaseVersion, true);
        return;
      }
      var hasWebSimple = !html5NoWebSimple;
      if (hasWebSimple) {
        var v2 = parseVersion(html5CodebaseVersion);
        if (!isNaN(v2) && v2 < 4.4) {
          hasWebSimple = false;
        }
      }
      var protocol, codebase;
      if (window.location.protocol.substr(0, 4) === "http") {
        protocol = window.location.protocol;
      } else {
        protocol = "http:";
      }
      var index2 = html5CodebaseVersion.indexOf("//");
      if (index2 > 0) {
        codebase = html5CodebaseVersion;
      } else if (index2 === 0) {
        codebase = protocol + html5CodebaseVersion;
      } else {
        codebase = "https://www.geogebra.org/apps/5.0.760.0/";
      }
      for (var key in modules) {
        if (html5CodebaseVersion.slice(modules[key].length * -1) === modules[key] || html5CodebaseVersion.slice((modules[key].length + 1) * -1) === modules[key] + "/") {
          setHTML5CodebaseInternal(codebase, false);
          return;
        }
      }
      if (!GGBAppletUtils.isFlexibleWorksheetEditor() && hasWebSimple && !views.is3D && !views.AV && !views.SV && !views.CV && !views.EV2 && !views.CP && !views.PC && !views.DA && !views.FI && !views.PV && !valBoolean(parameters.showToolBar) && !valBoolean(parameters.showMenuBar) && !valBoolean(parameters.showAlgebraInput) && !valBoolean(parameters.enableRightClick) && (!parameters.appName || parameters.appName == "classic")) {
        codebase += "webSimple/";
      } else {
        codebase += "web3d/";
      }
      setHTML5CodebaseInternal(codebase, false);
    };
    var setHTML5CodebaseInternal = function(codebase, offline) {
      if (codebase.requirejs) {
        html5Codebase = codebase;
        return;
      }
      if (codebase.slice(-1) !== "/") {
        codebase += "/";
      }
      html5Codebase = codebase;
      if (offline === null) {
        offline = codebase.indexOf("http") === -1;
      }
      isHTML5Offline = offline;
      html5CodebaseScript = "web.nocache.js";
      html5CodebaseIsWebSimple = false;
      var folders = html5Codebase.split("/");
      if (folders.length > 1) {
        if (!offline && folders[folders.length - 2] === "webSimple") {
          html5CodebaseScript = "webSimple.nocache.js";
          html5CodebaseIsWebSimple = true;
        } else if (modules.indexOf(folders[folders.length - 2]) >= 0) {
          html5CodebaseScript = folders[folders.length - 2] + ".nocache.js";
        }
      }
      folders = codebase.split("/");
      html5CodebaseVersion = folders[folders.length - 3];
      if (html5CodebaseVersion.substr(0, 4) === "test") {
        html5CodebaseVersion = html5CodebaseVersion.substr(4, 1) + "." + html5CodebaseVersion.substr(5, 1);
      } else if (html5CodebaseVersion.substr(0, 3) === "war" || html5CodebaseVersion.substr(0, 4) === "beta") {
        html5CodebaseVersion = "5.0";
      }
      var numVersion = parseFloat(html5CodebaseVersion);
      if (numVersion !== NaN && numVersion < 5) {
        console.log("The GeoGebra HTML5 codebase version " + numVersion + " is deprecated. Using version latest instead.");
        setDefaultHTML5CodebaseForVersion("5.0", offline);
      }
    };
    var log = function(text2, parameters2) {
      if (window.console && window.console.log) {
        if (!parameters2 || typeof parameters2.showLogging === "undefined" || parameters2.showLogging && parameters2.showLogging !== "false") {
          console.log(text2);
        }
      }
    };
    if (parameters.material_id !== void 0) {
      fetchParametersFromApi(continueInit);
    } else {
      continueInit();
    }
    function continueInit() {
      var html5Version = ggbVersion;
      if (html5OverwrittenCodebaseVersion !== null) {
        html5Version = html5OverwrittenCodebaseVersion;
      } else {
        if (parseFloat(html5Version) < 5) {
          html5Version = "5.0";
        }
      }
      setDefaultHTML5CodebaseForVersion(html5Version, false);
      if (html5OverwrittenCodebase !== null) {
        setHTML5CodebaseInternal(html5OverwrittenCodebase, isHTML5Offline);
      }
      initComplete = true;
    }
    return applet;
  };
  var GGBAppletUtils = function() {
    function isFlexibleWorksheetEditor() {
      return window.GGBT_wsf_edit !== void 0;
    }
    function scaleElement(el, scale) {
      if (scale != 1) {
        el.style.transformOrigin = "0% 0% 0px";
        el.style.webkitTransformOrigin = "0% 0% 0px";
        el.style.transform = "scale(" + scale + "," + scale + ")";
        el.style.webkitTransform = "scale(" + scale + "," + scale + ")";
        el.style.maxWidth = "initial";
        if (el.querySelector(".ggb_preview") !== null) {
          el.querySelector(".ggb_preview").style.maxWidth = "initial";
        }
        if (el.querySelectorAll(".ggb_preview img")[0] !== void 0) {
          el.querySelectorAll(".ggb_preview img")[0].style.maxWidth = "initial";
        }
        if (el.querySelectorAll(".ggb_preview img")[1] !== void 0) {
          el.querySelectorAll(".ggb_preview img")[1].style.maxWidth = "initial";
        }
      } else {
        el.style.transform = "none";
        el.style.webkitTransform = "none";
      }
    }
    function getWidthHeight(appletElem, appletWidth, allowUpscale, autoHeight, noBorder, scaleContainerClass) {
      var container = null;
      if (scaleContainerClass != void 0 && scaleContainerClass != "") {
        var parent = appletElem.parentNode;
        while (parent != null) {
          if ((" " + parent.className + " ").indexOf(" " + scaleContainerClass + " ") > -1) {
            container = parent;
            break;
          } else {
            parent = parent.parentNode;
          }
        }
      }
      var myWidth = 0, myHeight = 0, windowWidth = 0, border = 0, borderRight = 0, borderLeft = 0, borderTop = 0;
      if (container) {
        myWidth = container.offsetWidth;
        myHeight = Math.max(autoHeight ? container.offsetWidth : 0, container.offsetHeight);
      } else {
        if (window.innerWidth && document.documentElement.clientWidth) {
          myWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);
          myHeight = Math.min(window.innerHeight, document.documentElement.clientHeight);
          windowWidth = myWidth;
        } else {
          myWidth = window.innerWidth;
          myHeight = window.innerHeight;
          windowWidth = window.innerWidth;
        }
        if (appletElem) {
          var rect = appletElem.getBoundingClientRect();
          if (rect.left > 0) {
            if (rect.left <= myWidth && (noBorder === void 0 || !noBorder)) {
              if (document.dir === "rtl") {
                borderRight = myWidth - rect.width - rect.left;
                borderLeft = windowWidth <= 480 ? 10 : 30;
              } else {
                borderLeft = rect.left;
                borderRight = windowWidth <= 480 ? 10 : 30;
              }
              border = borderLeft + borderRight;
            }
          }
        }
        if (appletElem && typeof window.GGBT_wsf_view === "object" && window.GGBT_wsf_view.isFullscreen()) {
          appletElem.getBoundingClientRect();
          if (window.GGBT_wsf_view.getCloseBtnPosition() === "closePositionRight") {
            border = 40;
            borderTop = 0;
          } else if (window.GGBT_wsf_view.getCloseBtnPosition() === "closePositionTop") {
            border = 0;
            borderTop = 40;
          }
        }
      }
      if (appletElem) {
        if ((allowUpscale === void 0 || !allowUpscale) && appletWidth > 0 && appletWidth + border < myWidth) {
          myWidth = appletWidth;
        } else {
          myWidth -= border;
        }
        if (typeof window.GGBT_wsf_view === "object" && window.GGBT_wsf_view.isFullscreen() && (allowUpscale === void 0 || !allowUpscale)) {
          myHeight -= borderTop;
        }
      }
      return { width: myWidth, height: myHeight };
    }
    function calcScale(parameters, appletElem, allowUpscale, showPlayButton, scaleContainerClass) {
      if (parameters.isScreenshoGenerator) {
        return 1;
      }
      var ignoreHeight = showPlayButton !== void 0 && showPlayButton;
      var noScaleMargin = parameters.noScaleMargin != void 0 && parameters.noScaleMargin;
      var valBoolean = function(value) {
        return value && value !== "false";
      };
      var autoHeight = valBoolean(parameters.autoHeight);
      var windowSize = getWidthHeight(appletElem, parameters.width, allowUpscale, autoHeight, ignoreHeight && window.GGBT_wsf_view || noScaleMargin, scaleContainerClass);
      var windowWidth = parseInt(windowSize.width);
      var appletWidth = parameters.width;
      var appletHeight = parameters.height;
      if (appletWidth === void 0) {
        var article = appletElem.querySelector(".appletParameters");
        if (article) {
          appletWidth = article.offsetWidth;
          appletHeight = article.offsetHeight;
        }
      }
      var xscale = windowWidth / appletWidth;
      var yscale = ignoreHeight ? 1 : windowSize.height / appletHeight;
      if (allowUpscale !== void 0 && !allowUpscale) {
        xscale = Math.min(1, xscale);
        yscale = Math.min(1, yscale);
      }
      return Math.min(xscale, yscale);
    }
    function getScale(parameters, appletElem, showPlayButton) {
      var scale = 1, autoScale, allowUpscale = false;
      if (parameters.hasOwnProperty("allowUpscale")) {
        allowUpscale = parameters.allowUpscale;
      }
      if (parameters.hasOwnProperty("scale")) {
        scale = parseFloat(parameters.scale);
        if (isNaN(scale) || scale === null || scale === 0) {
          scale = 1;
        }
        if (scale > 1) {
          allowUpscale = true;
        }
      }
      if (appletElem && typeof window.GGBT_wsf_view === "object" && window.GGBT_wsf_view.isFullscreen()) {
        allowUpscale = true;
      }
      if (!(parameters.hasOwnProperty("disableAutoScale") && parameters.disableAutoScale)) {
        autoScale = calcScale(parameters, appletElem, allowUpscale, showPlayButton, parameters.scaleContainerClass);
      } else {
        return scale;
      }
      if (allowUpscale && (!parameters.hasOwnProperty("scale") || scale === 1)) {
        return autoScale;
      } else {
        return Math.min(scale, autoScale);
      }
    }
    function positionCenter(appletElem) {
      var windowWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);
      var windowHeight = Math.min(window.innerHeight, document.documentElement.clientHeight);
      var appletRect = appletElem.getBoundingClientRect();
      var calcHorizontalBorder = (windowWidth - appletRect.width) / 2;
      var calcVerticalBorder = (windowHeight - appletRect.height) / 2;
      if (calcVerticalBorder < 0) {
        calcVerticalBorder = 0;
      }
      appletElem.style.position = "relative";
      if (window.GGBT_wsf_view.getCloseBtnPosition() === "closePositionRight") {
        if (calcHorizontalBorder < 40) {
          appletElem.style.left = "40px";
        } else {
          appletElem.style.left = calcHorizontalBorder + "px";
        }
        appletElem.style.top = calcVerticalBorder + "px";
      } else if (window.GGBT_wsf_view.getCloseBtnPosition() === "closePositionTop") {
        if (calcVerticalBorder < 40) {
          appletElem.style.top = "40px";
        } else {
          appletElem.style.top = calcVerticalBorder + "px";
        }
        appletElem.style.left = calcHorizontalBorder + "px";
      }
    }
    function responsiveResize(appletElem, parameters) {
      var article = appletElem.querySelector(".appletParameters");
      if (article) {
        if (typeof window.GGBT_wsf_view === "object" && window.GGBT_wsf_view.isFullscreen()) {
          if (parameters.id !== article.getAttribute("data-param-id")) {
            return;
          }
          window.GGBT_wsf_view.setCloseBtnPosition(appletElem);
        }
        if (article.parentElement && /fullscreen/.test(article.parentElement.className)) {
          return;
        }
        var scale = getScale(parameters, appletElem);
        if (isFlexibleWorksheetEditor()) {
          article.setAttribute("data-param-scale", scale);
        }
        var scaleElem = null;
        for (var i2 = 0; i2 < appletElem.childNodes.length; i2++) {
          if (appletElem.childNodes[i2].className !== void 0 && appletElem.childNodes[i2].className.match(/^applet_scaler/)) {
            scaleElem = appletElem.childNodes[i2];
            break;
          }
        }
        if (scaleElem !== null && scaleElem.querySelector(".noscale") !== null) {
          return;
        }
        var appName = parameters.id !== void 0 ? parameters.id : "ggbApplet";
        var app = window[appName];
        if ((app == null || !app.recalculateEnvironments) && scaleElem !== null && !scaleElem.className.match(/fullscreen/)) {
          scaleElem.parentNode.style.transform = "";
          if (!isNaN(scale) && scale !== 1) {
            scaleElem.parentNode.style.width = parameters.width * scale + "px";
            scaleElem.parentNode.style.height = parameters.height * scale + "px";
            scaleElement(scaleElem, scale);
          } else {
            scaleElement(scaleElem, 1);
            scaleElem.parentNode.style.width = parameters.width + "px";
            scaleElem.parentNode.style.height = parameters.height + "px";
          }
        }
        if (typeof window.GGBT_wsf_view === "object" && window.GGBT_wsf_view.isFullscreen()) {
          positionCenter(appletElem);
        }
        if (window.GGBT_wsf_view && !window.GGBT_wsf_view.isFullscreen()) {
          window.GGBT_wsf_general.adjustContentToResize($(article).parents(".content-added-content"));
        }
      }
    }
    return { responsiveResize, isFlexibleWorksheetEditor, positionCenter, getScale, scaleElement };
  }();
  if (typeof define === "function" && define.amd) {
    define([], function() {
      return GGBApplet;
    });
  }
  GGBAppletUtils.makeModule = function(name, permutation) {
    function webModule() {
      var K = "gwt.codesvr." + name + "=", L = "gwt.codesvr=", M = name, O = "DUMMY", P = 0, Q = 1, R = "iframe", S = "position:absolute; width:0; height:0; border:none; left: -1000px;", T = " top: -1000px;", U = "CSS1Compat", V = "<!doctype html>", W = "", X = "<html><head></head><body></body></html>", Y = "undefined", Z = "readystatechange", $ = 10, _ = "Chrome", ab = 'eval("', bb = '");', cb = "script", db = "javascript", gb = "Failed to load ", hb = "head", ib = "meta", jb = "name", kb = name + "::", lb = "::", mb = "gwt:property", nb = "content", ob = "=", pb = "gwt:onPropertyErrorFn", qb = 'Bad handler "', rb = '" for "gwt:onPropertyErrorFn"', sb = "gwt:onLoadErrorFn", tb = '" for "gwt:onLoadErrorFn"', Db = "user.agent", Eb = "webkit", Fb = "safari", Gb = "msie", Hb = 11, Ib = "ie10", Jb = 9, Kb = "ie9", Lb = 8, Mb = "ie8", Nb = "gecko", Ob = "gecko1_8", Pb = 2, Qb = 3, Rb = 4, Tb = "" + name + ".devmode.js", Ub = permutation, Vb = ":1", Wb = ":2", Xb = ":3", Yb = ":", Zb = ".cache.js";
      var o = window;
      var p = document;
      function q() {
        var a = o.location.search;
        return a.indexOf(K) != -1 || a.indexOf(L) != -1;
      }
      function r(a, b) {
      }
      webModule.__sendStats = r;
      webModule.__moduleName = M;
      webModule.__errFn = null;
      webModule.__moduleBase = O;
      webModule.__softPermutationId = P;
      webModule.__computePropValue = null;
      webModule.__getPropMap = null;
      webModule.__installRunAsyncCode = function() {
      };
      webModule.__gwtStartLoadingFragment = function() {
        return null;
      };
      webModule.__gwt_isKnownPropertyValue = function() {
        return false;
      };
      webModule.__gwt_getMetaProperty = function() {
        return null;
      };
      var s = null;
      var t = o.__gwt_activeModules = o.__gwt_activeModules || {};
      t[M] = { moduleName: M };
      webModule.__moduleStartupDone = function(e2) {
        var f2 = t[M].bindings;
        t[M].bindings = function() {
          var a = f2 ? f2() : {};
          var b = e2[webModule.__softPermutationId];
          for (var c2 = P; c2 < b.length; c2++) {
            var d2 = b[c2];
            a[d2[P]] = d2[Q];
          }
          return a;
        };
      };
      var u;
      function v() {
        w();
        return u;
      }
      function w() {
        if (u) {
          return;
        }
        var a = p.createElement(R);
        a.id = M;
        a.style.cssText = S + T;
        a.tabIndex = -1;
        p.body.appendChild(a);
        u = a.contentWindow.document;
        u.open();
        var b = document.compatMode == U ? V : W;
        u.write(b + X);
        u.close();
      }
      function A(k2) {
        function l2(a) {
          function b() {
            if (typeof p.readyState == Y) {
              return typeof p.body != Y && p.body != null;
            }
            return /loaded|complete/.test(p.readyState);
          }
          var c2 = b();
          if (c2) {
            a();
            return;
          }
          function d2() {
            if (!c2) {
              if (!b()) {
                return;
              }
              c2 = true;
              a();
              if (p.removeEventListener) {
                p.removeEventListener(Z, d2, false);
              }
              if (e2) {
                clearInterval(e2);
              }
            }
          }
          if (p.addEventListener) {
            p.addEventListener(Z, d2, false);
          }
          var e2 = setInterval(function() {
            d2();
          }, $);
        }
        function m2(c2) {
          function d2(a, b) {
            a.removeChild(b);
          }
          var e2 = v();
          var f2 = e2.body;
          var g2;
          if (navigator.userAgent.indexOf(_) > -1 && window.JSON) {
            var h2 = e2.createDocumentFragment();
            h2.appendChild(e2.createTextNode(ab));
            for (var i2 = P; i2 < c2.length; i2++) {
              var j2 = window.JSON.stringify(c2[i2]);
              h2.appendChild(e2.createTextNode(j2.substring(Q, j2.length - Q)));
            }
            h2.appendChild(e2.createTextNode(bb));
            g2 = e2.createElement(cb);
            g2.language = db;
            g2.appendChild(h2);
            f2.appendChild(g2);
            d2(f2, g2);
          } else {
            for (var i2 = P; i2 < c2.length; i2++) {
              g2 = e2.createElement(cb);
              g2.language = db;
              g2.text = c2[i2];
              f2.appendChild(g2);
              d2(f2, g2);
            }
          }
        }
        webModule.onScriptDownloaded = function(a) {
          l2(function() {
            m2(a);
          });
        };
        var n = p.createElement(cb);
        n.src = k2;
        if (webModule.__errFn) {
          n.onerror = function() {
            webModule.__errFn(M, new Error(gb + code));
          };
        }
        p.getElementsByTagName(hb)[P].appendChild(n);
      }
      webModule.__startLoadingFragment = function(a) {
        return D(a);
      };
      webModule.__installRunAsyncCode = function(a) {
        var b = v();
        var c2 = b.body;
        var d2 = b.createElement(cb);
        d2.language = db;
        d2.text = a;
        c2.appendChild(d2);
        c2.removeChild(d2);
      };
      function B() {
        var c = {};
        var d;
        var e;
        var f = p.getElementsByTagName(ib);
        for (var g = P, h = f.length; g < h; ++g) {
          var i = f[g], j = i.getAttribute(jb), k;
          if (j) {
            j = j.replace(kb, W);
            if (j.indexOf(lb) >= P) {
              continue;
            }
            if (j == mb) {
              k = i.getAttribute(nb);
              if (k) {
                var l, m = k.indexOf(ob);
                if (m >= P) {
                  j = k.substring(P, m);
                  l = k.substring(m + Q);
                } else {
                  j = k;
                  l = W;
                }
                c[j] = l;
              }
            } else if (j == pb) {
              k = i.getAttribute(nb);
              if (k) {
                try {
                  d = eval(k);
                } catch (a) {
                  alert(qb + k + rb);
                }
              }
            } else if (j == sb) {
              k = i.getAttribute(nb);
              if (k) {
                try {
                  e = eval(k);
                } catch (a) {
                  alert(qb + k + tb);
                }
              }
            }
          }
        }
        __gwt_getMetaProperty = function(a) {
          var b = c[a];
          return b == null ? null : b;
        };
        s = d;
        webModule.__errFn = e;
      }
      function D(a) {
        if (a.match(/^\//)) {
          return a;
        }
        if (a.match(/^[a-zA-Z]+:\/\//)) {
          return a;
        }
        return webModule.__moduleBase + a;
      }
      function F() {
        var f2 = [];
        var g2 = P;
        function h2(a, b) {
          var c2 = f2;
          for (var d2 = P, e2 = a.length - Q; d2 < e2; ++d2) {
            c2 = c2[a[d2]] || (c2[a[d2]] = []);
          }
          c2[a[e2]] = b;
        }
        var i2 = [];
        var j2 = [];
        function k2(a) {
          var b = j2[a](), c2 = i2[a];
          if (b in c2) {
            return b;
          }
          var d2 = [];
          for (var e2 in c2) {
            d2[c2[e2]] = e2;
          }
          if (s) {
            s(a, d2, b);
          }
          throw null;
        }
        j2[Db] = function() {
          var a = navigator.userAgent.toLowerCase();
          var b = p.documentMode;
          if (function() {
            return a.indexOf(Eb) != -1;
          }())
            return Fb;
          if (function() {
            return a.indexOf(Gb) != -1 && (b >= $ && b < Hb);
          }())
            return Ib;
          if (function() {
            return a.indexOf(Gb) != -1 && (b >= Jb && b < Hb);
          }())
            return Kb;
          if (function() {
            return a.indexOf(Gb) != -1 && (b >= Lb && b < Hb);
          }())
            return Mb;
          if (function() {
            return a.indexOf(Nb) != -1 || b >= Hb;
          }())
            return Ob;
          return Fb;
        };
        i2[Db] = { gecko1_8: P, ie10: Q, ie8: Pb, ie9: Qb, safari: Rb };
        __gwt_isKnownPropertyValue = function(a, b) {
          return b in i2[a];
        };
        webModule.__getPropMap = function() {
          var a = {};
          for (var b in i2) {
            if (i2.hasOwnProperty(b)) {
              a[b] = k2(b);
            }
          }
          return a;
        };
        webModule.__computePropValue = k2;
        o.__gwt_activeModules[M].bindings = webModule.__getPropMap;
        if (q()) {
          return D(Tb);
        }
        var l2;
        try {
          h2([Ob], Ub);
          h2([Ib], Ub + Vb);
          h2([Kb], Ub + Wb);
          h2([Fb], Ub + Xb);
          l2 = f2[k2(Db)];
          var m2 = l2.indexOf(Yb);
          if (m2 != -1) {
            g2 = parseInt(l2.substring(m2 + Q), $);
            l2 = l2.substring(P, m2);
          }
        } catch (a) {
        }
        webModule.__softPermutationId = g2;
        return D(l2 + Zb);
      }
      function G() {
        if (!o.__gwt_stylesLoaded) {
          o.__gwt_stylesLoaded = {};
        }
      }
      B();
      webModule.__moduleBase = "https://www.geogebra.org/apps/5.0.760.0/" + name + "/";
      t[M].moduleBase = webModule.__moduleBase;
      var H = F();
      G();
      A(H);
      return true;
    }
    return webModule;
  };
  if (typeof window.web3d !== "function") {
    window.web3d = GGBAppletUtils.makeModule("web3d", "4228475EAAD352268765823641006833");
  }
  if (typeof window.webSimple !== "function") {
    window.webSimple = GGBAppletUtils.makeModule("webSimple", "FD44D89B7EB5EC526B54B5CA23995346");
  }
  window.GGBApplet = GGBApplet;
})();
function noop() {
}
function run(fn) {
  return fn();
}
function blank_object() {
  return /* @__PURE__ */ Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
function append(target, node) {
  target.appendChild(node);
}
function insert(target, node, anchor) {
  target.insertBefore(node, anchor || null);
}
function detach(node) {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
}
function element(name2) {
  return document.createElement(name2);
}
function text(data) {
  return document.createTextNode(data);
}
function space() {
  return text(" ");
}
function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
  if (value == null)
    node.removeAttribute(attribute);
  else if (node.getAttribute(attribute) !== value)
    node.setAttribute(attribute, value);
}
function children(element2) {
  return Array.from(element2.childNodes);
}
function set_style(node, key, value, important) {
  if (value === null) {
    node.style.removeProperty(key);
  } else {
    node.style.setProperty(key, value, important ? "important" : "");
  }
}
let current_component;
function set_current_component(component) {
  current_component = component;
}
const dirty_components = [];
const binding_callbacks = [];
let render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = /* @__PURE__ */ Promise.resolve();
let update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
const seen_callbacks = /* @__PURE__ */ new Set();
let flushidx = 0;
function flush() {
  if (flushidx !== 0) {
    return;
  }
  const saved_component = current_component;
  do {
    try {
      while (flushidx < dirty_components.length) {
        const component = dirty_components[flushidx];
        flushidx++;
        set_current_component(component);
        update(component.$$);
      }
    } catch (e2) {
      dirty_components.length = 0;
      flushidx = 0;
      throw e2;
    }
    set_current_component(null);
    dirty_components.length = 0;
    flushidx = 0;
    while (binding_callbacks.length)
      binding_callbacks.pop()();
    for (let i2 = 0; i2 < render_callbacks.length; i2 += 1) {
      const callback = render_callbacks[i2];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  seen_callbacks.clear();
  set_current_component(saved_component);
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
function flush_render_callbacks(fns) {
  const filtered = [];
  const targets = [];
  render_callbacks.forEach((c2) => fns.indexOf(c2) === -1 ? filtered.push(c2) : targets.push(c2));
  targets.forEach((c2) => c2());
  render_callbacks = filtered;
}
const outroing = /* @__PURE__ */ new Set();
function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}
function mount_component(component, target, anchor, customElement) {
  const { fragment, after_update } = component.$$;
  fragment && fragment.m(target, anchor);
  if (!customElement) {
    add_render_callback(() => {
      const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
      if (component.$$.on_destroy) {
        component.$$.on_destroy.push(...new_on_destroy);
      } else {
        run_all(new_on_destroy);
      }
      component.$$.on_mount = [];
    });
  }
  after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    flush_render_callbacks($$.after_update);
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
function make_dirty(component, i2) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }
  component.$$.dirty[i2 / 31 | 0] |= 1 << i2 % 31;
}
function init(component, options, instance2, create_fragment2, not_equal, props, append_styles, dirty = [-1]) {
  const parent_component = current_component;
  set_current_component(component);
  const $$ = component.$$ = {
    fragment: null,
    ctx: [],
    // state
    props,
    update: noop,
    not_equal,
    bound: blank_object(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
    // everything else
    callbacks: blank_object(),
    dirty,
    skip_bound: false,
    root: options.target || parent_component.$$.root
  };
  append_styles && append_styles($$.root);
  let ready = false;
  $$.ctx = instance2 ? instance2(component, options.props || {}, (i2, ret, ...rest) => {
    const value = rest.length ? rest[0] : ret;
    if ($$.ctx && not_equal($$.ctx[i2], $$.ctx[i2] = value)) {
      if (!$$.skip_bound && $$.bound[i2])
        $$.bound[i2](value);
      if (ready)
        make_dirty(component, i2);
    }
    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update);
  $$.fragment = create_fragment2 ? create_fragment2($$.ctx) : false;
  if (options.target) {
    if (options.hydrate) {
      const nodes = children(options.target);
      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      $$.fragment && $$.fragment.c();
    }
    if (options.intro)
      transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor, options.customElement);
    flush();
  }
  set_current_component(parent_component);
}
class SvelteComponent {
  $destroy() {
    destroy_component(this, 1);
    this.$destroy = noop;
  }
  $on(type, callback) {
    if (!is_function(callback)) {
      return noop;
    }
    const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
    callbacks.push(callback);
    return () => {
      const index2 = callbacks.indexOf(callback);
      if (index2 !== -1)
        callbacks.splice(index2, 1);
    };
  }
  $set($$props) {
    if (this.$$set && !is_empty($$props)) {
      this.$$.skip_bound = true;
      this.$$set($$props);
      this.$$.skip_bound = false;
    }
  }
}
function create_fragment$1(ctx) {
  let div17;
  let div0;
  let t1;
  let div10;
  let div1;
  let t3;
  let div9;
  let t17;
  let div15;
  let div11;
  let t19;
  let div14;
  let t23;
  let div16;
  let mounted;
  let dispose;
  return {
    c() {
      div17 = element("div");
      div0 = element("div");
      div0.textContent = "Geogebra";
      t1 = space();
      div10 = element("div");
      div1 = element("div");
      div1.textContent = "Model";
      t3 = space();
      div9 = element("div");
      div9.innerHTML = `<div class="dropdown-item" id="Graphing">Graphing</div> 
      <div class="dropdown-item" id="Geometry">Geometry</div> 
      <div class="dropdown-item" id="3D">3D</div> 
      <div class="dropdown-item" id="Classic">Classic</div> 
      <div class="dropdown-item" id="Suite">Suite</div> 
      <div class="dropdown-item" id="Scientific">Scientific</div> 
      <div class="dropdown-item" id="notes">notes</div>`;
      t17 = space();
      div15 = element("div");
      div11 = element("div");
      div11.textContent = "Function";
      t19 = space();
      div14 = element("div");
      div14.innerHTML = `<div class="dropdown-item" id="ToImage">ToImage</div> 
      <div class="dropdown-item" id="InsetBlock">InsetBlock</div>`;
      t23 = space();
      div16 = element("div");
      div16.textContent = "FullScreen";
      set_style(div0, "padding-right", "18px");
      attr(div1, "class", "menuBarItem");
      attr(div1, "id", "Model");
      attr(div9, "class", "dropdown-content");
      attr(div10, "class", "dropdown");
      attr(div11, "class", "menuBarItem");
      attr(div11, "id", "Function");
      attr(div14, "class", "dropdown-content");
      attr(div15, "class", "dropdown");
      attr(div16, "class", "menuBarItem");
      attr(div16, "id", "FullScreen");
      attr(div17, "id", "menuBar");
    },
    m(target, anchor) {
      insert(target, div17, anchor);
      append(div17, div0);
      append(div17, t1);
      append(div17, div10);
      append(div10, div1);
      append(div10, t3);
      append(div10, div9);
      append(div17, t17);
      append(div17, div15);
      append(div15, div11);
      append(div15, t19);
      append(div15, div14);
      append(div17, t23);
      append(div17, div16);
      if (!mounted) {
        dispose = [
          listen(
            div9,
            "click",
            /*handleClick*/
            ctx[0]
          ),
          listen(
            div14,
            "click",
            /*handleClick*/
            ctx[0]
          ),
          listen(
            div16,
            "click",
            /*handleClick*/
            ctx[0]
          )
        ];
        mounted = true;
      }
    },
    p: noop,
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(div17);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance$1($$self, $$props, $$invalidate) {
  let { id } = $$props;
  let fullScreen = false;
  let geogebraBox = document.getElementsByClassName("b3-dialog__body")[0];
  let toolbarHeight = document.getElementById("toolbar").offsetHeight.toString();
  let position = {
    top: "0",
    left: "0",
    width: "100%",
    height: "100%"
  };
  function handleClick(e2) {
    e2.preventDefault();
    const targetId = e2.target.id;
    const actions = {
      ToImage: () => download(false, () => {
      }),
      InsetBlock: () => InsetBlock(id),
      Save: () => Save(),
      FullScreen: () => FullScreen()
    };
    if (actions[targetId]) {
      actions[targetId]();
    } else {
      RenderingGE(targetId, geogebraBox.clientWidth, geogebraBox.clientHeight, () => {
      });
    }
  }
  function FullScreen() {
    let element2 = document.getElementsByClassName("b3-dialog__container")[0];
    if (fullScreen) {
      element2.style.cssText = `
            height: ${position.height};
            width: ${position.width};
            top: ${position.top};
            left: ${position.left};
          `;
      fullScreen = false;
    } else {
      position = {
        height: element2.style.height,
        width: element2.style.width,
        top: element2.style.top,
        left: element2.style.left
      };
      element2.style.cssText = `
            top: ${toolbarHeight}px;
            left: 0;
            width: 100%;
            height: 100%;
          `;
      fullScreen = true;
    }
  }
  $$self.$$set = ($$props2) => {
    if ("id" in $$props2)
      $$invalidate(1, id = $$props2.id);
  };
  return [handleClick, id];
}
class Geogebra_page extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$1, create_fragment$1, safe_not_equal, { id: 1 });
  }
}
async function request$1(url, data) {
  let response = await siyuan.fetchSyncPost(url, data);
  let res = response.code === 0 ? response.data : null;
  return res;
}
async function insertBlock(dataType, data, previousID) {
  let data1 = {
    dataType,
    data,
    previousID
  };
  let url = "/api/block/insertBlock";
  return request$1(url, data1);
}
async function getWorkspaces() {
  return request$1("/api/system/getWorkspaces", {});
}
function writeLSB(base64Data, message, callback) {
  const img = new Image();
  img.onload = function() {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const binaryMessage = stringToBinary(message);
    const maxMessageLength = calculateMaxMessageLength(imageData.width * imageData.height * 3);
    if (binaryMessage.length > maxMessageLength) {
      callback(new Error("隐藏信息超过最大容量"));
      return;
    }
    const data = imageData.data;
    for (let i2 = 0; i2 < binaryMessage.length; i2 += 3) {
      let red = data[i2];
      let green = data[i2 + 1];
      let blue = data[i2 + 2];
      if (i2 < binaryMessage.length) {
        red = setLSB(red, binaryMessage[i2]);
        green = setLSB(green, binaryMessage[i2 + 1]);
        blue = setLSB(blue, binaryMessage[i2 + 2]);
      }
      data[i2] = red;
      data[i2 + 1] = green;
      data[i2 + 2] = blue;
    }
    ctx.putImageData(imageData, 0, 0);
    const outputBase64 = canvas.toDataURL();
    callback(null, outputBase64);
  };
  img.src = base64Data;
}
const base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
function stringToBinary(str) {
  let isEqual = 0;
  if (str[str.length - 1] == "=") {
    isEqual = 1;
    str = str.substring(0, str.length - 1);
  }
  str = `${isEqual}${str.length.toString().length}${str.length}` + str;
  let binary = "";
  for (const char of str) {
    binary += base64Chars.indexOf(char).toString(2).padStart(6, "0");
  }
  return binary;
}
function readLSB(imagePath, callback) {
  const img = new Image();
  img.onload = function() {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let str = "";
    let binary = getBinary(imageData, 2);
    let length = Number(base64Chars[parseInt(binary.substr(6, 6), 2)]) * 6 + 12;
    binary = getBinary(imageData, 2 + length);
    for (let i2 = 12; i2 < length; i2 += 6) {
      str += base64Chars[parseInt(binary.substr(i2, 6), 2)];
    }
    let temp = length;
    length = Number(str) * 6 + length;
    binary = getBinary(imageData, length);
    str = "";
    for (let i2 = temp; i2 < length; i2 += 6) {
      str += base64Chars[parseInt(binary.substr(i2, 6), 2)];
    }
    if (getBinary(imageData, 1) === "110101") {
      str += "=";
    }
    callback(str);
  };
  img.src = imagePath;
}
function getBinary(imageData, end) {
  end *= 6;
  let binaryMessage = "";
  const data = imageData.data;
  for (let i2 = 0; i2 < end; i2 += 3) {
    const red = data[i2];
    const green = data[i2 + 1];
    const blue = data[i2 + 2];
    binaryMessage += getLSB(red);
    binaryMessage += getLSB(green);
    binaryMessage += getLSB(blue);
  }
  return binaryMessage;
}
function setLSB(byte, bit) {
  return byte & 254 | bit;
}
function getLSB(byte) {
  return byte & 1;
}
function calculateMaxMessageLength(pixelCount) {
  return pixelCount * 3;
}
let object = { isOffline: "true", model: "GeogebraE", base64: "" };
function loadJSFile(jsUrl, callback) {
  const script = document.createElement("script");
  script.src = jsUrl;
  if (callback) {
    script.onload = callback;
  }
  document.head.appendChild(script);
}
function openDialog(id, callback) {
  let dialog = new siyuan.Dialog({
    title: " ",
    content: `<div id="ggb-element"></div>`,
    width: this.isMobile ? "92vw" : "720px",
    height: this.isMobile ? "92vh" : "500px"
  });
  new Geogebra_page({
    target: dialog.element.querySelector(".b3-dialog__header"),
    props: {
      id
    }
  });
  RenderingGE(object.model, 760, 500, (CheckedGgbApplet) => {
    let geogebraBox = document.getElementsByClassName(
      "b3-dialog__body"
    )[0];
    geogebraBox.style.overflow = "hidden";
    var observer = new ResizeObserver(function() {
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
    width,
    height,
    showToolBar: true,
    showAlgebraInput: true,
    showMenuBar: true
  };
  new GGBApplet(params, "5.0");
  var applet = new GGBApplet(params, "5.0");
  {
    applet.setHTML5Codebase("/plugins/GeogebraE/geogebra/web3d/");
  }
  setTimeout(function() {
    applet.inject("ggb-element");
  }, 10);
  let ggbAppletReadyInterval = setInterval(function() {
    if (typeof ggbApplet !== "undefined" && typeof ggbApplet.setBase64 === "function") {
      clearInterval(ggbAppletReadyInterval);
      callback(ggbApplet);
    }
  }, 500);
}
function download(getImage = false, callback) {
  const imgUrl = `data:image/png;base64,${ggbApplet.getPNGBase64(1, false)}`;
  writeLSB(imgUrl, ggbApplet.getBase64(), (err, outputBase64) => {
    if (err) {
      console.log(err);
      return;
    }
    if (getImage) {
      callback(outputBase64);
    } else {
      const image = document.createElement("a");
      image.href = outputBase64;
      image.setAttribute("download", "Geogebra");
      image.click();
    }
  });
}
function saveFile(base64Data, callback) {
  const fs = window.require("fs");
  const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  const base64Content = matches[2];
  const fileData = Buffer.from(base64Content, "base64");
  getCurrentWorkSpace((r2) => {
    let path = r2 + "/data/plugins/GeogebraE/geogebra.png";
    fs.writeFile(path, fileData, "binary", function(err) {
      if (err) {
        console.error("保存文件发生错误:", err);
      } else {
        console.log("文件已保存");
        callback(path);
      }
    });
  });
}
function getCurrentWorkSpace(callback) {
  getWorkspaces().then((r2) => {
    r2.forEach((element2) => {
      if (element2.path.includes(document.getElementsByClassName("toolbar__text")[0].textContent)) {
        callback(element2.path);
      }
    });
  });
}
function InsetBlock(id) {
  download(true, (imgUrl) => {
    saveFile(imgUrl, (path) => {
      solveGet(request("/api/lute/html2BlockDOM", {
        dom: `<img src="${path}"/>`
      })).then((r2) => {
        console.log("insertBlock", id);
        insertBlock("markdown", `![](${r2.match(RegExp(`assets/.*?(?=")`))[0]})`, id);
      });
    });
  });
}
function Save() {
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
  let r2 = await response;
  return r2 && r2.code === 0 ? r2.data : null;
}
async function request(url, data) {
  return fetch(url, {
    body: JSON.stringify(data),
    method: "POST",
    headers: {
      Authorization: `Token ' '`
    }
  }).then((r2) => {
    if (r2.status === 200)
      return r2.json();
    else
      return null;
  });
}
function create_fragment(ctx) {
  let button;
  let mounted;
  let dispose;
  return {
    c() {
      button = element("button");
      button.innerHTML = `<div class="b3-menu__icon">G</div> 
  <span class="b3-menu__label">用GeogebraE打开</span>`;
      attr(button, "class", "b3-menu__item");
    },
    m(target, anchor) {
      insert(target, button, anchor);
      if (!mounted) {
        dispose = listen(
          button,
          "click",
          /*openGeogebra*/
          ctx[0]
        );
        mounted = true;
      }
    },
    p: noop,
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(button);
      mounted = false;
      dispose();
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  let { detail } = $$props;
  let scr = detail.element.getElementsByTagName("img")[0].src;
  function openGeogebra() {
    openDialog(detail.element.parentElement.parentElement.dataset.nodeId, (ggbApplet2) => {
      readLSB(scr, (data) => {
        ggbApplet2.setBase64(data);
      });
    });
  }
  $$self.$$set = ($$props2) => {
    if ("detail" in $$props2)
      $$invalidate(1, detail = $$props2.detail);
  };
  return [openGeogebra, detail];
}
class Image_menu extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, { detail: 1 });
  }
}
class PluginSample extends siyuan.Plugin {
  async onload() {
    loadJSFile("/plugins/GeogebraE/deployggb.js", () => {
      console.log("JavaScript 文件已加载");
    });
    this.eventBus.on("open-menu-image", this.ImageMenuEvent);
    const self2 = this;
    self2.protyleSlash = [{
      filter: ["geogebra", "dkge", "打开"],
      html: `
            <div class="b3-list-item__first">
                <div class="color__square">G</div>
                <span class="b3-list-item__text">${this.i18n.openGeogebra}</span>
            </div>`,
      id: "openGeogebra",
      callback(protyle) {
        deleteCharacterBeforeCursor();
        let id = protyle.protyle.breadcrumb.id;
        openDialog(id, () => {
        });
      }
    }];
  }
  async onunload() {
    this.eventBus.off("open-menu-image", this.ImageMenuEvent);
  }
  ImageMenuEvent({ detail }) {
    var imageMenu = document.getElementsByClassName("b3-menu__items")[0];
    new Image_menu({
      target: imageMenu,
      props: {
        detail
      }
    });
    document.getElementsByClassName("b3-menu")[0].className = "b3-menu fn__none";
  }
}
module.exports = PluginSample;
