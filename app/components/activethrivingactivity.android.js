const FILECHOOSER_RESULTCODE = 100;
const frame = require("@nativescript/core/ui/frame");

const superProto = androidx.appcompat.app.AppCompatActivity.prototype;
const UploadShared = org.nativescript.webviewApp.UploadShared;

androidx.appcompat.app.AppCompatActivity.extend("com.tns.NativeScriptActivity", {
  onCreate: function (savedInstanceState) {
    // Set the isNativeScriptActivity in onCreate (as done in the original NativeScript activity code)
    // The JS constructor might not be called because the activity is created from Android.
    this.isNativeScriptActivity = true;
    if (!this._callbacks) {
      frame.setActivityCallbacks(this);
    }
    // Modules will take care of calling super.onCreate, do not call it here
    this._callbacks.onCreate(this, savedInstanceState, this.getIntent(), superProto.onCreate);

    // Add custom initialization logic here
  },
  onSaveInstanceState: function(outState) {
      this._callbacks.onSaveInstanceState(this, outState, superProto.onSaveInstanceState);
  },
  onStart: function() {
      this._callbacks.onStart(this, superProto.onStart);
  },
  onStop: function() {
      this._callbacks.onStop(this, superProto.onStop);
  },
  onDestroy: function() {
      this._callbacks.onDestroy(this, superProto.onDestroy);
  },
  onBackPressed: function() {
      this._callbacks.onBackPressed(this, superProto.onBackPressed);
  },
  onRequestPermissionsResult: function (requestCode, permissions, grantResults) {
      this._callbacks.onRequestPermissionsResult(this, requestCode, permissions, grantResults, undefined);
  },
  onActivityResult(requestCode, resultCode, intent) {
    if (requestCode == FILECHOOSER_RESULTCODE) {
      if (null == UploadShared.getCallBack())
        return;
      const result = intent == null || resultCode != -1 ? null
        : intent.getData();
      const mUploadMessage = UploadShared.getCallBack();
      mUploadMessage.onReceiveValue(android.webkit.WebChromeClient.FileChooserParams.parseResult(resultCode, intent))
      //this.onActivityResultAboveL(mUploadMessage, intent);
      UploadShared.setCallBack(null);

    }

    //this._callbacks.onActivityResult(this, requestCode, resultCode, intent, _super.prototype.onActivityResult);
  },
  onActivityResultAboveL(valueCallBacks, intent) {
    let results = [];
    let dataString = intent.getDataString();
    let clipData = intent.getClipData();
    if (clipData != null) {
        results = new android.net.Uri[clipData.getItemCount()];
        for (let i = 0; i < clipData.getItemCount(); i++) {
            let item = clipData.getItemAt(i);
            results[i] = item.getUri();
        }
    }
    if (dataString != null){
        results = WebChromeClient.FileChooserParams.parseResult(resultCode,intent);
        //results[0] = android.net.Uri.parse(dataString);
    }


        valueCallBacks.onReceiveValue(results);
  }
});