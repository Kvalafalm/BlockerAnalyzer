export default class spacesView {
  static prepareArrayOfSpaces(incomingArray) {
    const newArray = [];
    for (const element of incomingArray) {
      newArray.push(new Space(element));
    }
    return newArray;
  }
}

export class Space {
  constructor(data) {
    this.id = data._id;
    this.name =  data.name;
  }
}
