//
//  RNMeps.swift
//  BobDemo
//
//  Created by Jamal Alalami on 4/8/21.
//  Copyright © 2021 Facebook. All rights reserved.
//

import Foundation
import MPGSDK

@objc(RNMeps)
class RNMeps: NSObject {
  // change merchantId TEST9800070500
  let gateway = Gateway(region: GatewayRegion.custom, merchantId: "TEST9800070500")


  @objc
  func startPayment(_ customData: Array<String>, callback:
                      @escaping RCTResponseSenderBlock){
    print(gateway)
    
    var request = GatewayMap()
    request[at: "sourceOfFunds.provided.card.nameOnCard"] = customData[1]
    request[at: "sourceOfFunds.provided.card.number"] = customData[2]
    request[at: "sourceOfFunds.provided.card.expiry.month"] = customData[3]
    request[at: "sourceOfFunds.provided.card.expiry.year"] = customData[4]
    request[at: "sourceOfFunds.provided.card.securityCode"] = customData[5]
    
    gateway.updateSession(customData[0] as String, apiVersion: "49", payload: request) {
      (result) in
      

      switch result {
       case .success(let response):
        callback([response.dictionary as Any])
        print(response)
       case .error(let error):
         print(error)
        callback([error.localizedDescription as Any])

       }
    }
  }


}
