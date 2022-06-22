export default class BlockerView {
  static prepareArrayOfBlockers(incomingArray) {
    const newArray = [];
    for (const array of incomingArray) {
      newArray.push(new Blocker(array));
    }
    return newArray;
  }
}

export class Blocker {
  constructor(data) {
    this.id = data.id;
    this.tags = { ...data.tags };
    this.idBloker = data.idBloker;
    this.idBoard = data.idBoard;
    this.idIssue = data.idIssue;
    this.start = data.start;
    this.end = data.end;
    this.time = data.time;
    this.priority = data.priority;
    this.project = data.project;
    this.typeIssue = data.typeIssue;
    this.reason = data.reason;
    this.linkIssue = data.linkIssue;
    this.decision = data.decision;
    this.status = data.status;
    this.comments = data.comments;
  }
}
