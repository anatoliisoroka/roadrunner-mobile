export default class Clone {
  static deepClone(object) {
    let clonedObject = JSON.parse(JSON.stringify(object))
    return clonedObject
  }
}
