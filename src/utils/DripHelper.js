import ConfigHelper from './ConfigHelper'
import LocalStorageHelper from './LocalStorageHelper'
import Backend from './Backend'
import AuthManager from './AuthManager'
import BasketManager from './BasketManager'
import moment from 'moment'

export default class DripHelper {
  static async trackUser() {
    if (ConfigHelper.buildName() === global.Config.Restaurant) {
      return
    }
    return this._getSubscriberData().then(subscriber => {
      return DripHelper._trackSubscriber(subscriber)
    })
  }

  static async _trackSubscriber(subscriber) {
    let data = {
      subscribers: [{ ...subscriber }]
    }

    let postData = {
      ...data,
      endpoint: 'subscribers',
      version: 2
    }
    return Backend.track(postData)
  }

  static async trackUserLocation(location) {
    let customer = AuthManager.getCurrentUser()
    if (!customer) {
      throw { error: "Unauthenticated users won't tracked" }
    }

    if (!location || !location.address_line_1) {
      throw { error: 'User does not have any location' }
    }
    let subscriber = {
      email: customer.user.email,
      address1: location.address_line_1,
      address2: location.address_line_2 ? location.address_line_2 : undefined,
      city: location.city,
      state: location.state,
      zip: location.postal_code ? location.postal_code : undefined,
      country: location.country
    }

    return DripHelper._trackSubscriber(subscriber)
  }

  static async _getSubscriberData() {
    let customer = AuthManager.getCurrentUser()
    if (!customer) {
      throw { error: "Unauthenticated users won't tracked" }
    }
    let {
      first_name,
      last_name,
      email,
      phone_country_code,
      phone_number
    } = customer.user

    let phone = undefined
    if (phone_country_code && phone_number) {
      phone = phone_country_code + phone_number
    }

    var subscriber = {
      email,
      first_name,
      last_name,
      phone
    }

    return subscriber
  }

  static async trackBasket() {
    let customer = AuthManager.getCurrentUser()
    if (!customer) {
      throw { error: "Unauthenticated users won't tracked" }
    }

    let data = BasketManager.getTrackData()

    if (!data) {
      throw { error: "Empty cart won't be tracked" }
    }

    let postData = {
      ...data,
      endpoint: 'shopper_activity/cart'
    }

    return Backend.track(postData)
  }

  static trackOrder(order) {
    let data = this._getOrderTrackData(order)
    let postData = {
      ...data,
      endpoint: 'shopper_activity/order'
    }
    return Backend.track(postData)
  }

  static _getOrderTrackData(order) {
    let venue = order.venue
    let customer = AuthManager.getCurrentUser()
    let orderData = order.data

    let delivery_fee = orderData.delivery_fee ? orderData.delivery_fee : 0

    let total_fees =
      (order.payment.stripe_fee + order.payment.roadrunner_fee + delivery_fee) /
      100

    let orderTrackData = {
      provider: venue.title,
      email: customer.user.email,
      action: 'placed',
      occurred_at: moment().toISOString(),
      order_id: `${order.id}`,
      order_public_id: `${order.id}`,
      grand_total: order.total_price / 100,
      currency: order.currency.toUpperCase(),
      total_fees,
      order_url:
        'https://www.roadrunnershopping.com/customer/order-confirmation',
      items: BasketManager.getItemsTrackData(orderData.items)
    }

    let orderDataLocation = orderData.location
    if (orderDataLocation) {
      var phone = undefined
      let {
        first_name,
        last_name,
        phone_country_code,
        phone_number
      } = customer.user

      if (phone_country_code && phone_number) {
        phone = phone_country_code + phone_number
      }

      let address = {
        first_name,
        last_name,
        address_1: orderDataLocation.address_line_1,
        address_2: orderDataLocation.address_line_2
          ? orderDataLocation.address_line_2
          : undefined,
        city: orderDataLocation.city,
        state: orderDataLocation.state,
        postal_code: orderDataLocation.postal_code
          ? orderDataLocation.postal_code
          : undefined,
        country: orderDataLocation.country,
        phone
      }
      orderTrackData.shipping_address = address
      orderTrackData.billing_address = address
    }

    let coupon = orderData.coupon
    if (coupon) {
      var subTotal = BasketManager.calculateItemsPrice(orderData.items)
      let couponValue = BasketManager.getCouponValue(coupon, subTotal)
      orderTrackData.total_discounts = couponValue / 100
    }

    return orderTrackData
  }
}
