export default class List {
  static indexOf(list, selectedItem, key = null) {
    if (key == null) {
      return list.findIndex(item => item === selectedItem)
    }
    return list.findIndex(item => item[key] == selectedItem[key])
  }

  static removeItem(list, selectedItem, key = null) {
    let index = List.indexOf(list, selectedItem, key)
    if (index == -1) {
      return
    }
    list.splice(index, 1)
  }
  static deepClone(object) {
    let clonedObject = JSON.parse(JSON.stringify(object))
    return clonedObject
  }

  static findItemByValue(list, value, key) {
    return list.findIndex(item => item[key] == value)
  }

  static getItemByValue(list, value, key) {
    let index = List.findItemByValue(list, value, key)
    return index > -1 ? list[index] : null
  }

  static contains(list, item, key = null) {
    let index = List.indexOf(list, item, key)
    return index > -1
  }

  static findAndReplace(list, item) {
    let index = List.indexOf(list, item, 'id')
    if (index < 0) {
      return list
    }
    list[index] = item
    return list
  }

  static findAndRemove(list, item) {
    let index = List.indexOf(list, item, 'id')
    if (index < 0) {
      return list
    }
    list.splice(index, 1)
    return list
  }

  static isNullOrEmpty(list) {
    if (!list) {
      return true
    }
    if (list.length == 0) {
      return true
    }

    return false
  }
}
