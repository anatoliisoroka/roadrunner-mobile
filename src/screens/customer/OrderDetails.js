import React, { Component } from 'react'
import { StyleSheet, Platform, View, Text } from 'react-native'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Feather from 'react-native-vector-icons/Feather'

import Hr from '../../components/shared/Hr'
import OrderDetailItem from '../../components/customer/OrderDetailItem'
import LoadingView from '../../components/shared/LoadingView'

import Price from '../../utils/Price'
import DateTime from '../../utils/DateTime'
import LocationFormat from '../../utils/LocationFormat'

import TextFormat from '../../utils/TextFormat'
import Backend from '../../utils/Backend'
import MockData from '../../utils/MockData'

import screenStyles from '../../assets/css/screens'

export default class OrderDetails extends Component {
  static navigatorStyle = global.Screens.PrimaryNavBar
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      order: null
    }

    this.props.navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this))
  }

  componentDidMount() {
    this.props.navigator.setTitle({ title: 'Order Details' })
    this._setOrder(this.props.order.id)
    this._setupCloseButton()
  }

  _setupCloseButton() {
    if (this.props.commandType === 'ShowModal') {
      Feather.getImageSource('x', 28).then(close => {
        this.props.navigator.setButtons({
          rightButtons: [
            {
              icon: close,
              id: 'close'
            }
          ],
          animated: true
        })
      })
    }
  }

  _onNavigatorEvent(event) {
    if (event.type == 'NavBarButtonPress') {
      if (event.id == 'close') {
        this._dismissModal()
      }
    }
    if (event.type == 'DeepLink') {
      const data = event.payload
      if (data.type == 'order' && data.order_id === this.state.order.id) {
        this._handleUpdateOrder(data)
      }
    }
  }

  _dismissModal() {
    this.props.navigator.dismissModal()
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

  _renderOrderTypeContainer() {
    let { order } = this.state
    let title = this._isCollection() ? 'Collection From:' : 'Delivered To:'
    let location = this._isCollection()
      ? order.data.venue_location
      : order.data.location

    return (
      <View style={styles.row}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemText}>
          {LocationFormat.fullAddress(location)}
        </Text>
      </View>
    )
  }

  _renderInstructions() {
    let { order } = this.state
    if (order.instructions == null) {
      return <Text style={styles.itemText}>No Instructions Provided</Text>
    }
    return <Text style={styles.itemText}>{order.instructions}</Text>
  }

  _renderCutlery() {
    let cutlery = 'No'
    let { order } = this.state
    if (order.cutlery == true) {
      cutlery = 'Yes'
    }
    return <Text style={styles.itemText}>{cutlery}</Text>
  }

  _renderHeader() {
    let { order } = this.state
    if (order === null) {
      return null
    }
    let readyAtTitle = this._isCollection()
      ? 'Collection Time'
      : 'Delivery Date'
    return (
      <View style={styles.headerContainer}>
        <View style={styles.row}>
          <Text style={styles.itemTitle}>Order Number:</Text>
          <Text style={styles.itemText}>{order.id}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.itemTitle}>Status</Text>
          <Text style={styles.itemText}>
            {TextFormat.capitalizeFirst(order.status)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.itemTitle}>{readyAtTitle}</Text>
          <Text style={styles.itemText}>
            {DateTime.DisplayDate(order.ready_at)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.itemTitle}>Ordered:</Text>
          <Text style={styles.itemText}>
            {DateTime.formatDateTime(order.created_at)}
          </Text>
        </View>
        {this._renderOrderTypeContainer()}
        <View style={styles.row}>
          <Text style={styles.itemTitle}>Cutlery:</Text>
          {this._renderCutlery()}
        </View>
        <View style={styles.row}>
          <Text style={styles.itemTitle}>Instructions:</Text>
          {this._renderInstructions()}
        </View>
      </View>
    )
  }

  _renderHr() {
    return (
      <View style={styles.hr}>
        <Hr color={global.Colors.Primary} style={{ width: '60%' }} />
      </View>
    )
  }

  _renderItems() {
    let { order } = this.state
    if (order === null) {
      return null
    }
    return order.data.items.map((item, index) => {
      return (
        <View>
          <OrderDetailItem item={item} currency={order.currency} />
        </View>
      )
    })
  }

  _renderOrderDetails() {
    return (
      <View>
        <Text style={styles.subtitle}>Ordered:</Text>
        {this._renderItems()}
      </View>
    )
  }

  _renderPrice(price) {
    let { currency } = this.state.order
    return Price.format(price, currency)
  }

  _renderPaymentMethod(order) {
    let { card } = order.data
    if (card == null) {
      return 'CASH'
    }
    return card.brand.toUpperCase() + ' *' + card.last_four
  }

  _renderCouponType(coupon) {
    if (coupon == null) {
      return null
    }
    if (coupon.type == 'percentage') {
      let value = coupon.value * 100
      return value + '% Off'
    }
    return this._renderPrice(coupon.value)
  }

  _renderCoupon() {
    let { coupon } = this.state.order.data
    if (coupon == null) {
      return null
    }
    return (
      <View style={styles.row}>
        <Text style={styles.itemTitle}>Coupon:</Text>
        <Text style={styles.price}>{this._renderCouponType(coupon)}</Text>
      </View>
    )
  }

  _renderDeliveryFee() {
    let { order } = this.state

    if (this._isCollection()) {
      return null
    }
    return (
      <View style={styles.row}>
        <Text style={styles.itemTitle}>Delivery Fee:</Text>
        <Text style={styles.price}>
          {this._renderPrice(order.data.delivery_fee)}
        </Text>
      </View>
    )
  }

  _isCollection() {
    let { order } = this.state
    let delivery = order.data.location == null
    return delivery
  }

  _renderFooter() {
    let { order } = this.state

    if (order === null) {
      return null
    }
    let totalPrice = order.total_price
    return (
      <View style={styles.footerContainer}>
        {this._renderDeliveryFee()}
        {this._renderCoupon()}
        <View style={styles.row}>
          <Text style={styles.itemTitle}>Total Payment:</Text>
          <Text style={styles.price}>{this._renderPrice(totalPrice)}</Text>
        </View>
        <View style={[styles.row, { marginTop: 20 }]}>
          <Text style={styles.itemTitle}>Paid with:</Text>
          <Text style={styles.payment}>{this._renderPaymentMethod(order)}</Text>
        </View>
      </View>
    )
  }

  _renderContent() {
    let { order } = this.state
    if (!order) {
      return null
    }

    return (
      <View>
        <Text style={styles.title}>
          {order.venue.title} - {order.data.venue_location.address_line_1}
        </Text>
        {this._renderHeader()}
        <View style={styles.container}>
          {this._renderHr()}
          {this._renderOrderDetails()}
          {this._renderFooter()}
        </View>
      </View>
    )
  }

  render() {
    let { isLoading } = this.state
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={screenStyles.mainPaddedContainer}
      >
        {this._renderContent()}
        <LoadingView isLoading={isLoading} size="small" />
      </KeyboardAwareScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerContainer: {
    marginTop: 20,
    paddingLeft: 10,
    paddingRight: 10
  },
  title: {
    fontWeight: '800',
    fontSize: 20,
    marginBottom: 2
  },
  subtitle: {
    color: '#909090',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center'
  },
  itemTitle: {
    marginBottom: 20,
    color: '#929292',
    width: 100
  },
  itemText: { flex: 1, flexWrap: 'wrap', marginBottom: 20, marginLeft: 20 },
  row: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  hr: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20
  },
  footerContainer: {
    marginTop: 30
  },
  price: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'right'
  },
  payment: {
    fontSize: 16,
    fontWeight: '500'
  }
})
