package org.nativescript.webviewApp;

import com.tns.NativeScriptActivity;

import android.os.Build;
import android.content.ActivityNotFoundException;
import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.widget.FrameLayout;
import android.webkit.ValueCallback;


public class UploadShared {

    private static ValueCallback<Uri[]> mUploadMessage;
    public final static int FILECHOOSER_RESULTCODE = 1;
    public static final int REQUEST_SELECT_FILE = 100;

    public static void setCallBack(ValueCallback<Uri[]> uploadMessage){
      mUploadMessage = uploadMessage;
    }
    public static ValueCallback<Uri[]> getCallBack() {
      return mUploadMessage;
    }
}