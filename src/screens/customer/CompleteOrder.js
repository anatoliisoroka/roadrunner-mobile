import React, { Component } from 'react'
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  Alert
} from 'react-native'

import BasketManager from '../../utils/BasketManager'
import Price from '../../utils/Price'
import Backend from '../../utils/Backend'
import AuthManager from '../../utils/AuthManager'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { CreditCardInput } from 'rn-credit-card-view'
import Button from '../../components/shared/Button'
import LoadingView from '../../components/shared/LoadingView'
import OrderDetailItem from '../../components/customer/OrderDetailItem'
import { ifIphoneX } from 'react-native-iphone-x-helper'

import screenStyles from '../../assets/css/screens'

const COUPON_TYPE_PERCENTAGE = 'percentage'
const COUPON_TYPE_CURRENCY = 'currency'

const GIF_SUCCESS = require('../../assets/gifs/success.gif')
const IMAGE_REJECTED = require('../../assets/images/reject.png')

export default class CompleteOrder extends Component {
  static navigatorStyle = global.Screens.NoNavBar
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      isDeliverSelected: props.isDeliverSelected,
      order: props.order,
      subTotal: 0,
      amountReduced: 0,
      customer: AuthManager.getCurrentUser()
    }
    this.props.navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this))
  }

  _onNavigatorEvent(event) {
    if (event.type == 'DeepLink') {
      const data = event.payload

      if (data.type == 'order' && data.order_id === this.state.order.id) {
        this._handleUpdateOrder(data)
      }
    }
  }

  _handleUpdateOrder(data) {
    this._setOrder(data.order_id)
  }

  _setOrder(id) {
    let { isLoading } = this.state
    if (isLoading) {
      return
    }
    this.setState({ isLoading: true })
    Backend.getOrder(id)
      .then(order => {
        this.setState({
          order,
          isLoading: false
        })
      })
      .catch(error => {
        console.log('ERROR', error)
        this.setState({ isLoading: false })
      })
  }

  componentDidMount() {
    console.log('BASKET', BasketManager.get())
    console.log('order====', this.props.order)
    this._setSubTotal()
  }

  _setSubTotal() {
    let { order } = this.state
    var subTotal = 0
    order.data.items.forEach(item => {
      var extraCharge = 0
      itemPrice = item.price
      itemQuantity = item.quantity
      item.option_groups.forEach(option_group => {
        option_group.options.forEach(option => {
          if (option.price != null) {
            extraCharge += option.price * option.quantity
          }
        })
      })
      let totalItemPrice = (itemPrice + extraCharge) * itemQuantity
      subTotal += totalItemPrice
    })
    console.log('__subtotal', subTotal)
    this.setState({ subTotal }, () => {
      this._setAmountReduced()
    })
  }

  _setAmountReduced() {
    let { order, subTotal } = this.state
    let coupon = order.data.coupon
    if (!coupon) {
      return
    }
    let amountReduced = BasketManager.getCouponValue(coupon, subTotal)
    this.setState({ amountReduced })
  }

  _goTo(screen) {
    this.props.navigator.resetTo({
      screen
    })
  }

  _showCancelOrderAlert() {
    console.log('ORDER', this.state.order)
    Alert.alert('Cancel Order', 'Are you sure you want to cancel this order?', [
      { text: 'Yes', onPress: () => this._cancelOrder() },
      {
        text: 'No',
        style: 'cancel'
      }
    ])
  }

  _cancelOrder() {
    let { isLoading } = this.state
    if (isLoading) {
      return
    }

    this.setState({ isLoading: true })
    Backend.cancelOrder(this.state.order)
      .then(response => {
        this.setState({ isLoading: false })
        Alert.alert('Order Cancelled', 'Payment will be refunded soon.', [
          {
            text: 'Ok',
            onPress: () => this._goTo(global.Screens.Menu)
          }
        ])
      })
      .catch(error => {
        Alert.alert('Cancellation Failed', error.message)
        this.setState({ isLoading: false })
        console.warn(error.message)
      })
  }

  _renderPrice(price) {
    let { currency } = this.state.order
    return Price.format(price, currency)
  }

  _getUserInfo() {
    let { user } = this.state.customer

    let userInfo = user.first_name + ' ' + user.last_name

    if (user.phone_country_code && user.phone_number) {
      userInfo += '\n' + user.phone_country_code + user.phone_number
    }
    return userInfo
  }

  _getAddress() {
    let { order } = this.state
    let location = order.data.location
    return location != null ? location.address_line_1 : null
  }

  _renderArrivalView() {
    let { order, isDeliverSelected } = this.state

    let title = isDeliverSelected ? 'Delivery to' : 'Collection for'
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.titleText}>{title}</Text>
        </View>
        <View style={styles.contactContainer}>
          {this._renderUserAddress()}
          <Text style={[styles.contactText, { lineHeight: 25 }]}>
            {this._getUserInfo()}
          </Text>
          {this._renderInstructionsView()}
        </View>
      </View>
    )
  }

  _renderUserAddress() {
    let { isDeliverSelected } = this.state
    if (!isDeliverSelected) {
      return null
    }

    let address = this._getAddress()
    let titleStyle = address == null ? styles.errorText : styles.contactText
    return <Text style={titleStyle}>{this._getAddress()}</Text>
  }

  _renderInstructionsView() {
    let { instructions } = this.state.order
    let textStyle = instructions ? styles.contactText : styles.inactiveText
    let text = instructions != null ? instructions : 'No Instructions Provided'
    return <Text style={textStyle}>{text}</Text>
  }

  _renderOrderItems() {
    let { order } = this.state

    return order.data.items.map((item, index) => {
      return <OrderDetailItem item={item} currency={order.currency} />
    })
  }

  _renderOrderView() {
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.titleText}>Your Order</Text>
        </View>

        <View style={[styles.contactContainer, { marginRight: 10 }]}>
          {this._renderOrderItems()}
        </View>
      </View>
    )
  }

  _renderPaymentView() {
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.titleText}>Payment</Text>
        </View>
        <View style={styles.contactContainer}>
          <Text style={styles.contactText}>Visa</Text>
          <Text style={[styles.cardText, { marginTop: 10 }]}>
            **** **** **** 3530
          </Text>
        </View>
      </View>
    )
  }

  _renderDeliveryFee() {
    let { isDeliverSelected, order } = this.state
    console.log('order', order)
    if (!isDeliverSelected) {
      return null
    }
    return (
      <View style={styles.itemContainer}>
        <View style={styles.row}>
          <Text style={styles.contactText}>Delivery Fee</Text>
          <Text style={styles.contactText}>
            {this._renderPrice(order.data.delivery_fee)}
          </Text>
        </View>
      </View>
    )
  }

  _renderTotalFee() {
    let { total_price } = this.state.order
    return (
      <View style={styles.itemContainer}>
        <View style={styles.row}>
          <Text style={styles.totalText}>Total Payment</Text>
          <Text style={styles.totalText}>{this._renderPrice(total_price)}</Text>
        </View>
      </View>
    )
  }

  _openScheduleModal() {
    this.setState({ scheduleModalVisible: true })
  }

  _getPriceColor(price) {
    if (price === 0 || price === null) {
      return '#C8C8C8'
    }
    return 'black'
  }

  _renderItem(title, price) {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.row}>
          <Text
            style={[styles.contactText, { color: this._getPriceColor(price) }]}
          >
            {title}
          </Text>
          <Text
            style={[styles.contactText, { color: this._getPriceColor(price) }]}
          >
            {this._renderPrice(price)}
          </Text>
        </View>
      </View>
    )
  }

  _renderCancelButton() {
    let { order } = this.state
    if (order.status == 'pending') {
      return (
        <Button
          type="secondary"
          title="Cancel Order"
          onPress={() => this._showCancelOrderAlert()}
        />
      )
    }
    return null
  }

  _renderStatusImage() {
    let { order } = this.state
    let source = order.status == 'rejected' ? IMAGE_REJECTED : GIF_SUCCESS

    return <Image source={source} style={styles.gif} />
  }

  render() {
    let { order, subTotal, amountReduced } = this.state
    let status = order.status == 'rejected' ? ' has been rejected' : ''
    let title = 'Your order from ' + order.venue.title + status

    return (
      <View style={styles.mainContainer}>
        <KeyboardAwareScrollView contentContainerStyle={styles.scrollContainer}>
          <View
            style={{ marginTop: 20, paddingBottom: 20, alignItems: 'center' }}
          >
            {this._renderStatusImage()}
            {this._renderCancelButton()}
            <Text style={styles.arrivalText}>{title}</Text>
          </View>
          {this._renderArrivalView()}
          {this._renderOrderView()}
          {this._renderItem('Subtotal', subTotal)}
          {this._renderDeliveryFee()}
          {this._renderItem('Voucher Code', amountReduced)}
          {this._renderTotalFee()}
        </KeyboardAwareScrollView>
        <View style={styles.bottomContainer}>
          <Button
            title="Finish"
            style={styles.button}
            onPress={() => this._goTo(global.Screens.Menu)}
          />
        </View>
        <LoadingView isLoading={this.state.isLoading} />
      </View>
    )
  }
}
const text = {
  fontSize: 16,
  fontWeight: '600'
}
const contactText = { marginTop: 5, fontSize: 16, fontWeight: '700' }
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: global.Colors.ScreenBackground,
    paddingBottom: 70
  },
  container: { marginBottom: 10, marginLeft: 10 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  arrivalText: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    padding: 20
  },
  scrollContainer: {
    padding: 10
  },
  titleText: {
    marginTop: 15,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: '600',
    color: '#909090'
  },
  totalText: {
    marginTop: 12,
    fontSize: 19,
    fontWeight: '500'
  },
  button: { marginLeft: 40, marginRight: 40, marginTop: 5, marginBottom: 20 },
  contactText,
  inactiveText: { ...contactText, color: '#C8C8C8' },
  contactContainer: { marginLeft: 40, marginTop: 10 },
  cardText: { ...text, color: '#909090', marginRight: 8 },
  itemContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 8,
    marginLeft: 10,
    marginRight: 10
  },
  gif: {
    width: 250,
    height: 160,
    backgroundColor: 'white',
    resizeMode: 'contain'
  },
  bottomContainer: {
    position: 'absolute',
    backgroundColor: global.Colors.ScreenBackground,
    bottom: 0,
    left: 0,
    width: '100%',

    ...ifIphoneX(
      {
        paddingBottom: 20
      },
      {
        paddingBottom: 10
      }
    ),
    justifyContent: 'center'
  }
})
