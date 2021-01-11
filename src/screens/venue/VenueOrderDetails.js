import React, { Component } from 'react'
import {
  StyleSheet,
  Platform,
  View,
  Text,
  TouchableOpacity
} from 'react-native'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Hr from '../../components/shared/Hr'

import Feather from 'react-native-vector-icons/Feather'

import LoadingView from '../../components/shared/LoadingView'
import OrderDetailItem from '../../components/customer/OrderDetailItem'
import Button from '../../components/shared/Button'
import OrderScheduleModal from '../../components/customer/OrderScheduleModal'

import TextFormat from '../../utils/TextFormat'
import Price from '../../utils/Price'
import DateTime from '../../utils/DateTime'
import LocationFormat from '../../utils/LocationFormat'

import Backend from '../../utils/Backend'
import MockData from '../../utils/MockData'

import screenStyles from '../../assets/css/screens'

type Props = {}
export default class VenueOrderDetails extends Component {
  static navigatorStyle = global.Screens.PrimaryNavBar
  constructor(props) {
    super(props)
    let order = { ...props.order }
    this.state = {
      canReject: props.canReject,
      order: null,
      isLoading: false,
      selectedDate: order.ready_at,
      scheduleModalVisible: false
    }

    this.props.navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this))
  }

  componentDidMount() {
    this.props.navigator.setTitle({ title: 'Order' })
    this._setOrder(this.props.order.id)
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
    this._setOrder(data.order_id, true)
  }

  _setOrder(id, hasOrderUpdated = false) {
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

  _renderRejectButton() {
    if (this.state.order.status !== 'pending') {
      return null
    }
    return (
      <Button
        title="Reject"
        style={styles.button}
        textStyle={styles.buttonText}
        onPress={() => this._onRejectOrderButtonPressed()}
      />
    )
  }

  _renderCancelledText() {
    let { status } = this.state.order
    if (status != 'cancelled') {
      return null
    }
    return (
      <Text style={styles.total}>
        Sorry, this order has been cancelled by user
      </Text>
    )
  }

  _onRejectOrderButtonPressed() {
    let { isLoading, order } = this.state
    if (isLoading) {
      return
    }
    this.setState({ isLoading: true })
    Backend.updateOrderStatus(order, 'rejected')
      .then(order => {
        this.setState({ isLoading: false, order }, () => {
          this.props.onOrderUpdated(order)
          this.props.navigator.pop()
        })
      })
      .catch(error => {
        this.setState({ isLoading: false })
        alert(error.message)

        alert.warn('error', error)
      })
  }

  _updateReadyAt() {
    let { isLoading, order, selectedDate } = this.state
    if (isLoading) {
      return
    }
    this.setState({ isLoading: true })
    Backend.updateOrderReadyAt(order, selectedDate)
      .then(order => {
        this.setState({ isLoading: false, order }, () => {
          this.props.onOrderUpdated(order)
        })
      })
      .catch(error => {
        this.setState({ isLoading: false })
        console.warn(error)
        alert(error.message)
      })
  }
  _renderOrderInfo() {
    let { order } = this.state
    if (order === null) {
      return null
    }
    return (
      <View style={styles.headerContainer}>
        <View style={styles.row}>
          <Text style={styles.itemTitle}>Order Number:</Text>
          <Text style={styles.itemText}>{order.id}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.itemTitle}>Date:</Text>
          <Text style={styles.itemText}>
            {DateTime.formatDateTime(order.created_at)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.itemTitle}>Contact:</Text>
          <Text style={styles.itemText}>
            {order.customer.user.phone_country_code}{' '}
            {order.customer.user.phone_number}
          </Text>
        </View>
        {this._renderInstructions(order)}
        {this._renderDeliveryAddress(order)}
      </View>
    )
  }

  _renderDeliveryAddress(order) {
    if (!order.data.location) {
      return null
    }
    return (
      <View style={styles.row}>
        <Text style={styles.itemTitle}>Delivered To:</Text>
        <Text style={styles.itemText}>
          {LocationFormat.fullAddress(order.data.location)}
        </Text>
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

  _renderOrderDetailsList() {
    let { order } = this.state
    if (order === null) {
      return null
    }
    return order.data.items.map((item, index) => {
      return (
        <View style={styles.orderItemContainer}>
          <OrderDetailItem item={item} currency={order.currency} />
        </View>
      )
    })
  }

  _renderOrder() {
    return <View>{this._renderOrderDetailsList()}</View>
  }

  _renderPrice(price) {
    let { currency } = this.state.order
    return Price.format(price, currency)
  }

  _renderPaymentType(order) {
    if (order.data.card == null) {
      return 'Cash'
    }
    return 'Card'
  }

  _renderInstructions(order) {
    if (order.instructions == null) {
      return null
    }
    return (
      <View style={styles.row}>
        <Text style={styles.itemTitle}>Instructions:</Text>
        <Text style={styles.itemText}>{order.instructions}</Text>
      </View>
    )
  }

  _renderDietaries(order) {
    return order.customer.dietaries.map(dietary => {
      return <Text style={styles.dietaryText}>{dietary.title}</Text>
    })
  }

  _renderDietariesContainer(order) {
    if (order.customer.dietaries.length <= 0) {
      return null
    }
    return (
      <View>
        <Text style={styles.paidText}>Dietaries</Text>
        {this._renderHr()}
        <View style={styles.dietaryContainer}>
          {this._renderDietaries(order)}
        </View>
      </View>
    )
  }

  _renderReadyAtView() {
    let { order, selectedDate } = this.state
    let title = order.data.location ? 'Delivery For:' : 'Collection For:'
    let formattedDate = DateTime.getDayTimeTitle(selectedDate)
    return (
      <View style={styles.row}>
        <Text style={styles.total}> {title} </Text>
        <TouchableOpacity onPress={() => this._onReadyAtPressed()}>
          <Text style={styles.total}>{formattedDate}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  _onReadyAtPressed() {
    let { order } = this.state
    // you can't change ready_at
    if (order.status != 'accepted' || order.food_status == 'finished') {
      return
    }
    this.setState({ scheduleModalVisible: true })
  }


  render() {
    let { order, scheduleModalVisible, selectedDate } = this.state
    if (order === null) {
      return null
    }

    let totalPrice = order.total_price
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={screenStyles.mainPaddedContainer}
      >
        {this._renderRejectButton()}
        {this._renderCancelledText()}
        {this._renderReadyAtView()}
        {this._renderOrder()}
        <View style={styles.row}>
          <Text style={styles.total}>Total:</Text>
          <Text style={styles.total}>{this._renderPrice(totalPrice)}</Text>
        </View>
        {this._renderDietariesContainer(order)}
        <Text style={styles.paidText}>
          Paid By {this._renderPaymentType(order)}
        </Text>
        {this._renderHr()}
        {this._renderOrderInfo()}

        <LoadingView isLoading={this.state.isLoading} size="small" />
        <OrderScheduleModal
          openingHours={order.opening_hours}
          visible={scheduleModalVisible}
          selectedDate={selectedDate}
          onModalClosed={() => this.setState({ scheduleModalVisible: false })}
          onSelectedDateUpdated={selectedDate =>
            this.setState({ selectedDate }, () => this._updateReadyAt())
          }
        />
      </KeyboardAwareScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  itemTitle: { marginBottom: 20, color: '#929292', width: 100 },
  itemText: { flex: 1, flexWrap: 'wrap', marginBottom: 20, marginLeft: 20 },
  row: {
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
  total: { marginBottom: 20, fontSize: 16, fontWeight: '600' },
  payment: {
    fontSize: 16,
    fontWeight: '500'
  },
  button: {
    backgroundColor: 'transparent',
    borderColor: 'red',
    borderWidth: 2,
    marginTop: 10,
    marginBottom: 30
  },
  buttonText: { color: 'red' },
  paidText: {
    textAlign: 'center',
    color: '#909090',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5
  },
  dietaryContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20
  },
  dietaryText: {
    paddingRight: 8,
    marginBottom: 5,
    fontSize: 16,
    fontWeight: '500'
  }
})
