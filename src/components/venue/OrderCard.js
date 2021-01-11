import React, { Component } from 'react'
import {
  View,
  Image,
  TouchableWithoutFeedback,
  StyleSheet,
  Text
} from 'react-native'
import { Icon } from 'react-native-elements'

import OrderButton from '../../components/venue/OrderButton'

import moment from 'moment'

const DISPLAYED_ITEM_COUNT = 2
const LIMIT = 3

export default class OrderCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showOrderNumber: props.showOrderNumber,
      order: props.order,
      buttonType: '',
      orderItems: []
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps)
  }

  _renderOrderItems() {
    let { items } = this.state.order.data
    let count = 0
    return items.slice(0, LIMIT).map((item, index) => {
      count = count + 1
      if (count == LIMIT) {
        return (
          <Text style={styles.moreItemsText}>
            + {items.length - DISPLAYED_ITEM_COUNT} others
          </Text>
        )
      }
      return (
        <View style={[styles.row, { marginBottom: 5 }]}>
          <Text style={{ fontWeight: '600', fontSize: 15 }}>
            x{item.quantity}
          </Text>
          <Text style={styles.titleText}>{item.title}</Text>
        </View>
      )
    })
  }

  _getLastNameInitial(order) {
    let lastname = order.customer.user.last_name
    return lastname.charAt(0)
  }

  _renderOrderNumber(order) {
    if (this.state.showOrderNumber) {
      return <Text style={styles.orderNumber}># {order.id}</Text>
    }
  }

  _renderReadyTime(readyAt) {
    if (this.state.showOrderNumber) {
      return null
    }
    return moment().format('MMM Do YYYY')
  }

  _renderButton() {
    let { order } = this.state
    if (this.state.showOrderNumber) {
      return null
    }
    return (
      <OrderButton
        status={order.status}
        foodStatus={order.food_status}
        onOrderStatusUpdated={(status, foodStatus) =>
          this.props.onOrderStatusUpdated(status, foodStatus)
        }
      />
    )
  }

  _getChevronContainerStyle() {
    if (this.state.showOrderNumber) {
      return styles.chevronContainer
    }
    return styles.chevronCenterContainer
  }

  render() {
    let { order, orderItems } = this.state
    return (
      <TouchableWithoutFeedback onPress={this.props.onPress}>
        <View style={styles.mainContainer}>
          {this._renderOrderNumber(order)}
          <View style={styles.topContainer}>
            <View style={[styles.row, styles.wrap]}>
              <Text style={[styles.customerText, { marginRight: 8 }]}>
                {order.customer.user.first_name}{' '}
                {this._getLastNameInitial(order)}.
              </Text>

              <Text style={styles.customerText}>
                {order.customer.user.phone_country_code}
                {order.customer.user.phone_number}
              </Text>
            </View>
            <View>
              <Text style={styles.dateText}>
                {this._renderReadyTime(order.ready_at)}
              </Text>
            </View>
          </View>
          <View style={styles.orderContainer}>
            <View style={styles.order}>{this._renderOrderItems()}</View>
            <View style={this._getChevronContainerStyle()}>
              <Icon
                name="chevron-right"
                type="octicon"
                color={global.Colors.Primary}
                size={30}
              />
            </View>
          </View>
          <View style={styles.buttonContainer}>{this._renderButton()}</View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 5,
    shadowOpacity: 0.2,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    shadowRadius: 5,
    shadowColor: 'black',
    elevation: 1,
    shadowOffset: { height: 2, width: 0 },
    marginBottom: 20
  },
  dateText: { fontWeight: '700', fontSize: 15 },
  customerText: { color: '#909090', fontSize: 15 },
  moreItemsText: {
    marginLeft: 35,
    color: '#989898',
    fontWeight: '600',
    fontSize: 15
  },
  titleText: { marginLeft: 20, fontWeight: '600', fontSize: 15 },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingLeft: 5,
    paddingRight: 5
  },
  button: { marginTop: 10 },
  topContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  orderContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  chevronCenterContainer: {
    justifyContent: 'center',
    marginRight: 10
  },
  chevronContainer: {
    marginRight: 10
  },
  order: { flex: 1, justifyContent: 'center' },
  orderNumber: { fontSize: 15, fontWeight: '600', marginBottom: 5 },
  row: { flexDirection: 'row' },
  wrap: { flex: 1, flexWrap: 'wrap' }
})
