/**
 * Match Status Priority Order
 * Used to determine which Match Suggestion to display if multiple exist.
 * 1. mutual_accept (Already matched, needs payment) -> Most critical
 * 2. accepted (Legacy accepted status)
 * 3. accepted_by_target (They liked you, you need to decide)
 * 4. accepted_by_owner (You liked them, waiting for them)
 * 5. pending_decision (Fresh suggestion)
 */
export const MATCH_STATUS_PRIORITY = [
  'mutual_accept', 
  'accepted', 
  'accepted_by_target', 
  'accepted_by_owner', 
  'pending_decision'
];
