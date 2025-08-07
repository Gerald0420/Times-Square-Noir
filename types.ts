
export enum GameStatus {
  NotStarted,
  Loading,
  InProgress,
  Error,
}

export interface GameState {
  status: GameStatus;
  characterBio: string;
  sceneDescription: string;
  sceneImageUrl: string;
  choices: string[];
  history: string[];
  error: string | null;
}

export interface InitialSceneResponse {
    characterBio: string;
    sceneDescription: string;
    choices: string[];
}

export interface NextSceneResponse {
    sceneDescription: string;
    choices: string[];
}
