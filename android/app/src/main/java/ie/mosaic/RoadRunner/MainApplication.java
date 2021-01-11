package ie.mosaic.RoadRunner;


import android.content.Intent;

import com.BV.LinearGradient.LinearGradientPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.csath.RNConfigReaderPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.react.ReactPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.gettipsi.stripe.StripeReactPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.reactnativecommunity.picker.RNCPickerPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.controllers.ActivityCallbacks;
import com.wheelpicker.WheelPickerPackage;
import com.brentvatne.react.ReactVideoPackage;

import io.invertase.firebase.app.ReactNativeFirebaseAppPackage;
import io.invertase.firebase.crashlytics.ReactNativeFirebaseCrashlyticsPackage;
import io.invertase.firebase.analytics.ReactNativeFirebaseAnalyticsPackage;

import java.util.Arrays;
import java.util.List;

import co.apptailor.googlesignin.RNGoogleSigninPackage;
import ui.notificationbanner.RNNotificationBannerPackage;

public class MainApplication extends NavigationApplication {
    private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

    protected static CallbackManager getCallbackManager() {
        return mCallbackManager;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        setActivityCallbacks(new ActivityCallbacks() {
            @Override
            public void onActivityResult(int requestCode, int resultCode, Intent data) {
                mCallbackManager.onActivityResult(requestCode, resultCode, data);
            }
        });
        FacebookSdk.sdkInitialize(getApplicationContext());
        AppEventsLogger.activateApp(this);
    }

    @Override
    public boolean isDebug() {
        // Make sure you are using BuildConfig from your own application
        return false;
    }

    protected List<ReactPackage> getPackages() {
        
        // Add additional packages you require here
        // No need to add RnnPackage and MainReactPackage
        return Arrays.<ReactPackage>asList(

                new WheelPickerPackage(),
                new VectorIconsPackage(),
                new MapsPackage(),
                new LinearGradientPackage(),
                new AsyncStoragePackage(),
                new RNConfigReaderPackage(BuildConfig.class),
                new StripeReactPackage(),
                new RNGoogleSigninPackage(),
                new FBSDKPackage(mCallbackManager),
                new RNCWebViewPackage(),
                new RNCPickerPackage(),
                new ReactNativePushNotificationPackage(),
                new RNNotificationBannerPackage(),
                new ReactVideoPackage(),
                new ReactNativeFirebaseAppPackage(),
                new ReactNativeFirebaseCrashlyticsPackage(),
                new ReactNativeFirebaseAnalyticsPackage()
        );
    }

    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
        return getPackages();
    }

    @Override
    public String getJSMainModuleName() {
        return "index";
    }
}
