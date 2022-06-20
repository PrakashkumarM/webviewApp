<template>
  <Page statusBarStyle="dark" backgroundSpanUnderStatusBar="true" actionBarHidden="true" iosOverflowSafeArea="true">    
    <AbsoluteLayout  iosOverflowSafeArea="true">
      <WebView
          iosOverflowSafeArea="true"
          left="0"
          top="1"
          width="100%"
          height="100%"
          v-if="hasConnection"
          ref="webView"
          @loadStarted="webViewLoaded"
          :src="webViewUri"
      />

        <GridLayout
          left="0"
          top="1"
          width="100%"
          height="100%"
          iosOverflowSafeArea="true"
          v-else
          columns="*,auto,*"
          rows="*,auto,*"
        >
          <Image
            row="0"
            col="0"
            colspan="3"
            rowspan="3"
            src="https://app.activeandthriving.com.au/mobile/img/splash.png"
            stretch="aspectFill"
          />
          <FlexboxLayout
            row="1"
            col="1"
            justifyContent="space-around"
            height="350"
            width="300"
            flexDirection="column"
          >
            <FlexboxLayout
              backgroundColor="white"
              justifyContent="space-between"
              flexDirection="column"
              padding="8"
            >
              <Label
                margin-left="8"
                margin-right="8"
                textWrap="true"
                alignSelf="center"
                textAlignment="center"
                text="Oops, it seems you don’t have internet access"
                width="auto"
                height="60"
                color="black"
              />
              <Label alignSelf="center" text="Trying to connect.." color="black" height="40" />
              <ActivityIndicator height="25" busy="true" color="black" margin="20" />
            </FlexboxLayout>
          </FlexboxLayout>
        </GridLayout>
        <FlexboxLayout 
            backgroundColor="white" 
            v-if="!loaded & hasConnection"  
            alignItems="center" 
            justifyContent="center" 
            width="100%" 
            height="100%" 
          >
            <Image src="~/assets/images/logo_png.png" width="250" height="200"  />
          </FlexboxLayout>
    </AbsoluteLayout>
  </Page>
</template>

<script >
import { WebViewUtils } from "nativescript-webview-utils";
import {
  connectionType,
  getConnectionType,
  startMonitoring,
  stopMonitoring,
} from "@nativescript/core/connectivity";
import * as application from "@nativescript/core/application";
import { TNSPlayer } from "nativescript-audio";
// import { handleOpenURL } from 'nativescript-urlhandler';
import { openUrl } from "@nativescript/core/utils/utils";
import { InAppBrowser } from 'nativescript-inappbrowser';

export default {
  data() {
    return {
      // url: 'https://at.diebeck.com/',
      // url: "https://app.activeandthriving.com.au/",
      // url: "https://at-testing.mlhs.com.au/",
      url: "https://portal.sumanas.xyz/",
      hasConnection: false,
      params:"",
      token: "",
      loaded: false,
      player: new TNSPlayer(),
    };
  },
  mounted() {
    this.handleDeeplinkUrl();
    this.tryConnection();
    this.startMonitoring();
  },
  beforeDestroy() {
    // Explicitly stopping the monitoring
    stopMonitoring();
  },
  methods: {
    tryConnection() {
      let self=this;
      const myConnectionType = getConnectionType();
      switch (myConnectionType) {
          case connectionType.none:
            this.hasConnection = false;
            break;
          default:
            this.hasConnection = true;
            break;
        }
    },
    handleDeeplinkUrl(){
      let self = this, url="http://wfm-staging.sumanas.xyz/";
      // let self = this, url="https://at-testing.mlhs.com.au//";
      // handleOpenURL( (appURL)  => {
      //   const path = `${appURL}`.split('?')
      //   self.url = `${path[0]}`;
      //   self.params= path[1];
      //     if(typeof self.$refs.webView.reload === 'function'){
      //       self.$refs.webView.reload()
      //     }
      // });
    },
    startMonitoring() {
      startMonitoring((newConnectionType) => {
        switch (newConnectionType) {
          case connectionType.none:
            this.hasConnection = false;
            break;
          default:
            this.hasConnection = true;
            break;
        }
      });
    },
    async openLink (url) {
      if (await InAppBrowser.isAvailable()) {
         const result = await InAppBrowser.open(url, {
          // iOS Properties
          dismissButtonStyle: 'cancel',
          preferredBarTintColor: '#0069b4',
          preferredControlTintColor: 'white',
          readerMode: false,
          animated: true,
          modalPresentationStyle: 'fullScreen',
          modalTransitionStyle: 'coverVertical',
          modalEnabled: true,
          enableBarCollapsing: false,
          // Android Properties
          showTitle: true,
          toolbarColor: '#0069b4',
          secondaryToolbarColor: 'black',
          navigationBarColor: 'black',
          navigationBarDividerColor: 'white',
          enableUrlBarHiding: true,
          enableDefaultShare: true,
          forceCloseOnRedirection: false,
          // Specify full animation resource identifier(package:anim/name)
          // or only resource name(in case of animation bundled with app).
          animations: {
            startEnter: 'slide_in_right',
            startExit: 'slide_out_left',
            endEnter: 'slide_in_left',
            endExit: 'slide_out_right'
          },
          headers: {
            'my-custom-header': 'my custom header value'
          },
          hasBackButton: true,
          browserPackage: '',
          showInRecents: false
        });
       
      }else {
        openUrl(url);
      }
    },
    webViewLoaded(webargs) {
      // Esto permite la autenticación con los servicios de google en iOS
      const { android } = webargs.object;
      const appURL = "https://portal.sumanas.xyz/"
      // const appURL = "https://at-testing.mlhs.com.au/"
      // const page = webargs.object
     
      if (!android) {
        const USER_AGENT =
          "Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_1 like Mac OS X; en-us) AppleWebKit/532.9 (KHTML, like Gecko) Mobile/8B117";
        const webView = webargs.object;
        const headers = new Map();

        headers.set("User-Agent", USER_AGENT);
        WebViewUtils.addHeaders(webView, headers);
        webargs.object.ios.scrollView.minimumZoomScale = 1.0;
        webargs.object.ios.scrollView.maximumZoomScale = 1.0;
        webargs.object.ios.scalesPageToFit = false;
        webargs.object.ios.scrollView.bounces = false;
        webargs.object.ios.scrollView.contentInsetAdjustmentBehavior = '.never'

        const loadedUrl= webargs.url
        const validUrl = loadedUrl.search(appURL) >= 0
        if(loadedUrl !== "about:blank" && !validUrl ){
          this.openLink(webargs.url)
        }
      } else {
        application.android.on(
          application.AndroidApplication.activityBackPressedEvent,
          (args) => {
            const webView = webargs.object;
            try {
              webView.goBack();
              args.cancel = true;
            } catch (error) {
              console.log("activityBackPressedEvent: error");
              console.log(error);
              args.cancel = false;
              console.log("native back");
            }
          }
        );
        const TNSWebViewClient = org.nativescript.webviewApp.MyWebViewClient.extend(
          {}
        );
        const client = new TNSWebViewClient();
        client.setActivity(application.android.foregroundActivity);
        android.setWebViewClient(client);
        android.getSettings().setAllowFileAccess(true);
        android.getSettings().setAllowContentAccess(true);
        android.getSettings().setDomStorageEnabled(true)
      }
      const view = this;
    //   firebase.getCurrentPushToken().then((token) => {
    //     // may be null if not known yet
    //     view.token = token ? token : "";
    //   });
    //   firebase.addOnMessageReceivedCallback((message) => {
    //     try {
    //       console.log("addOnMessageReceivedCallback");
    //       console.log(message.data.url);
    //       if (message && message.data && message.data.url) {
    //         view.url = message.data.url + "/?device_token=";
    //       }
    //     } catch (ex) {
    //       console.log("ex on addOnMessageReceivedCallback");
    //       console.log(ex);
    //     }
    //   });
      setTimeout(() => {
        
        this.loaded = true;
      }, 1000);
    },
  },
  computed: {
    webViewUri() {
      return `${this.url}`;
    },
  },
};
</script>

<style scoped lang="scss">
.pt20 {
  padding-top: 20px;
}
</style>
