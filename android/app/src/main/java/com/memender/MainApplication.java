package com.memender;

import android.app.Application;
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.react.ReactApplication;
import com.BV.LinearGradient.LinearGradientPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import suraj.tiwari.reactnativefbads.FBAdsPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.oblador.vectoricons.VectorIconsPackage;

import com.RNFetchBlob.RNFetchBlobPackage;
import br.com.classapp.RNSensitiveInfo.RNSensitiveInfoPackage;
import com.avishayil.rnrestart.ReactNativeRestartPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.auth0.react.A0Auth0Package;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.facebook.ads.AudienceNetworkAds;


import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
  return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new LinearGradientPackage(),
            new PickerPackage(),
            new FBAdsPackage(),
            new FBSDKPackage(mCallbackManager),
            new VectorIconsPackage(),
            new RNFetchBlobPackage(),
            new RNSensitiveInfoPackage(),
            new ReactNativeRestartPackage(),
            new RNGestureHandlerPackage(),
            new RNDeviceInfo(),
            new ReactNativeConfigPackage(),
            new A0Auth0Package()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    AudienceNetworkAds.initialize(this);
    SoLoader.init(this, /* native exopackage */ false);
  }
}
