import Time "mo:core/Time";
import Float "mo:core/Float";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type UserRole = AccessControl.UserRole;

  module DealerProfile {
    public func compare(profile1 : DealerProfile, profile2 : DealerProfile) : Order.Order {
      Text.compare(profile1.name, profile2.name);
    };
  };

  module ServiceRequest {
    public func compare(request1 : ServiceRequest, request2 : ServiceRequest) : Order.Order {
      switch (Text.compare(request1.status, request2.status)) {
        case (#equal) { Int.compare(request2.createdAt, request1.createdAt) };
        case (order) { order };
      };
    };
  };

  type DealerProfile = {
    id : Principal;
    name : Text;
    address : Text;
    phone : Text;
    rating : Float;
    totalRatings : Nat;
    isActive : Bool;
    createdAt : Int;
  };

  type ServiceRequest = {
    id : Text;
    customerId : Principal;
    dealerId : ?Principal;
    location : Text;
    vehicleType : Text;
    tyreType : Text;
    issue : Text;
    status : Text;
    createdAt : Int;
    updatedAt : Int;
    customerRating : ?Nat;
  };

  type NewServiceRequest = {
    location : Text;
    vehicleType : Text;
    tyreType : Text;
    issue : Text;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let dealerProfiles = Map.empty<Principal, DealerProfile>();
  let serviceRequests = Map.empty<Text, ServiceRequest>();

  func uuid() : Text {
    Time.now().toText();
  };

  public shared ({ caller }) func registerDealer(name : Text, address : Text, phone : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can register as dealers");
    };
    let existing = dealerProfiles.get(caller);
    switch (existing) {
      case (null) {};
      case (?profile) {
        if (profile.isActive) {
          Runtime.trap("Dealer already registered");
        };
      };
    };
    let newProfile : DealerProfile = {
      id = caller;
      name;
      address;
      phone;
      rating = 0.0;
      totalRatings = 0;
      isActive = true;
      createdAt = Time.now();
    };
    dealerProfiles.add(caller, newProfile);
  };

  public shared ({ caller }) func createServiceRequest(request : NewServiceRequest) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create service requests");
    };
    let id = uuid();
    let newRequest : ServiceRequest = {
      id;
      customerId = caller;
      dealerId = null;
      location = request.location;
      vehicleType = request.vehicleType;
      tyreType = request.tyreType;
      issue = request.issue;
      status = "pending";
      createdAt = Time.now();
      updatedAt = Time.now();
      customerRating = null;
    };
    serviceRequests.add(id, newRequest);
    id;
  };

  public query ({ caller }) func getDealerProfile(dealerId : Principal) : async DealerProfile {
    switch (dealerProfiles.get(dealerId)) {
      case (null) { Runtime.trap("Dealer not found") };
      case (?profile) { profile };
    };
  };

  public query ({ caller }) func getActiveDealers() : async [DealerProfile] {
    dealerProfiles.values().toArray().filter(
      func(profile) { profile.isActive }
    ).sort();
  };

  public shared ({ caller }) func acceptRequest(requestId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can accept service requests");
    };
    if (not dealerProfiles.containsKey(caller)) {
      Runtime.trap("Unauthorized: Only dealers can accept requests");
    };

    switch (serviceRequests.get(requestId)) {
      case (null) { Runtime.trap("Request not found") };
      case (?request) {
        if (request.status != "pending") { Runtime.trap("Request not available") };
        let updatedRequest = {
          request with
          dealerId = ?caller;
          status = "accepted";
          updatedAt = Time.now();
        };
        serviceRequests.add(requestId, updatedRequest);
      };
    };
  };

  public shared ({ caller }) func completeRequest(requestId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can complete service requests");
    };
    if (not dealerProfiles.containsKey(caller)) {
      Runtime.trap("Unauthorized: Only dealers can complete requests");
    };

    switch (serviceRequests.get(requestId)) {
      case (null) { Runtime.trap("Request not found") };
      case (?request) {
        if (request.status != "accepted") { Runtime.trap("Request not available") };

        switch (request.dealerId) {
          case (?dealerId) {
            if (dealerId != caller) { Runtime.trap("Not your request") };
          };
          case (null) { Runtime.trap("No dealer assigned") };
        };
        let updatedRequest = {
          request with
          status = "completed";
          updatedAt = Time.now();
        };
        serviceRequests.add(requestId, updatedRequest);
      };
    };
  };

  public shared ({ caller }) func cancelRequest(requestId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can cancel service requests");
    };

    switch (serviceRequests.get(requestId)) {
      case (null) { Runtime.trap("Request not found") };
      case (?request) {
        if (request.customerId != caller) { Runtime.trap("Permission denied") };
        if (request.status != "pending") { Runtime.trap("Cannot cancel this request") };
        let updatedRequest = {
          request with
          status = "cancelled";
          updatedAt = Time.now();
        };
        serviceRequests.add(requestId, updatedRequest);
      };
    };
  };

  public shared ({ caller }) func rateDealer(requestId : Text, rating : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can rate dealers");
    };

    if (rating < 1 or rating > 5) {
      Runtime.trap("Rating must be between 1 and 5");
    };

    switch (serviceRequests.get(requestId)) {
      case (null) { Runtime.trap("Request not found") };
      case (?request) {
        if (request.customerId != caller) { Runtime.trap("Permission denied") };
        if (request.status != "completed") { Runtime.trap("Not eligible for rating") };
        if (request.customerRating != null) { Runtime.trap("Already rated") };

        serviceRequests.add(requestId, {
          request with
          customerRating = ?rating;
        });

        switch (request.dealerId) {
          case (?dealerId) {
            switch (dealerProfiles.get(dealerId)) {
              case (null) {};
              case (?dealerProfile) {
                let totalRatings = dealerProfile.totalRatings + 1;
                let ratingSum = dealerProfile.rating * dealerProfile.totalRatings.toFloat() + rating.toFloat();
                let newRating = ratingSum / totalRatings.toFloat();
                dealerProfiles.add(dealerId, {
                  dealerProfile with
                  rating = newRating;
                  totalRatings;
                });
              };
            };
          };
          case (null) {};
        };
      };
    };
  };

  public query ({ caller }) func getServiceRequest(requestId : Text) : async ServiceRequest {
    switch (serviceRequests.get(requestId)) {
      case (null) { Runtime.trap("Request not found") };
      case (?request) {
        // Only allow access to: the customer who created it, the assigned dealer, or admins
        let isCustomer = request.customerId == caller;
        let isAssignedDealer = switch (request.dealerId) {
          case (?dealerId) { dealerId == caller };
          case (null) { false };
        };
        let isAdmin = AccessControl.isAdmin(accessControlState, caller);
        
        if (not (isCustomer or isAssignedDealer or isAdmin)) {
          Runtime.trap("Unauthorized: You don't have permission to view this request");
        };
        
        request;
      };
    };
  };

  public query ({ caller }) func getDealerRequests() : async [ServiceRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view dealer requests");
    };
    if (not dealerProfiles.containsKey(caller)) {
      Runtime.trap("Permission denied: Only dealers can view dealer requests");
    };
    serviceRequests.values().toArray().filter(
      func(request) {
        switch (request.dealerId) {
          case (?dealerId) { dealerId == caller };
          case (null) { false };
        };
      }
    ).sort();
  };

  public query ({ caller }) func getCustomerRequests() : async [ServiceRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only customers can view service requests");
    };
    serviceRequests.values().toArray().filter(
      func(request) { request.customerId == caller }
    ).sort();
  };

  public query ({ caller }) func getOpenRequests() : async [ServiceRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view open requests");
    };
    if (not dealerProfiles.containsKey(caller)) {
      Runtime.trap("Permission denied: Only dealers can view open requests");
    };
    serviceRequests.values().toArray().filter(
      func(request) { request.status == "pending" }
    ).sort();
  };

  public query ({ caller }) func getAllRequests() : async [ServiceRequest] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can get requests");
    };
    serviceRequests.values().toArray().sort();
  };

  public query ({ caller }) func getRequestsByDealer(dealerId : Principal) : async [ServiceRequest] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can get requests");
    };
    serviceRequests.values().toArray().filter(
      func(request) {
        switch (request.dealerId) {
          case (?dId) { dId == dealerId };
          case (null) { false };
        };
      }
    ).sort();
  };

  public query ({ caller }) func getPendingRequestsByDealer(dealerId : Principal) : async [ServiceRequest] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can get requests");
    };
    serviceRequests.values().toArray().filter(
      func(request) {
        switch (request.dealerId) {
          case (?dId) { dId == dealerId };
          case (null) { false };
        };
      }
    );
  };

  public query ({ caller }) func getAllDealers() : async [DealerProfile] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can get dealers");
    };
    dealerProfiles.values().toArray().sort();
  };
};
