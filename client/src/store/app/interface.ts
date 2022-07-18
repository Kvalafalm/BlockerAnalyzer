import { Moment } from "moment";

type BAdate = Moment | null

export const appActionTypes = {
  //SET_DATA: "APP.SET_DATA",
  //ADD_DATAJSON: "APP.ADD_DATAJSON",
  //SET_TAGS: "APP.SET_TAGS",
  //SET_PRIORITES: "APP.SET_PRIORITES",
  //SET_STATUSES: "APP.SET_STATUSES",
  //SET_TYPESTASK: "APP.TYPESTASK",
  //SET_PROJECTS: "APP.SET_PROJECTS",
  CLEAN: "APP.CLEAN",
  //SET_PAGE: "APP.SET_PAGE",
  PUSH_ERROR: "APP.PUSH_ERROR",
  CLEAR_ERRORS: "APP.CLEAR_ERRORS",
  //CLEAR_DATAJSON: "APP.CLEAR_DATAJSON",
  //SWITCH_FILTER: "APP.SWITCH_FILTER",
  //SET_FILTER: "APP.SET_FILTER",
  //SET_TIMELINEDATA: "APP.SET_TIMELINEDATA",
  //CLEAR_FILTER: "APP.CLEAR_FILTER",
  //SET_TIMELINEDATA_STATUSES: "APP.SET_TIMELINEDATA_STATUSES",
  SET_SPACES: "APP.SET_SPACES",
  SET_CURRENTSPACE: "APP.SET_CURRENTSPACE",
} as const

export interface IUpdateRequest {
  idboard: string,
  StartDate: string,
  EndDate: string,
  choiceByUpdateDate: boolean
}

export interface ISpace {
  id: string,
  name: string,
  externalId: string,
  lastRequest?: IUpdateRequest
  imported: boolean
}

export interface actionPayload {
  type: string;
  payload: any;
}

export interface iAppReducerState {
  page: string;
  errors: Array<string>;
  showFilter: boolean;
  spaces: Array<ISpace>;
  currentSpace?: Spacetype;
}

export type Spacetype = ISpace | undefined