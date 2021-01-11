import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SectionList,
  Dimensions,
  Alert
} from 'react-native'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Button from '../../components/shared/Button'
import LoadingView from '../../components/shared/LoadingView'
import Hr from '../../components/shared/Hr'
import DeliverCollectSegmentedControl from '../../components/customer/DeliverCollectSegmentedControl'
import OrderHeader from '../../components/customer/OrderHeader'
import OrderDetailItem from '../../components/customer/OrderDetailItem'
import TextFieldModal from '../../components/shared/TextFieldModal'
import OrderScheduleModal from '../../components/customer/OrderScheduleModal'
import NoResults from '../../components/shared/NoResults'

import LocationModal from '../../components/shared/LocationModal'

import Backend from '../../utils/Backend'
import MockData from '../../utils/MockData'
import AuthManager from '../../utils/AuthManager'
import DateTime from '../../utils/DateTime'
import Notifications from '../../utils/Notifications'
import OpeningHour from "../../utils/OpeningHour"

import BasketManager from '../../utils/BasketManager'
import List from '../../utils/List'
import Clone from '../../utils/Clone'
import Price from '../../utils/Price'
import { ifIphoneX } from 'react-native-iphone-x-helper'

const PERCENTAGE = 'percentage'
const CURRENCY = 'currency'

export default class Basket extends Component {
  static navigatorStyle = global.Screens.TransparentNavBar

  constructor(props) {
    super(props)
    let basket = BasketManager.get()
    let venue = BasketManager.getVenue()
    let firstOpeningHour = venue.opening_hours[0]
    this.state = {
      isLoading: false,
      scheduleModalVisible: false,
      venue,
      currency: BasketManager.getCurrency(),
      isDeliverSelected: props.isDeliverSelected,
      selectedDate: OpeningHour.getDate(firstOpeningHour),
      basket,
      subTotal: null,
      reviewDisabled: true,
      showLocationModal: false
    }
  }

  componentDidMount() {
    this.props.navigator.setTitle({ title: this.state.venue.title })
    this._getDeliveryFee()
    this._setSubTotal()
  }

  _goTo() {
    let {
      venue,
      isDeliverSelected,
      currency,
      basket,
      selectedDate
    } = this.state
    if (AuthManager.isAuthenticated()) {
      this.props.navigator.push({
        screen: global.Screens.OrderPayment,
        passProps: {
          venue,
          isDeliverSelected,
          currency,
          selectedDate
        }
      })
    } else {
      this.props.navigator.showModal({
        screen: global.Screens.Login,
        passProps: {
          showCreateAccount: true,
          basket,
          onDismissed: () => this._onLoginPageDismissed()
        }
      })
    }
  }

  _onLoginPageDismissed() {
    Notifications.requestPermissionIfLoggedIn()
  }

  _updateUserLocation(location) {
    this.setState({canShowLocationAlert: true}, () => {
      AuthManager.setCurrentUserLocation(location)
      this._getDeliveryFee()
    })
  }

  _isValid() {
    let { isDeliverSelected, venue, subTotal } = this.state
    let isValid = true
    if (isDeliverSelected && subTotal < venue.minimum_order_amount) {
      alert('Minimum order value has not reached')
      isValid = false
    }
    return isValid
  }

  _onReviewButtonClicked() {
    if (!this._isValid()) {
      return
    }
    this._goTo()
  }

  _renderPrice(price) {
    let { currency } = this.state
    return Price.format(price, currency)
  }

  _saveAddress(){
    let hasShownLocationModal = this.state.canShowLocationAlert
    if(!hasShownLocationModal){
      return
    }
    Backend.saveAddress(AuthManager.getCurrentUserLocation())
      .then(response => {
        this.setState({ reviewDisabled: false })
      })
      .catch(error => {
        console.warn(error.message)
      })
  }

  _getDeliveryFee() {
    let { isDeliverSelected } = this.state
    if (!isDeliverSelected) {
      this.setState({ reviewDisabled: false })
      return
    }
    Backend.getDeliveryFee(this.state.venue)
      .then(response => {
        let venue = { ...this.state.venue }
        venue.delivery_fee = response.delivery_fee
        BasketManager.setVenue(venue)
        this._saveAddress()
        this.setState({ venue, reviewDisabled: false })
      })
      .catch(error => {
        this.setState({ showLocationModal: true })
        if(this.state.canShowLocationAlert){
            alert(error.message)
        }
      })
  }

  _setSubTotal() {
    let subTotal = BasketManager.calculateSubTotal()
    this.setState({ subTotal })
  }

  _getTotal() {
    let { venue, isDeliverSelected, subTotal } = this.state
    let deliverFee = isDeliverSelected ? venue.delivery_fee : 0
    let total = subTotal + deliverFee
    return this._renderPrice(total)
  }

  _checkIfBasketsEmpty() {
    let basket = BasketManager.get()
    if (basket.items.length > 0) {
      this._setSubTotal()
      return
    }
    this.props.navigator.pop()
  }

  _updateBasket(index, item, quantity) {
    BasketManager.updateItemQuantity(index, quantity)
    let basket = BasketManager.get()
    this.setState({ basket }, () => {
      if (quantity == 0) {
        this._checkIfBasketsEmpty()
      }
      this._setSubTotal()
    })
  }

  _orderReview() {
    let { basket } = this.state
    if (basket === null) {
      return null
    }
    if (basket.items.length <= 0) {
      return <NoResults style={{ margin: 20 }} title="No Items in basket" />
    }

    return basket.items.map((item, index) => {
      return (
        <View style={styles.orderItemContainer}>
          <OrderDetailItem
            canUpdate={true}
            item={item}
            currency={this.state.currency}
            onPriceChanged={(item, quantity) =>
              this._updateBasket(index, item, quantity)
            }
          />
        </View>
      )
    })
  }

  _renderMinimumOrder() {
    if (
      !this.state.isDeliverSelected ||
      this.state.venue.minimum_order_amount < this.state.subTotal
    ) {
      return null
    }
    return (
      <View style={[styles.row, { marginBottom: 5 }]}>
        <Text style={styles.delivery}>Min Delivery</Text>
        <Text style={styles.delivery}>
          {this._renderPrice(this.state.venue.minimum_order_amount)}
        </Text>
      </View>
    )
  }

  _renderDeliveryPrice() {
    if (!this.state.isDeliverSelected) {
      return null
    }
    return (
      <View style={[styles.row, { marginBottom: 10 }]}>
        <Text style={styles.totalText}>Delivery Fee</Text>
        <Text style={styles.totalText}>
          {this._renderPrice(this.state.venue.delivery_fee)}
        </Text>
      </View>
    )
  }

  _renderBottomContainer() {
    return (
      <View style={styles.bottomContainer}>
        <View style={[styles.row, { margin: 10 }]}>
          <Text style={styles.totalText}>Total Payment</Text>
          <Text style={styles.totalText}>{this._getTotal()}</Text>
        </View>
        <Button
          title="Review Payment"
          style={styles.button}
          isDisabled={this.state.reviewDisabled}
          onPress={() => this._onReviewButtonClicked()}
        />
      </View>
    )
  }

  _openScheduleModal() {
    this.setState({ scheduleModalVisible: true })
  }

  render() {
    let { item, isDeliverSelected, venue, selectedDate } = this.state
    return (
      <View style={styles.mainContainer}>
        <OrderHeader
          venue={venue}
          selectedDate={selectedDate}
          isDeliverSelected={isDeliverSelected}
          onPress={() => this._openScheduleModal()}
        />
        <KeyboardAwareScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.titleText}>Your Order</Text>
          {this._orderReview()}
          <View style={styles.subTotalContainer}>
            {this._renderMinimumOrder()}
            <Hr style={[styles.hr, { width: '100%' }]} />
            <View style={[styles.row, { marginBottom: 10 }]}>
              <Text style={styles.totalText}>Subtotal</Text>
              <Text style={styles.totalText}>
                {this._renderPrice(this.state.subTotal)}
              </Text>
            </View>
            {this._renderDeliveryPrice()}
          </View>
        </KeyboardAwareScrollView>
        {this._renderBottomContainer()}
        <OrderScheduleModal
          openingHours={this.state.basket.venue.opening_hours}
          visible={this.state.scheduleModalVisible}
          selectedDate={selectedDate}
          onModalClosed={() => this.setState({ scheduleModalVisible: false })}
          onSelectedDateUpdated={selectedDate =>
            this.setState({ selectedDate })
          }
        />
        <LocationModal
          visible={this.state.showLocationModal}
          doneDisabled={this.state.reviewDisabled}
          onModalClosed={() => this.setState({ showLocationModal: false })}
          onDonePressed={() => this.setState({ showLocationModal: false })}
          onLocationUpdated={location => this._updateUserLocation(location)}
        />
        <LoadingView isLoading={this.state.isLoading} size="small" />
      </View>
    )
  }
}

Basket.defaultProps = {
  isDeliverSelected: true,
  selectedDate: DateTime.getMinutesFromNow(5)
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: global.Colors.ScreenBackground
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5
  },
  scrollContainer: {
    padding: 10,
    paddingBottom: 110,
    justifyContent: 'space-between'
  },
  subTotalContainer: { justifyContent: 'flex-end' },
  titleText: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: '600',
    color: '#909090'
  },
  totalText: {
    fontSize: 18,
    fontWeight: '600'
  },
  delivery: {
    fontSize: 17,
    fontWeight: '400',
    color: global.Colors.Secondary
  },
  orderItemContainer: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 15
  },
  hr: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5
  },
  button: { marginLeft: 40, marginRight: 40 },
  voucherButton: { marginLeft: 5, marginRight: 5 },
  voucherTitle: { fontSize: 14, textAlign: 'left' },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: '#f7f7f7',

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
