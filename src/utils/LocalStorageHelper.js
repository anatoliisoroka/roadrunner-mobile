import AsyncStorage from '@react-native-community/async-storage'

export default class LocalStorageHelper {
  static async save(key, value) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.log('Local storage helper saving error', error)
    }
  }

  static async retrieve(key, defaultValue = null) {
    return AsyncStorage.getItem(key).then(item => {
      if (item === null || item === undefined) {
        return defaultValue
      }
      let result = JSON.parse(item)
      let value = result === undefined ? defaultValue : result
      return value
    })
  }

  static getSkippedReviewOrderId() {
    return LocalStorageHelper.retrieve(
      global.StorageKeys.SkippedReviewOrderId,
      null
    )
      .then(orderId => {
        return orderId
      })
      .catch(error => {
        return null
      })
  }

  static setSkippedReviewOrderId(orderId) {
    return LocalStorageHelper.save(
      global.StorageKeys.SkippedReviewOrderId,
      orderId
    )
  }

  static hasLocationPermissionAsked() {
    return LocalStorageHelper.retrieve(
      global.StorageKeys.LocationPermissionAsked,
      false
    )
      .then(hasLocationPermissionAsked => {
        return hasLocationPermissionAsked
      })
      .catch(error => {
        return false
      })
  }

  static locationPermissionAsked() {
    return LocalStorageHelper.save(
      global.StorageKeys.LocationPermissionAsked,
      true
    )
  }
}
