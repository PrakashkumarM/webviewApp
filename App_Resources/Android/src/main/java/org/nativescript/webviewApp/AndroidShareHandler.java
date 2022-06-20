package org.nativescript.webviewApp;

import android.app.Activity;
import android.content.Context;
import android.util.Log;
import androidx.core.app.ShareCompat;
import android.webkit.JavascriptInterface;

public class AndroidShareHandler {
  private Activity context;
  private String TAG = "AndroidShareHandler";

  public AndroidShareHandler(Context outterContext){
    Log.i(TAG, "AndroidShareHandler contructor called");
    context = (Activity)outterContext;
  }
  @JavascriptInterface
  public void share(String message, String url) {
    ShareCompat.IntentBuilder.from(context)
        .setType("text/plain")
        .setChooserTitle("Choose one")
        .setText(message + " " + url)
        .startChooser();
  }
}
