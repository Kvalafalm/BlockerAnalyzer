import { Moment } from "moment";

type BAdate = Moment | null

export const appActionTypes = {
  SET_DATA: "APP.SET_DATA",
  ADD_DATAJSON: "APP.ADD_DATAJSON",
  SET_TAGS: "APP.SET_TAGS",
  SET_PRIORITES: "APP.SET_PRIORITES",
  SET_STATUSES: "APP.SET_STATUSES",
  SET_TYPESTASK: "APP.TYPESTASK",
  SET_PROJECTS: "APP.SET_PROJECTS",
  CLEAN: "APP.CLEAN",
  SET_PAGE: "APP.SET_PAGE",
  PUSH_ERROR: "APP.PUSH_ERROR",
  CLEAR_ERRORS: "APP.CLEAR_ERRORS",
  CLEAR_DATAJSON: "APP.CLEAR_DATAJSON",
  SWITCH_FILTER: "APP.SWITCH_FILTER",
  SET_FILTER: "APP.SET_FILTER",
  SET_TIMELINEDATA: "APP.SET_TIMELINEDATA",
  CLEAR_FILTER: "APP.CLEAR_FILTER",
  SET_TIMELINEDATA_STATUSES: "APP.SET_TIMELINEDATA_STATUSES",
  SET_SPACES: "APP.SET_SPACES",
  SET_CURRENTSPACE: "APP.SET_CURRENTSPACE",
} as const

export interface Space {
  id: string,
  name: string,
}

export interface actionPayload {
  type: string;
  payload: any;
}

export interface iAppReducerState {
  dataJson: Array<dataJsonRow>;//remove to dataReduce
  dataPure: Array<any> | null;//remove to dataReduce
  tags: Array<string>;
  typesTask: Array<string>;
  page: string;
  errors: Array<string>;
  showFilter: boolean;
  filter: filter;
  priorites: Array<string>;
  projects: Array<string>;
  statuses: Array<string>;
  data: Array<dataRow>;//remove to dataReduce
  dataTimeline: Array<any>;//remove to dataReduce
  TimeLineStatuses: Array<any>//remove to dataReduce

  spaces: Array<Space>;
  currentSpaceId: string;
}

export interface dataRow {
  tags: Array<string>;
  id: string;
  idBloker: string;
  idIssue: string;
  reason: string;
  linkIssue: string;
  status: string;
  x: number;
  y: number;
  value: number;
  time: number;
  start: BAdate;
  end: BAdate;
  priority: string;
  project: string;
  typeIssue: string;
}

export interface dataJsonRow {
  tags: Array<string>;
  id: string;
  idBloker: string;
  value: number;
  time: number;
  start: BAdate;
  end: BAdate;
  priority: string;
  project: string;
  typeIssue: string;
  status: string;
}

export interface filter {
  priorites: Array<string>;
  start: BAdate;
  end: BAdate;
  statuses: Array<string>;
  projects: Array<string>;
  typesTask: Array<string>;
  tags: Array<string>;
}