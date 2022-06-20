package org.nativescript.webviewApp;

import android.app.Activity;
import android.content.Intent;
import android.net.MailTo;
import android.net.Uri;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MyWebViewClient extends WebViewClient {


  private Activity activity;

  public void setActivity(Activity MainActivity) {
    activity = MainActivity;
  }

  @Override
  public boolean shouldOverrideUrlLoading(WebView view, String url) {
    if (url.startsWith("tel:")) {
      Intent intent = new Intent(Intent.ACTION_DIAL, Uri.parse(url));
      activity.startActivity(intent);
      view.reload();
      return true;
    }
    if (url.startsWith("mailto:")) {
      if (activity != null) {
        MailTo mt = MailTo.parse(url);
        Intent i = newEmailIntent( mt.getTo(), mt.getSubject(), mt.getBody(), mt.getCc());
        activity.startActivity(i);
        view.reload();
        return true;
      }
    }
    view.loadUrl(url);
    return true;
  }
    private Intent newEmailIntent( String address, String subject, String body, String cc) {
      Intent intent = new Intent(Intent.ACTION_SEND);
      intent.putExtra(Intent.EXTRA_EMAIL, new String[] { address });
      intent.putExtra(Intent.EXTRA_TEXT, body);
      intent.putExtra(Intent.EXTRA_SUBJECT, subject);
      intent.putExtra(Intent.EXTRA_CC, cc);
      intent.setType("message/rfc822");
      return intent;
    }
}
