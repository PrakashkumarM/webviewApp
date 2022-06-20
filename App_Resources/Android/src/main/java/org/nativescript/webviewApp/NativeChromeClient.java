package org.nativescript.webviewApp;

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

public class NativeChromeClient extends WebChromeClient {
    private Activity activity;

    public void setActivity(Activity MainActivity) {
        activity = MainActivity;
    }


    private View mCustomView;
    private WebChromeClient.CustomViewCallback mCustomViewCallback;
    protected FrameLayout frame;

    // Initially mOriginalOrientation is set to Landscape
    private int mOriginalOrientation = android.content.pm.ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE;
    private int mOriginalSystemUiVisibility;
    private ValueCallback<Uri[]> uploadMessage;
    private final static int FILECHOOSER_RESULTCODE = 1;
    public static final int REQUEST_SELECT_FILE = 100;

    public Bitmap getDefaultVideoPoster() {
        if (activity == null) {
            return null;
        }
        return BitmapFactory.decodeResource(activity.getApplicationContext().getResources(), 2130837573);
    }

    public void onShowCustomView(View paramView, WebChromeClient.CustomViewCallback viewCallback) {
        if (this.mCustomView != null) {
            onHideCustomView();
            return;
        }
        this.mCustomView = paramView;
        this.mOriginalSystemUiVisibility = activity.getWindow().getDecorView().getSystemUiVisibility();
        // When CustomView is shown screen orientation changes to mOriginalOrientation (Landscape).
        activity.setRequestedOrientation(this.mOriginalOrientation);
        // After that mOriginalOrientation is set to portrait.
        this.mOriginalOrientation = android.content.pm.ActivityInfo.SCREEN_ORIENTATION_PORTRAIT;
        this.mCustomViewCallback = viewCallback;
        ((FrameLayout) activity.getWindow().getDecorView()).addView(this.mCustomView, new FrameLayout.LayoutParams(-1, -1));
        activity.getWindow().getDecorView().setSystemUiVisibility(3846);
    }

    public void onHideCustomView() {
        ((FrameLayout) activity.getWindow().getDecorView()).removeView(this.mCustomView);
        this.mCustomView = null;
        activity.getWindow().getDecorView().setSystemUiVisibility(this.mOriginalSystemUiVisibility);
        // When CustomView is hidden, screen orientation is set to mOriginalOrientation (portrait).
        activity.setRequestedOrientation(this.mOriginalOrientation);
        // After that mOriginalOrientation is set to landscape.
        this.mOriginalOrientation = android.content.pm.ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE;
        this.mCustomViewCallback.onCustomViewHidden();
        this.mCustomViewCallback = null;
    }



     // For Lollipop 5.0+ Devices
    public boolean onShowFileChooser(WebView mWebView, ValueCallback<Uri[]> filePathCallback, WebChromeClient.FileChooserParams fileChooserParams) {
         if (UploadShared.getCallBack() != null) {
            UploadShared.setCallBack(null);
         }
         uploadMessage = filePathCallback;
         Intent intent = null;
         if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
             intent = fileChooserParams.createIntent();
         }
         try {
             activity.startActivityForResult(intent, REQUEST_SELECT_FILE);
         } catch (ActivityNotFoundException e) {
             UploadShared.setCallBack(uploadMessage);
             uploadMessage = null;
            return true;
        }
        UploadShared.setCallBack(uploadMessage);
        return true;
    }
}