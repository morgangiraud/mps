import { cos, det, sin } from "mathjs";

import { MarkovProcessState } from "./types/markovProcessState";
import { MarkovRewardProcessState } from "./types/markovRewardProcessState";
import { P } from "./types/p";
import utils, { checkMarkovRewardStates, checkMarkovStates } from "./utils";
import { Node } from "./types/node";
import { Link } from "./types/link";

export const initializeMarkovProcess = <
  T extends MarkovProcessState | MarkovRewardProcessState,
>(
  type: "mp" | "mrp",
  states: Partial<T>[],
  P: P,
) => {
  let checkedStates: (MarkovProcessState | MarkovRewardProcessState)[];
  if (type === "mrp") {
    checkedStates = checkMarkovRewardStates(states);
  } else {
    checkedStates = checkMarkovStates(states);
  }

  const checkedP = utils.checkP(P);

  if (checkedStates.length !== checkedP.length) {
    throw new Error(
      "You should have as many states as rows in the transition matrix",
    );
  }

  const detValue = det(P);

  return {
    states: checkedStates as T[],
    P: checkedP,
    detValue,
  };
};

export const initializeForceSimulation = <
  T extends MarkovProcessState | MarkovRewardProcessState,
>(
  states: T[],
  P: P,
) => {
  const d3Nodes = buildNodes<T>([...states]);
  const d3Links = buildLinks<T>(P, d3Nodes);
  const terminalStates = utils.findTerminalStates<T>(d3Links);

  d3Nodes.forEach((node) => {
    node.data.terminal = terminalStates.includes(node);
  });

  return { d3Nodes, d3Links };
};

export const buildNodes = <
  T extends MarkovProcessState | MarkovRewardProcessState,
>(
  states: T[],
) => {
  const separationAngle = (2 * Math.PI) / states.length;
  const circleRadius = 250;

  return states.map((state, i) => {
    return {
      data: state,
      index: i,
      x: circleRadius * cos(i * separationAngle),
      y: circleRadius * sin(i * separationAngle),
    } as Node<T>;
  });
};

export const buildLinks = <
  T extends MarkovProcessState | MarkovRewardProcessState,
>(
  P: P,
  nodes: Node<T>[],
) => {
  const links: Link<T>[] = [];

  P.forEach((pi, i) => {
    pi.forEach((p, j) => {
      if (p === 0) return;

      links.push({
        source: nodes[i],
        target: nodes[j],
        p: p,
        class: "link",
      });
    });
  });

  return links;
};

export const addRewardsToStates = (
  nodes: Node<MarkovRewardProcessState>[],
  rewards: number[],
) => {
  if (!Array.isArray(rewards)) {
    throw new Error("rewards must be an array");
  }
  // Filling missing rewards with 0 values
  if (rewards.length !== nodes.length) {
    if (nodes.length > rewards.length) {
      while (nodes.length !== rewards.length) {
        rewards.push(0);
      }
    } else {
      rewards = rewards.slice(0, nodes.length);
    }
  }

  return nodes.map((node, i) => {
    node.data.reward = rewards[i];
    return node;
  });
};

export const isMarkovRewardProcessState = (
  state: MarkovProcessState | MarkovRewardProcessState,
): state is MarkovRewardProcessState => {
  return "reward" in state;
};
