import * as application from "@nativescript/core/application";
import { isIOS } from "@nativescript/core";

const UploadShared = !isIOS ? org.nativescript.webviewApp.UploadShared : null;
export const MyWebChromeClient = !isIOS
  ? org.nativescript.webviewApp.NativeChromeClient.extend({
      init: function() {
        console.log("Init wechromeclient");
        return global.__native(this);
      },
      openFileChooser(uploadMsg, acceptType, capture) {
        console.log("openFileChooser");
        UploadShared.setCallBack(uploadMsg);
        let intent = new android.content.Intent(Intent.ACTION_GET_CONTENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("*/*");
        const activity = application.android.foregroundActivity;
        activity.startActivityForResult(
          Intent.createChooser(intent, "File Browser"),
          FILECHOOSER_RESULTCODE
        );
      },
    })
  : null;
