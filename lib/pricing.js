// Price in INR. "lacs" => 100,000
const L = 100000;

// Diamond type -> quality -> karat -> price
export const PRICING = {
  natural: {
    "EF VVS-VS": {
      "18kt": 11.5 * L,
      "14kt": 10.5 * L,
      "10kt": 10 * L,
    },
    "GH VS-SI": {
      "18kt": 10.5 * L,
      "14kt": 9 * L,
      "10kt": 8.5 * L,
    },
  },
  "lab-grown": {
    "EF VVS-VS": {
      "18kt": 7 * L,
      "14kt": 6 * L,
      "10kt": 5 * L,
    },
    "GH VS-SI": {
      "18kt": 6.5 * L,
      "14kt": 5.5 * L,
      "10kt": 4.5 * L,
    },
  },
};

export const KARATS = ["18kt", "14kt", "10kt"];

export const DIAMOND_TYPES = [
  { value: "natural", label: "Natural Diamond" },
  { value: "lab-grown", label: "Lab-Grown Diamond" },
];

export function qualitiesFor(diamondType) {
  return Object.keys(PRICING[diamondType] || {});
}

export function getPrice({ diamondType, quality, karat }) {
  return PRICING?.[diamondType]?.[quality]?.[karat] ?? null;
}
