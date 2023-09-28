package com.bob.abdeen;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.Map;
import java.util.HashMap;
import com.mastercard.gateway.android.sdk.Gateway;
import com.mastercard.gateway.android.sdk.GatewayMap;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;
import com.mastercard.gateway.android.sdk.GatewayCallback;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

public class RNMeps extends ReactContextBaseJavaModule {

    RNMeps(ReactApplicationContext context) {
        super(context);

    }


    @NonNull
    @Override
    public String getName() {
        return "RNMeps";
    }

    @ReactMethod
    public void startPayment(ReadableMap options, Promise promise) {
        GatewayCallback callback = new GatewayCallback() {
            @Override
            public void onSuccess(GatewayMap response) {
                Log.d("res",response.get("session").toString());
                WritableMap data = Arguments.createMap();
                data.putString("session", response.get("session").toString());

                promise.resolve(data);
                // TODO handle success
            }

            @Override
            public void onError(Throwable throwable) {
                promise.reject(throwable.getMessage());
                // TODO handle error
            }
        };

        Gateway gateway = new Gateway();
        gateway.setMerchantId("TEST9800070500");

        gateway.setRegion(Gateway.Region.MTF);

        GatewayMap request = new GatewayMap()
                .set("sourceOfFunds.provided.card.nameOnCard", options.getString("cardholderName"))
                .set("sourceOfFunds.provided.card.number", options.getString("cardNumber"))
                .set("sourceOfFunds.provided.card.securityCode", options.getString("cvv"))
                .set("sourceOfFunds.provided.card.expiry.month", options.getString("expiryMonth"))
                .set("sourceOfFunds.provided.card.expiry.year", options.getString("expiryYear"));

        gateway.updateSession(options.getString("sessionId"), "49", request,callback );

    }
}