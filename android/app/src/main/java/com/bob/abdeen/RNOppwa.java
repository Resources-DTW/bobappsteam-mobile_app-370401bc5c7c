package  com.bob.abdeen;

import android.app.Activity;
import android.app.Application;
import android.content.BroadcastReceiver;
import android.content.Context;

import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.util.Log;
import android.content.ServiceConnection;
import android.content.ComponentName;
import android.os.IBinder;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.oppwa.mobile.connect.exception.PaymentError;
import com.oppwa.mobile.connect.exception.PaymentException;
import com.oppwa.mobile.connect.payment.BrandsValidation;
import com.oppwa.mobile.connect.payment.CheckoutInfo;
import com.oppwa.mobile.connect.payment.ImagesRequest;
import com.oppwa.mobile.connect.payment.card.CardPaymentParams;
import com.oppwa.mobile.connect.provider.Connect;
import com.oppwa.mobile.connect.provider.ITransactionListener;
import com.oppwa.mobile.connect.provider.Transaction;
import com.oppwa.mobile.connect.provider.TransactionType;
import com.oppwa.mobile.connect.service.IProviderBinder;
import com.oppwa.mobile.connect.service.ConnectService;

import com.facebook.react.modules.core.DeviceEventManagerModule;

import javax.annotation.Nullable;

public class RNOppwa extends ReactContextBaseJavaModule implements ITransactionListener {
    private final static String TAG = RNOppwa.class.getCanonicalName();
    private IProviderBinder binder;
    private Context mApplicationContext;
    private Intent bindIntent;
    private boolean production;
    // private Promise promiseModule;

    private ServiceConnection serviceConnection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            Log.i("payment-hyperpsy", "onServiceConnected ");

            binder = (IProviderBinder) service;
            /* we have a connection to the service */
        try {
                if(production){
                    binder.initializeProvider(Connect.ProviderMode.LIVE);
                    Log.i("payment-hyperpsy", "RequestSucceeded33 " + Connect.ProviderMode.LIVE);
                } else {
                    binder.initializeProvider(Connect.ProviderMode.TEST);
                    Log.i("payment-hyperpsy", "RequestSucceeded444 " + Connect.ProviderMode.TEST);
                }


            } catch (PaymentException ee) {

                /* error occurred */
            }
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {
            binder = null;
        }
    };

    public RNOppwa(ReactApplicationContext reactContext) {
        super(reactContext);
        mApplicationContext = reactContext.getApplicationContext();
        Intent intent = new Intent(mApplicationContext, ConnectService.class);
        Log.i("payment-hyperpsy", "onServiceConnected ");

        mApplicationContext.startService(intent);
        mApplicationContext.bindService(intent, serviceConnection, Context.BIND_AUTO_CREATE);

    }

    public void unBindService() {
        if (serviceConnection != null) {
            // Unbind from the In-app Billing service when we are done
            // Otherwise, the open service connection could cause the device’s performance
            // to degrade
            mApplicationContext.unbindService(serviceConnection);
        }
    }

    @Override
    public String getName() {
        return "RNOppwa";
    }

    @ReactMethod
    public void isValidNumber(ReadableMap options, Promise promise) {
        if (!CardPaymentParams.isNumberValid(options.getString("cardNumber"), options.getString("paymentBrand"))) {
            promise.reject("oppwa/card-invalid", "The card number is invalid.");
        } else {
            promise.resolve(null);
        }


    }
 @ReactMethod
    public void initProd(boolean prod){
        try{
            if(prod){
                binder.initializeProvider(Connect.ProviderMode.LIVE);
                Log.i("payment-hyperpsy", "RequestSucceeded " + Connect.ProviderMode.LIVE);
                production=true;
            } else {
                binder.initializeProvider(Connect.ProviderMode.TEST);
                Log.i("payment-hyperpsy", "RequestSucceeded " + Connect.ProviderMode.TEST);
                production=false;
            }

         } catch (PaymentException ee) {
                /* error occurred */
            }
    }
    @ReactMethod
    public void transactionPayment(ReadableMap options, Promise promise) {
        // promiseModule = promise;
        Log.d("jamal", "onServiceConnected ");

        try {

            boolean isTokenizationEnabled = true;
            CardPaymentParams cardPaymentParams = new CardPaymentParams(options.getString("checkoutID"),
                    options.getString("paymentBrand"), options.getString("cardNumber"), options.getString("holderName"),
                    options.getString("expiryMonth"), options.getString("expiryYear"), options.getString("cvv"));

            cardPaymentParams.setShopperResultUrl("sameh://result");

            cardPaymentParams.setTokenizationEnabled(true);
            Transaction transaction = null;

            try {

                transaction = new Transaction(cardPaymentParams);

                binder.submitTransaction(transaction);
                binder.addTransactionListener(RNOppwa.this);
                WritableMap data = Arguments.createMap();
                data.putString("OS", "android");

                promise.resolve(data);
            } catch (PaymentException ee) {
                promise.reject(null, ee.getMessage());
            }
        } catch (PaymentException e) {
            promise.reject(null, e.getMessage());
        }

    }

    @Override
    public void paymentConfigRequestSucceeded(CheckoutInfo checkoutInfo) {
        Log.i("payment-hyperpsy", "RequestSucceeded " + checkoutInfo.getCurrencyCode());

    }

    @Override
    public void paymentConfigRequestFailed(PaymentError paymentError) {

        Log.i("payment-hyperpsy", "RequestFailed jamal " + paymentError.getErrorInfo() + " : " + paymentError.getErrorMessage());
    }

    @Override
    public void transactionCompleted(Transaction transaction) {
        // shoud add listner
        WritableMap data = Arguments.createMap();
        data.putString("status", "transactionCompleted");
        data.putString("checkoutID", transaction.getPaymentParams().getCheckoutId());

        if (transaction.getTransactionType() == TransactionType.SYNC) {
            data.putString("type","synchronous");
        }else {
            data.putString("type","asynchronous");
            data.putString("redirectURL",transaction.getRedirectUrl());
        }

        getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("transactionStatus", data);

        // promiseModule.resolve(transaction);

    }

    @Override
    public void transactionFailed(Transaction transaction, PaymentError paymentError) {

        WritableMap data = Arguments.createMap();

        data.putString("status", "transactionFailed");
        data.putString("checkoutID", transaction.getPaymentParams().getCheckoutId());

        getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("transactionStatus", data);
        Log.i("payment-hyperpsy",
                "transactionFailed " + paymentError.getErrorMessage() + " : " + paymentError.getErrorInfo());
    }

    @Override
    public void brandsValidationRequestSucceeded(BrandsValidation var1){}

    @Override
    public void brandsValidationRequestFailed(PaymentError var1){}

    @Override
    public void imagesRequestSucceeded(ImagesRequest var1){}

    @Override
    public void imagesRequestFailed(){}

}
