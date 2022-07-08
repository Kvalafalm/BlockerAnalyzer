import { type } from "os";

export default class spacesView {
  static prepareArrayOfSpaces(incomingArray) {
    const newArray: Array<any> = [];
    for (const element of incomingArray) {
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

  constructor(data) {
    this.id = data._id;
    this.name = data.name;
  }

  exportForList(): any {
    const newObject = {
      id: '',
      name: '',
    }
    newObject.id = this.id;
    newObject.name = this.name;
    return newObject
  }
}
