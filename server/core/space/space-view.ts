export default class spacesView {
  static prepareArrayOfSpaces(incomingArray) {
    const newArray: Array<any> = [];
    for (const element of incomingArray) {
      const newObject = new Space(element).exportForList()
      newArray.push(newObject);
    }
    return newArray;
  }
  static prepareArrayOfExtertnalSpaces(incomingArray) {
    const newArray: Array<any> = [];
    for (const element of incomingArray) {
      element.externalId = element.id
      element.id = undefined
      const newObject = new Space(element).exportForList()
      newArray.push(newObject);
    }
    return newArray;

  }
}

type statuses = {
  name: String,
  id: Number,
  typeOfStatus: Number,
}

export class Space {
  id: string;
  name: string;
  statuses?: Array<statuses>;
  externalId?: string;
  lastRequest?: any;

  constructor(data) {
    this.id = data._id;
    this.name = data.name;
    this.externalId = data.externalId;
    this.lastRequest = data.lastRequest
  }

  exportForList(): spaceList {
    const newObject: spaceList = {
      id: '',
      name: '',
    }
    newObject.id = this.id;
    newObject.externalId = this.externalId;
    newObject.name = this.name;
    newObject.lastRequest = this.lastRequest;
    return newObject
  }
}

type spaceList = {
  id: string;
  name: string;
  statuses?: Array<statuses>;
  externalId?: string;
  lastRequest?: any;
}