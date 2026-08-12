export interface Circuit {
  id: string;
  name: string;
  location: string;
  country: string;
  flag: string;
  lengthKm: number;
  laps: number;
  corners: number;
  drsZones: number;
  lapRecord: {
    time: string;
    driver: string;
    year: number;
  };
  svgPath: string; // Track outline representation
  sectors: { id: number; name: string; lengthKm: number }[];
  description: string;
}

export interface Driver {
  id: string;
  number: number;
  name: string;
  shortCode: string;
  team: string;
  teamColor: string;
  country: string;
  flag: string;
  points: number;
  position: number;
  podiums: number;
  wins: number;
  poles: number;
  fastestLaps: number;
  worldTitles: number;
  carName: string;
  biography: string;
  qualifyingPace: number; // 0-100 scale for stat display
  raceCraft: number;
  tireManagement: number;
  wetWeatherSkill: number;
}

export interface Constructor {
  id: string;
  name: string;
  teamPrincipal: string;
  powerUnit: string;
  chassis: string;
  color: string;
  secondaryColor: string;
  points: number;
  position: number;
  wins: number;
  podiums: number;
  drivers: string[]; // driver codes
}

export interface TelemetryState {
  speed: number; // km/h
  rpm: number; // 0-15000
  gear: number; // 1-8
  throttle: number; // 0-100%
  brake: number; // 0-100%
  drs: 'DISABLED' | 'AVAILABLE' | 'ACTIVE';
  ersBattery: number; // 0-100%
  tireCompound: 'Soft' | 'Medium' | 'Hard' | 'Intermediate' | 'Wet';
  tireTemp: number; // Celsius (e.g. 102°C)
  tireWear: number; // % remaining (e.g. 82%)
  gForceX: number; // Lateral
  gForceY: number; // Longitudinal
  currentSector: 1 | 2 | 3;
  lapNumber: number;
  totalLaps: number;
  lapTimeMs: number;
  lastLapTime: string;
  bestLapTime: string;
  gapToLeader: string;
  isSimulating: boolean;
}

export interface StrategyScenario {
  id: string;
  name: string;
  circuitId: string;
  totalLaps: number;
  startTire: 'Soft' | 'Medium' | 'Hard';
  pitStopLaps: number[];
  tireStints: Array<{
    compound: 'Soft' | 'Medium' | 'Hard' | 'Intermediate' | 'Wet';
    laps: number;
    degradationPerLap: number;
  }>;
  safetyCarProbability: number; // %
  rainProbability: number; // %
}

export interface RadioQuote {
  id: string;
  driver: string;
  team: string;
  event: string;
  year: number;
  audioText: string;
  context: string;
  category: 'Aggressive' | 'Tactical' | 'Funny' | 'Iconic' | 'Radio Meltdown';
  synthesizedAudioParams?: {
    pitch: number;
    rate: number;
    voiceType: string;
  };
}

export interface AeroHotspot {
  id: string;
  title: string;
  category: 'Aerodynamics' | 'Power Unit' | 'Safety' | 'Suspension & Brakes';
  shortDesc: string;
  detailedExplanation: string;
  specs: { label: string; value: string }[];
  coordinates: { x: number; y: number }; // Percentage positioning on 2D car silhouette
}

export interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  funFact?: string;
}
