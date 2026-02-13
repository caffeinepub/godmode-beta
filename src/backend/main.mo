import Text "mo:core/Text";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Authorization mixin
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Data Types
  public type OutcomeSession = {
    id : Nat;
    user : Principal;
    outcome : Text;
    timeHorizon : Text;
    riskTolerance : Text;
    created : Time.Time;
    contextScan : ?ContextScanSnapshot;
    recommendations : [Recommendation];
    eventDrift : EventDrift;
  };

  public type ContextScanSnapshot = {
    stressLevel : Nat; // 1-10
    mood : Nat; // 1-10
    socialEnergy : Nat; // 1-10
    weather : Text;
    crowdDensity : Text;
    notes : Text;
  };

  public type Recommendation = {
    adjustment : Text;
    explanation : Text;
  };

  public type EventDrift = {
    averageWeek : Nat; // Percentage (0-100)
    unusual : Nat;
    highImpact : Nat;
    lifeAltering : Nat;
    currentTrajectory : Nat; // 0-100 scale
  };

  public type UserProfile = {
    city : Text;
    region : Text;
    preferences : Text;
    probabilityDebt : Nat;
  };

  type SessionId = Nat;

  module OutcomeSession {
    public func compare(a : OutcomeSession, b : OutcomeSession) : Order.Order {
      Nat.compare(b.id, a.id);
    };
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let outcomeSessions = Map.empty<SessionId, OutcomeSession>();
  var nextSessionId = 0;

  // Authorization Logic (includes from component)
  public shared ({ caller }) func saveCallerUserProfile(city : Text, region : Text, preferences : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    let profile : UserProfile = {
      city;
      region;
      preferences;
      probabilityDebt = 0;
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // Outcome Session Core Logic
  public shared ({ caller }) func createOutcomeSession(
    outcome : Text,
    timeHorizon : Text,
    riskTolerance : Text,
  ) : async SessionId {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create sessions");
    };

    let sessionId = nextSessionId;
    nextSessionId += 1;

    let session : OutcomeSession = {
      id = sessionId;
      user = caller;
      outcome;
      timeHorizon;
      riskTolerance;
      created = Time.now();
      contextScan = null;
      recommendations = [];
      eventDrift = {
        averageWeek = 70;
        unusual = 15;
        highImpact = 10;
        lifeAltering = 5;
        currentTrajectory = 50;
      };
    };

    outcomeSessions.add(sessionId, session);
    sessionId;
  };

  public shared ({ caller }) func addContextScan(sessionId : SessionId, snapshot : ContextScanSnapshot) : async () {
    let session = getSessionOwned(sessionId, caller);
    let updatedSession : OutcomeSession = {
      id = session.id;
      user = session.user;
      outcome = session.outcome;
      timeHorizon = session.timeHorizon;
      riskTolerance = session.riskTolerance;
      created = session.created;
      contextScan = ?snapshot;
      recommendations = session.recommendations;
      eventDrift = session.eventDrift;
    };
    outcomeSessions.add(sessionId, updatedSession);
  };

  public query ({ caller }) func getSession(sessionId : SessionId) : async OutcomeSession {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view sessions");
    };
    switch (outcomeSessions.get(sessionId)) {
      case (null) { Runtime.trap("Session does not exist") };
      case (?session) {
        if (session.user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own sessions");
        };
        session;
      };
    };
  };

  public query ({ caller }) func getUserSessions(user : Principal) : async [OutcomeSession] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view sessions");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own sessions");
    };
    outcomeSessions.values()
    .toArray()
    .filter(func(s) { s.user == user })
    .sort();
  };

  public query ({ caller }) func getAllSessions() : async [OutcomeSession] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all sessions");
    };
    outcomeSessions.values().toArray().sort();
  };

  // Context Scan & Recommendations
  public shared ({ caller }) func generateRecommendations(
    sessionId : SessionId,
    injectUncertainty : Bool,
  ) : async [Recommendation] {
    let session = getSessionOwned(sessionId, caller);

    // Stochastic seed (force to 0/1 for deterministic output in this context)
    let randomRecommendation = if (injectUncertainty) { 1 } else { 0 };
    let context = session.contextScan;

    let baseRecommendations = [
      { adjustment = "Take a short walk"; explanation = "Improves blood flow and energy"; },
      { adjustment = "Call someone you trust"; explanation = "Positive social interaction boosts mood"; },
      { adjustment = "Focus on one small task"; explanation = "Build momentum and reduce overwhelm"; },
      { adjustment = "Change your environment"; explanation = "Switch locations to reset mental state"; },
    ];

    let recommendations = baseRecommendations.concat([
      { adjustment = "Try a new activity"; explanation = "Injecting novelty increases creativity"; },
      { adjustment = "Embrace uncertainty"; explanation = "Unexpected choices can yield growth"; },
    ]);

    let filteredRecommendations = if (recommendations.size() == 0) {
      [];
    } else {
      if (randomRecommendation == 0) {
        [recommendations[0]];
      } else {
        recommendations.sliceToArray(0, Nat.min(randomRecommendation + 1, recommendations.size()));
      };
    };

    let updatedSession : OutcomeSession = {
      id = session.id;
      user = session.user;
      outcome = session.outcome;
      timeHorizon = session.timeHorizon;
      riskTolerance = session.riskTolerance;
      created = session.created;
      contextScan = context;
      recommendations = filteredRecommendations;
      eventDrift = session.eventDrift;
    };

    outcomeSessions.add(sessionId, updatedSession);
    filteredRecommendations;
  };

  // Helper Functions (not public)
  func getSessionOwned(sessionId : SessionId, caller : Principal) : OutcomeSession {
    switch (outcomeSessions.get(sessionId)) {
      case (null) { Runtime.trap("Session does not exist") };
      case (?session) {
        if (session.user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unable to access session");
        };
        session;
      };
    };
  };
};
