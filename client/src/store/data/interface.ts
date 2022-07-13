import { Moment } from "moment";

type BAdate = Moment | null

export const dataActionTypes = {
  SET_DATA: "DATA.SET_DATA",
  SET_DATAFILTRED: "DATA.SET_DATAFILTRED",
  CLEAN: "DATA.CLEAN",
  CLEAR_DATAJSON: "DATA.CLEAR_DATAJSON",

  SET_TIMELINEDATA: "DATA.SET_TIMELINEDATA",
  SET_TIMELINEDATA_STATUSES: "DATA.SET_TIMELINEDATA_STATUSES",

  SET_TAGS: "DATA.SET_TAGS",
  SET_PRIORITES: "DATA.SET_PRIORITES",
  SET_STATUSES: "DATA.SET_STATUSES",
  SET_TYPESTASK: "DATA.SET_TYPESTASK",
  SET_PROJECTS: "DATA.SET_PROJECTS",
  
  SWITCH_FILTER: "DATA.SWITCH_FILTER",
  
  SET_FILTER: "DATA.SET_FILTER",
  CLEAR_FILTER: "DATA.CLEAR_FILTER",
  
} as const

export interface actionPayload {
  type: string;
  payload: any;
}

export interface iDataReducerState {
  //dataJson: Array<dataFiltredRow>;
  dataFiltred: Array<dataRow>;
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
  value: number;
  time: number;
  start: BAdate;
  end: BAdate;
  priority: string;
  project: string;
  typeIssue: string;
}

/* export interface dataFiltredRow {
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
} */

export interface filter {
  priorites: Array<string>;
  start: BAdate;
  end: BAdate;
  statuses: Array<string>;
  projects: Array<string>;
  typesTask: Array<string>;
  tags: Array<string>;
}