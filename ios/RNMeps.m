//
//  RNMeps.m
//  BobDemo
//
//  Created by Jamal Alalami on 4/8/21.
//  Copyright © 2021 Facebook. All rights reserved.
//

#import <React/RCTBridgeModule.h>
#import <Foundation/Foundation.h>


@interface RCT_EXTERN_MODULE(RNMeps, NSObject)
RCT_EXTERN_METHOD(startPayment: (NSArray *)customData callback:(RCTResponseSenderBlock _Nonnull)callback)

@end
