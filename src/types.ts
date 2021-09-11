export type KeyWordInfo = {
  symbol: string | undefined;
  index: number;
  target: number | string;
}

export type RunningFields = {
  time: number | undefined;
  distance: number | undefined;
}

export type TCFields = {
  label: String;
  type: String;
}

export type TableInput = {
  name: string;
  fields: TCFields[];
}

export type Transcription = {
  table: string;
  dateTime: string;
  payload: any;
}