import Vue from "nativescript-vue";
import { WebView } from "@nativescript/core";
import App from "./components/App";
// import store from "./store";
import { MyWebChromeClient } from "./web-chrome-client";
// import initFirebase from "./fcm-notifications";
import * as app from "@nativescript/core/application";
import { isIOS } from "@nativescript/core";
import { DeviceInfo } from "nativescript-dna-deviceinfo";

Vue.config.silent = true;


// initFirebase();
new Vue({
  mounted() {
    // Esto permite la autenticación con los servicios de google en Android
    // const USER_AGENT =
    //   "Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_1 like Mac OS X; en-us) AppleWebKit/532.9 (KHTML, like Gecko) Mobile/8B117";
    DeviceInfo.userAgent().then(userAgent=>{
      console.log('user agent -- >  ',userAgent);
      const USER_AGENT = userAgent.replace('; wv','; en-us')
    if (!isIOS) {
      WebView.prototype.originalCreateNativeView =
        WebView.prototype.createNativeView;

      WebView.prototype.createNativeView =  function() {
        const nativeView = this.originalCreateNativeView();
        try {
       
          const chromeClient = new MyWebChromeClient();
          chromeClient.setActivity(app.android.foregroundActivity);

          // nativeView.getSettings().setUserAgentString(USER_AGENT);
          nativeView.setWebChromeClient(chromeClient);
          nativeView.getSettings().setUserAgentString(USER_AGENT);
          nativeView.getSettings().setJavaScriptEnabled(true);
          nativeView.getSettings().setBuiltInZoomControls(false);
          nativeView.getSettings().setDisplayZoomControls(false);
          nativeView.getSettings().setAllowUniversalAccessFromFileURLs(true);
          var activity = app.android.foregroundActivity;
          const AndroidShareHandler = new org.nativescript.webviewApp.AndroidShareHandler(
            activity
          );
          nativeView.addJavascriptInterface(
            AndroidShareHandler,
            "AndroidShareHandler"
          );
          nativeView.chromeClient = chromeClient;
        } catch (error) {
          console.log(`error: ${error}`);
        }
        return nativeView;
      };
    } else {
      //Without this call background mode doesn't work...
      AVAudioSession.sharedInstance().setCategoryWithOptionsError(
        AVAudioSessionCategoryPlayAndRecord,
        AVAudioSessionCategoryOptions.DefaultToSpeaker
      );
      WebView.prototype.createNativeView = function () {
        let jScript = `var meta = document.createElement('meta');
        meta.setAttribute('name', 'viewport');
        meta.setAttribute('content', 'initial-scale=1.0 maximum-scale=1.0');
        document.getElementsByTagName('head')[0].appendChild(meta);`;
        const wkUScript = WKUserScript.alloc().initWithSourceInjectionTimeForMainFrameOnly(jScript, WKUserScriptInjectionTime.AtDocumentEnd, true);
        const wkUController = WKUserContentController.new();
        wkUController.addUserScript(wkUScript);
        const configuration = WKWebViewConfiguration.new();
        configuration.userContentController = wkUController;
        configuration.preferences.setValueForKey(
            true,
            "allowFileAccessFromFileURLs"
        );
        return new WKWebView({
            frame: CGRectZero,
            configuration: configuration
        });
};

    }
  });

  },
  render: (h) => h("frame", [h(App)]),
}).$start();
