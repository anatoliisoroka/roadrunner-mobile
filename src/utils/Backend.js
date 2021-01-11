import FetchHelper from './FetchHelper'
import AuthManager from './AuthManager'
import LocalStorageHelper from './LocalStorageHelper'
import ConfigHelper from './ConfigHelper'
import DataCollection from './DataCollection'
import { Platform } from 'react-native'

import MockData from './MockData'

export default class Backend {
  static cancelOrder(order) {
    let data = {
      status: 'cancelled'
    }
    DataCollection.track(global.Event.ORDER_CANCELLED, order)
    return FetchHelper.patch(global.Api.Orders + '/' + order.id, data)
  }

  static getOrderPendingReview() {
    return FetchHelper.get(
      global.Api.Orders + '?page_size=1&food_status=finished'
    ).then(response => {
      var pendingOrders = response.results
      if (pendingOrders.length == 0) {
        return null
      }
      var pendingOrder = pendingOrders[0]

      if (pendingOrder.review) {
        return null
      }

      return LocalStorageHelper.getSkippedReviewOrderId().then(
        skippedReviewOrderId => {
          if (!skippedReviewOrderId) {
            return pendingOrder
          }

          return pendingOrder.id == skippedReviewOrderId ? null : pendingOrder
        }
      )
    })
  }

  static deleteAddress(address) {
    return FetchHelper.delete(global.Api.Locations + '/' + address.id)
  }

  static deletePaymentMethod(card) {
    return new Promise((resolve, reject) => {
      resolve(card)
    })
  }

  static filterVenues(params) {
    let filters = ''
    for (key in params) {
      let filter = key + '=' + params[key] + '&'
      filters += filter
    }
    // Remove the last character &
    filters = filters.slice(0, -1)
    return FetchHelper.get(global.Api.Venues + '?' + filters)
  }

  static getCategories() {
    return new Promise((resolve, reject) => {
      resolve(MockData.CATEGORIES)
    })
  }

  static getCustomerLocations() {
    return new Promise((resolve, reject) => {
      resolve(MockData.LOCATIONS)
    })
  }

  static getTopVenuesEndpoint() {
    let endpoint = `${global.Api.Venues}?order_by=average_rating&order_direction=desc&has_menu=true&open_now=true`
    return endpoint
  }

  static getDietaries() {
    return FetchHelper.get(global.Api.Dietaries)
  }

  static getUserDietaries() {
    let endpoint = `${global.Api.Dietaries}?selected=true`
    return FetchHelper.get(endpoint)
  }

  static getFilters() {
    return FetchHelper.get(global.Api.Filters)
  }

  static getIncomeStatistics() {
    return new Promise((resolve, reject) => {
      resolve(MockData.STATS)
    })
  }

  static getMenu(menus) {
    let menuId = menus[0]
    DataCollection.track(global.Event.MENU_VIEWED, {
      menuId
    })
    return FetchHelper.get(global.Api.Menu + '/' + menuId)
  }

  static getOrderDetails(order) {
    return FetchHelper.get(global.Api.Orders + '/' + order.id)
  }

  static getOrder(id) {
    return FetchHelper.get(global.Api.Orders + '/' + id)
  }

  static getVenueLocations(currentUserLocation) {
    return FetchHelper.get(
      global.Api.Venues +
        '?type=map&latitude=' +
        currentUserLocation.latitude +
        '&longitude=' +
        currentUserLocation.longitude +
        '&has_menu=true'
    )
  }

  static getVenue() {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }

  static getVenues() {
    return new Promise((resolve, reject) => {
      resolve(MockData.GET_VENUES)
    })
  }

  static getVenueDetails(venue) {
    return FetchHelper.get(global.Api.Venues + '/' + venue.id)
  }

  static getVenueDetailsById(id) {
    return FetchHelper.get(global.Api.Venues + '/' + id)
  }

  static getVenueOrders(bottomIndex, topIndex) {
    let params = ''
    if (bottomIndex == 0) {
      params = '?status=pending&food_status=pending'
    }
    if (bottomIndex == 1) {
      if (topIndex == 0) {
        params = '?status=accepted&food_status=pending'
      } else {
        params = '?status=accepted&food_status=preparing'
      }
    }
    if (bottomIndex == 2) {
      params = '?status=accepted&food_status=finished'
    }
    return FetchHelper.get(global.Api.Orders + params)
  }

  static saveCard(token) {
    let data = {
      source: token.tokenId,
      is_default: false
    }
    return FetchHelper.post(global.Api.Cards, data)
  }

  static setDefaultPaymentMethod(card) {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }

  static saveAddress(address) {
    if (address.city == null) {
      address.city = address.state
    }
    return FetchHelper.post(global.Api.Locations, address)
  }

  static sendOrder(order) {
    DataCollection.track(global.Event.ORDER_CREATED, order)
    return FetchHelper.post(global.Api.Orders, order)
  }

  static submitFeedback(data) {
    return FetchHelper.post(global.Api.Feedback, data)
  }

  static submitReview(reviewData) {
    return FetchHelper.post(global.Api.Reviews, reviewData)
  }

  static skipReview(order) {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }

  static updateOrderStatus(order, status, foodStatus) {
    let data = {}
    if (status) {
      data.status = status
    }
    if (foodStatus && foodStatus != 'pending') {
      data.food_status = foodStatus
    }

    return FetchHelper.patch(global.Api.Orders + '/' + order.id, data)
  }

  static updateCard(card) {
    let data = {
      is_default: true
    }
    return FetchHelper.patch(global.Api.Cards + '/' + card.id, data)
  }

  static updateUserDetails(userData) {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }

  static updateDietaries(dietaries) {
    let data = {
      dietaries
    }
    return FetchHelper.patch(global.Api.Dietaries, data)
  }

  static validateCoupon(code, venue) {
    let endpoint = `${global.Api.Coupons}?code=${code}&venue=${venue.id}&status='running'`
    return FetchHelper.get(endpoint).then(response => {
      return response.results
    })
  }

  static updateCustomer(customer) {
    let endpoint = `${global.Api.Customers}/${customer.user.id}`
    return FetchHelper.patch(endpoint, customer)
  }

  static updateCompanyMember(comapanyMember) {
    let endpoint = `${global.Api.CompanyMembers}/${comapanyMember.user.id}`
    return FetchHelper.patch(endpoint, comapanyMember)
  }

  static getVenueStats(venue, timePeriod, currency) {
    let endpoint = `${global.Api.Earnings}?time_period=${timePeriod}`
    if (venue) {
      endpoint += `&venue=${venue.id}`
    } else if (currency) {
      endpoint += `&currency=${currency}`
    }

    return FetchHelper.get(endpoint)
  }

  static updateOrderReadyAt(order, ready_at) {
    let data = { ready_at }
    return FetchHelper.patch(global.Api.Orders + '/' + order.id, data)
  }

  static getFacebookCode(accessToken, redirectUri) {
    let url = `${global.Api.FacebookCode}?access_token=${accessToken}&redirect_uri=${redirectUri}`
    return FetchHelper.get(url)
  }

  static getDeliveryFee(venue, location) {
    let user = AuthManager.currentUser
    let currentLocation = AuthManager.getCurrentUserLocation()
    let lastLocation = null
    let longitude = null
    let latitude = null
    if (user != null && user.last_order_location != null) {
      lastLocation = user.last_order_location
    } else {
      longitude = currentLocation.longitude
      latitude = currentLocation.latitude
    }
    let params = ''
    if (location == null && lastLocation != null) {
      params = '&location=' + lastLocation.id
    } else if (location != null) {
      params = '&location=' + location.id
    } else {
      params = '&longitude=' + longitude + '&latitude=' + latitude
    }
    return FetchHelper.get(
      global.Api.DeliveryFee + '?venue=' + venue.id + params
    )
  }

  static sendToken(token) {
    let data = {
      registration_id: token
    }
    let endpoint =
      Platform.OS == 'ios'
        ? global.Api.DeviceTokenAPNS
        : global.Api.DeviceTokenFCM

    console.log('sendToken', token, endpoint)
    if (Platform.OS == 'android') {
      data['cloud_message_type'] = 'FCM'
      data['application_id'] = 'android'
    } else {
      let base = 'ios_'

      if (ConfigHelper.buildName() === global.Config.Restaurant) {
        base += 'venue'
      } else {
        base += 'customer'
      }

      data['application_id'] = base
    }

    FetchHelper.post(endpoint, data).catch(error => {
      // trying to register same token will throw an error which is ok
      console.log('EE', error)
    })
  }

  static async removeToken() {
    if (!global.Api.DeviceToken) {
      return true
    }

    let endpoint =
      Platform.OS == 'ios'
        ? global.Api.DeviceTokenAPNS
        : global.Api.DeviceTokenFCM
    endpoint += '/' + global.Api.DeviceToken

    return FetchHelper.delete(endpoint)
  }

  static requestPhoneVerification() {
    return FetchHelper.post(global.Api.RequestPhoneVerification)
  }

  static verifyPhone(code) {
    return FetchHelper.post(global.Api.VerifyPhone, { code })
  }

  static track(data) {
    return FetchHelper.post(global.Api.Track, data)
  }
}
