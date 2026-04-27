export interface PitchDeck {
  tagline: string;
  problem: {
    statement: string;
    who_feels_it: string;
    how_big_is_it: string;
  };
  solution: {
    what_it_is: string;
    how_it_works: string;
    unique_angle: string;
  };
  market: {
    target_users: string;
    market_size: string;
    why_now: string;
  };
  business_model: {
    how_you_make_money: string;
    pricing_idea: string;
    growth_path: string;
  };
  competition: {
    existing_alternatives: string;
    your_edge: string;
  };
  traction: {
    current_stage: string;
    next_milestone: string;
  };
  ask: {
    what_you_need: string;
    what_it_will_be_used_for: string[];
  };
  one_liner_pitch: string;
  investor_score: {
    score: string;
    strengths: string[];
    risks: string[];
    verdict: string;
  };
}
