var basket = null
import DateTime from './DateTime'
import moment from 'moment'
import General from './General'
import DripHelper from './DripHelper'
import AuthManager from './AuthManager'

const ACTION_CREATED = 'created'
const ACTION_UPDATED = 'updated'

const COUPON_TYPE_PERCENTAGE = 'percentage'
const COUPON_TYPE_CURRENCY = 'currency'
export default class BasketManager {
  static get() {
    if (!BasketManager.basket) {
      let basket = { ...this._getDefaultBasket() }
      BasketManager.set(basket)
    }

    return BasketManager.basket
  }

  static set(basket) {
    BasketManager.basket = basket
    DripHelper.trackBasket()
  }

  static _getDefaultBasket() {
    var defaultBasket = {
      id: General.uuid(),
      venue: { id: null },
      items: [],
      menuId: null,
      action: ACTION_CREATED,
      discountAmount: 0
    }
    return defaultBasket
  }

  static isEmpty() {
    let basket = BasketManager.basket
    return basket.items.length == 0
  }

  static setVenue(venue) {
    let basket = BasketManager.basket
    basket.venue = venue
    BasketManager.set(basket)
  }

  static setMenu(menu) {
    let basket = BasketManager.basket
    basket.menuId = menu.id
    BasketManager.set(basket)
  }

  static getVenue() {
    let basket = BasketManager.basket
    let venue = basket.venue
    return venue
  }

  static getCurrency() {
    let basket = BasketManager.basket
    let currency = basket.venue.currency
    return currency
  }

  static add(item) {
    let basket = BasketManager.get()
    basket.items.push(item)
    basket.action = ACTION_UPDATED
    BasketManager.set(basket)
    return basket
  }

  static remove(index) {
    BasketManager.basket.items.splice(index, 1)
    BasketManager.set(BasketManager.basket)
    return BasketManager.basket
  }

  static clear() {
    let basket = { ...this._getDefaultBasket() }
    BasketManager.set(basket)
  }

  static reset(venue, menu) {
    let basket = { ...this._getDefaultBasket() }
    basket.venue = venue
    basket.menuId = menu.id
    basket.items = []
    BasketManager.set(basket)
  }

  static updateItemQuantity(index, quantity) {
    let basket = { ...BasketManager.basket }
    if (quantity == 0) {
      basket = BasketManager.remove(index)
    } else {
      basket.items[index].quantity = quantity
    }
    basket.action = ACTION_UPDATED
    BasketManager.set(basket)
  }

  static calculateSubTotal(){
    let basket = BasketManager.basket

    if (basket == null) {
      return null
    }

    return BasketManager.calculateItemsPrice(basket.items)
  }

  static calculateItemsPrice(items) {
    var subtotal = 0
    items.forEach(item => {
      totalItemPrice = BasketManager._calculateSingleItemTotalPrice(item)
      subtotal += totalItemPrice
    })
    return subtotal
  }

  static _calculateSingleItemTotalPrice(item) {
    itemPrice = item.price
    itemQuantity = item.quantity
    let optionsTotalPrice = 0
    item.option_groups.forEach(option_group => {
      option_group.options.forEach(option => {
        if (option.price != null) {
          optionsTotalPrice += option.price * option.quantity
        }
      })
    })
    let totalItemPrice = (itemPrice + optionsTotalPrice) * itemQuantity
    return totalItemPrice
  }

  static getTotalPrice(isDeliverSelected, coupon) {
    let basket = BasketManager.get()
    let subTotal = BasketManager.calculateSubTotal()
    let venue = BasketManager.getVenue()
    let couponValue = BasketManager.getCouponValue(coupon, subTotal)

    let deliveryFee = isDeliverSelected ? venue.delivery_fee : 0
    let total = subTotal + deliveryFee - couponValue

    // this is for tracking
    if (basket.discountAmount != couponValue) {
      basket.discountAmount = couponValue
      BasketManager.set(basket)
    }

    let roundedTotal = Math.round(total)
    return roundedTotal
  }

  static getCouponValue(coupon, subTotal) {
    let subTotalValue = subTotal ?? BasketManager.calculateSubTotal()
    let couponType = coupon ? coupon.type : null
    let couponValue = 0

    switch (couponType) {
      case COUPON_TYPE_CURRENCY:
        couponValue = coupon.value
        break
      case COUPON_TYPE_PERCENTAGE:
        couponValue = coupon.value * subTotalValue
        break
    }

    return couponValue
  }

  static createOrder(
    selectedDate,
    paymentType,
    delivery,
    cutlery,
    instructions,
    deliveryLocation,
    cardId,
    coupon
  ) {
    let basket = BasketManager.get()
    let readyAt = selectedDate ?? DateTime.getMinutesFromNow(5)
    let venue = basket.venue
    let totalPrice = BasketManager.getTotalPrice(delivery, coupon)
    let order = {
      venue: venue.id,
      menu: basket.menuId,
      expected_price: totalPrice,
      ready_at: readyAt.toISOString(),
      payment_type: paymentType,
      delivery,
      cutlery,
      items: basket.items
    }

    if (instructions != null) {
      order['instructions'] = instructions
    }
    if (deliveryLocation != null) {
      order['location'] = deliveryLocation
    }
    if (cardId != null) {
      order['card'] = cardId
    }
    if (coupon != null) {
      order['coupon'] = coupon.id
    }
    return order
  }

  static getTrackData() {
    let currentUser = AuthManager.getCurrentUser()
    let basket = BasketManager.get()
    let venue = basket.venue

    if(!venue.id){
      return null
    }

    let trackData = {
      provider: venue.title,
      email: currentUser.user.email,
      action: basket.action,
      cart_id: basket.id,
      occurred_at: moment().toISOString(),
      grand_total: BasketManager.calculateSubTotal()/100,
      total_discounts: basket.discountAmount,
      currency: venue.currency.toUpperCase(),
      cart_url: 'https://shop.roadrunnershopping.com/customer/basket',
      items: []
    }

    trackData.items = BasketManager.getItemsTrackData(basket.items)
    return trackData
  }

  static getItemsTrackData(items){
    let itemsTrackData = items.map(item => {
      return {
        product_id: `${item.id}`,
        product_variant_id: `${item.id}`,
        name: item.title,
        price: BasketManager._calculateSingleItemTotalPrice(item)/100,
        quantity: item.quantity,
        image_url: item.image ? item.image.original : undefined
      }
    })

    return itemsTrackData
  }
}
