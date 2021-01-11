package ie.mosaic.RoadRunner;


import com.reactnativenavigation.controllers.SplashActivity;

import android.content.Context;
import android.content.Intent;

import androidx.multidex.MultiDex;


public class MainActivity extends SplashActivity {
    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        MultiDex.install(this);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
    }
}
