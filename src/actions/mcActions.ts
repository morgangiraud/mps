import type { MarkovProcessState } from "../types/markovProcessState";
import type { MarkovRewardProcessState } from "../types/markovRewardProcessState";
import type { P } from "../types/p";

export const UPDATE_MARKOV_TYPE = "UPDATE_MARKOV_TYPE" as const;
export const updateMarkovType = (markovType: string) => ({
  type: UPDATE_MARKOV_TYPE,
  markovType,
});

export const UPDATE_P = "UPDATE_P" as const;
export const updateP = (P: P) => ({
  type: UPDATE_P,
  P,
});

export const UPDATE_PROBA = "UPDATE_PROBA" as const;
export const updateProba = (i: number, j: number, p: number) => ({
  type: UPDATE_PROBA,
  i,
  j,
  p: Math.floor(p * 1000) / 1000,
});

export const UPDATE_REWARD = "UPDATE_REWARD" as const;
export const updateReward = (index: number, value: number) => ({
  type: UPDATE_REWARD,
  index,
  value: Math.floor(value * 1000) / 1000,
});

export const UPDATE_GAMMA = "UPDATE_GAMMA" as const;
export const updateGamma = (gamma: number) => ({
  type: UPDATE_GAMMA,
  gamma,
});

export const UPDATE_HORIZON = "UPDATE_HORIZON" as const;
export const updateHorizon = (horizon: number) => ({
  type: UPDATE_HORIZON,
  horizon,
});

export const UPDATE_EPSILON = "UPDATE_EPSILON" as const;
export const updateEpsilon = (epsilon: number) => ({
  type: UPDATE_EPSILON,
  epsilon,
});

export const ADD_MARKOV_STATE = "ADD_MARKOV_STATE" as const;
export const addMarkovState = (
  state: Partial<MarkovProcessState | MarkovRewardProcessState> = {
    seed: Math.random().toString(36).substr(2, 5),
  },
  pi: number[] | undefined,
) => ({
  type: ADD_MARKOV_STATE,
  state,
  pi,
});

export const REMOVE_MARKOV_STATE = "REMOVE_MARKOV_STATE" as const;
export const removeMarkovState = (piIndex: number) => ({
  type: REMOVE_MARKOV_STATE,
  piIndex,
});

export const EXPORT_MP = "EXPORT_MP" as const;
export const exportData = () => ({
  type: EXPORT_MP,
});
