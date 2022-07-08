import { Moment } from "moment";

type BAdate = Moment | null

export const dataActionTypes = {
  SET_DATA: "DATA.SET_DATA",
  ADD_DATAJSON: "DATA.ADD_DATAJSON",
  SET_TAGS: "DATA.SET_TAGS",
  SET_PRIORITES: "DATA.SET_PRIORITES",
  SET_STATUSES: "DATA.SET_STATUSES",
  SET_TYPESTASK: "DATA.TYPESTASK",
  SET_PROJECTS: "DATA.SET_PROJECTS",
  CLEAN: "DATA.CLEAN",
  SET_PAGE: "DATA.SET_PAGE",
  PUSH_ERROR: "DATA.PUSH_ERROR",
  CLEAR_ERRORS: "DATA.CLEAR_ERRORS",
  CLEAR_DATAJSON: "DATA.CLEAR_DATAJSON",
  SWITCH_FILTER: "DATA.SWITCH_FILTER",
  SET_FILTER: "DATA.SET_FILTER",
  SET_TIMELINEDATA: "DATA.SET_TIMELINEDATA",
  CLEAR_FILTER: "DATA.CLEAR_FILTER",
  SET_TIMELINEDATA_STATUSES: "DATA.SET_TIMELINEDATA_STATUSES",
} as const

export interface actionPayload {
  type: string;
  payload: any;
}

export interface iDataReducerState {
  dataJson: Array<dataFiltredRow>;
  data: Array<dataRow>;
  tags: Array<string>;
  typesTask: Array<string>;
  filter: filter;
  priorites: Array<string>;
  projects: Array<string>;
  statuses: Array<string>;
  dataTimeline:Array<any>;
  TimeLineStatuses: Array<any>
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

export interface dataFiltredRow {
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