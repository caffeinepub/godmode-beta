# Specification

## Summary
**Goal:** Build the GODMODE (Beta) prototype with authenticated outcome sessions, context-driven micro-adjustment recommendations, probability/event drift visualization, uncertainty mechanics, and public aggregate “Timeline Fracture” insights—within a coherent non-blue/purple visual theme and with clear prototype disclosures.

**Planned changes:**
- Create a branded GODMODE (Beta) app shell with consistent theme styling across all screens and English-only UI text.
- Add Internet Identity sign-in/out, show auth state, and gate session creation/viewing behind authentication.
- Implement Outcome Sessions: create session with outcome text + optional parameters (time horizon, risk tolerance), generate and display micro-adjustment recommendations, and persist sessions for revisit.
- Add Context Scan module with user-entered proxy signals (stress, mood, social energy, manual weather, manual crowd density, notes) saved as a timestamped snapshot per session.
- Implement backend recommendation engine (deterministic + stochastic) using outcome + context + “Inject Uncertainty,” storing recommendations with explanations and allowing explicit regeneration.
- Add Event Drift dashboard per session with four probability categories and a primary trajectory control; regenerate/update probabilities when context or settings change (summing to ~100%).
- Track per-user Reality Pressure / Probability Debt based on regeneration and high-impact/low-probability pushing; display debt level states and heuristic trade-off indicators.
- Implement Timeline Fracture prototype: user sets city/region, toggling Inject Uncertainty increments a city/region aggregate counter; provide a public, non-identifying dashboard with generated collective-effect summaries.
- Add Settings/About with city/region and prominent disclosure text (prototype, no guarantees, recommendations are prompts, context is user-entered proxies; no real sensor/camera/social scraping).
- Implement a basic data model and persistence in a single Motoko actor for user profile, sessions (including context, recommendations, event drift), and Probability Debt; add navigation to all required screens with loading/error states.

**User-visible outcome:** Users can sign in with Internet Identity, create and revisit outcome sessions, enter context snapshots, generate/regenerate explained micro-adjustments with an Inject Uncertainty option, view an Event Drift probability breakdown, see their Probability Debt with warnings/trade-offs, set their city/region, and view a public Timeline Fracture dashboard of aggregate uncertainty activity—alongside clear in-app prototype disclosures.
