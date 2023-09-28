package com.bob.abdeen;

import com.facebook.react.PackageList;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;

import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.react.NavigationReactNativeHost;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;                     

import java.util.List;

public class MainApplication extends NavigationApplication {
    private final ReactNativeHost host = new NavigationReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            List<ReactPackage> packages = new PackageList(this).getPackages();
            // Packages that cannot be auto linked yet can be added manually here, for example:
            // packages.add(new MyReactNativePackage());
            packages.add(new RNFirebaseNotificationsPackage());
            packages.add(new RNFirebaseMessagingPackage());
            packages.add(new RNOppwaPackage());
            packages.add(new RNMepsPackage());
            return packages;
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }

        @Override
        protected String getJSBundleFile() {
            return CodePush.getJSBundleFile();
        }
       
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        
        return host;
    }
}
