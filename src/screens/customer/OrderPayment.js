import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SectionList,
  Dimensions
} from 'react-native'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Icon } from 'react-native-elements'

import Button from '../../components/shared/Button'
import LoadingView from '../../components/shared/LoadingView'
import Hr from '../../components/shared/Hr'
import SegmentedControl from '../../components/shared/SegmentedControl'
import OrderHeader from '../../components/customer/OrderHeader'
import OrderDetailItem from '../../components/customer/OrderDetailItem'

import AddCardModal from '../../components/customer/AddCardModal'
import TextFieldModal from '../../components/shared/TextFieldModal'
import OrderScheduleModal from '../../components/customer/OrderScheduleModal'
import PaymentModal from '../../components/customer/PaymentModal'
import String from '../../utils/String'

import BasketManager from '../../utils/BasketManager'
import Backend from '../../utils/Backend'
import MockData from '../../utils/MockData'
import AuthManager from '../../utils/AuthManager'
import Clone from '../../utils/Clone'
import DripHelper from "../../utils/DripHelper"

import Price from '../../utils/Price'
import moment from 'moment'
import { ifIphoneX } from 'react-native-iphone-x-helper'

// React-native-modal takes 300 milliseconds to open the next modal screen
const MODAL_CLOSE_TIME = 500

const COUPON_TYPE_PERCENTAGE = 'percentage'
const COUPON_TYPE_CURRENCY = 'currency'
const PAYMENT_TYPE_CARD = 'card'
const PAYMENT_TYPE_CASH = 'cash'

type Props = {}
export default class OrderPayment extends Component {
  static navigatorStyle = global.Screens.TransparentNavBar

  constructor(props) {
    super(props)

    let customer = AuthManager.getCurrentUser()

    this.state = {
      isLoading: false,
      addCardModalVisible: false,
      scheduleModalVisible: false,
      instructionsModalVisible: false,
      voucherModalVisible: false,
      paymentModalVisible: false,
      order: { ...props.order },
      coupon: null,
      venue: props.venue,
      currency: props.currency,
      isDeliverSelected: props.isDeliverSelected,
      selectedDate: props.selectedDate,
      cutlery: false,
      showCouponError: false,
      couponErrorMessage: 'Voucher code is invalid',
      selectedCard: null,
      paymentType: null,
      selectedAddress: null,
      customer,
      instructions: null,
      confirmDisabled: false
    }
  }

  componentDidMount() {
    this.props.navigator.setTitle({ title: this.state.venue.title })
    this._setDeliveryLocation()
  }

  _setDeliveryLocation() {
    let { isDeliverSelected, customer } = this.state
    let selectedAddress = null
    if (!isDeliverSelected) {
      return
    }
    console.log("customer", customer);
    if (customer.last_order_location != null) {
      selectedAddress = customer.last_order_location
    } else if (customer.locations.length > 0) {
      selectedAddress = customer.locations[0]
    }
    console.log("selectedAddress", selectedAddress);

    this.setState({ selectedAddress })
  }

  _renderInstructions() {
    let { instructions } = this.state
    if (!instructions) {
      return null
    }

    return (
      <View style={[styles.row, {flex: 1}]}>
        <Text style={styles.instructionText}>{instructions}</Text>
        <TouchableOpacity onPress={() => this._openInstructionsModal()}>
          <Text style={[styles.buttonText, { marginTop: 10 }]}>Edit</Text>
        </TouchableOpacity>
      </View>
    )
  }

  _openInstructionsModal() {
    this.setState({
      instructionsModalVisible: true
    })
  }

  _openVoucherModal() {
    this.setState({
      voucherModalVisible: true
    })
  }

  _renderPrice(price) {
    let { currency } = this.state
    return Price.format(price, currency)
  }

  _iconPressed() {
    this.setState({ cutlery: !this.state.cutlery })
  }

  _getColor() {
    return this.state.cutlery === true ? global.Colors.Primary : 'white'
  }

  _renderCutleryView() {
    return (
      <View style={styles.row}>
        <View style={styles.cutleryContainer}>
          <Text style={styles.text}>Would you like cutlery?</Text>
          <Text style={styles.smallText}>
            Reduce plastic waste by using your own cutlery.
          </Text>
        </View>
        <View style={{ justifyContent: 'center' }}>
          <Icon
            name="check"
            size={20}
            containerStyle={[
              styles.iconContainer,
              { backgroundColor: this._getColor() }
            ]}
            color="white"
            onPress={() => this._iconPressed()}
          />
        </View>
      </View>
    )
  }

  _renderTitle() {
    let { isDeliverSelected } = this.state
    return isDeliverSelected ? 'Deliver to' : 'Collection for'
  }

  _getAddress() {
    let { selectedAddress } = this.state
    return selectedAddress != null
      ? selectedAddress.address_line_1
      : 'Please add an address'
  }

  _getUserInfo() {
    let { user } = this.state.customer

    let userInfo = user.first_name + ' ' + user.last_name

    if (user.phone_country_code && user.phone_number) {
      userInfo += '\n' + user.phone_country_code + user.phone_number
    }
    return userInfo
  }

  _renderInstructionsButton() {
    let { instructions } = this.state
    if (instructions) {
      return null
    }
    return (
      <Button
        type="quaternary"
        title="Add instructions?"
        style={{ marginBottom: 0 }}
        textStyle={{ textAlign: 'left', paddingLeft: 40 }}
        onPress={() => this._openInstructionsModal()}
      />
    )
  }

  _getDeliveryFee() {
    let { isDeliverSelected } = this.state
    if (!isDeliverSelected) {
      return
    }
    this.setState({ confirmDisabled: true })
    Backend.getDeliveryFee(this.state.venue, this.state.selectedAddress)
      .then(response => {
        let venue = Clone.deepClone(this.state.venue)
        venue.delivery_fee = response.delivery_fee
        BasketManager.setVenue(venue)
        this.setState({ venue, confirmDisabled: false })
      })
      .catch(error => {
        this.setState({ confirmDisabled: false })
        alert(error.message)
      })
  }

  _openAddressModal() {
    this.props.navigator.showModal({
      screen: global.Screens.Addresses,
      passProps: {
        isModal: true,
        venue: this.state.venue,
        onAddressSelected: selectedAddress =>
          this.setState({ selectedAddress }, () => this._getDeliveryFee())
      }
    })
  }

  _renderAddressEditButton() {
    let { isDeliverSelected, selectedAddress } = this.state
    if (!isDeliverSelected) {
      return null
    }
    let title = selectedAddress == null ? 'Add' : 'Edit'
    return (
      <TouchableOpacity onPress={() => this._openAddressModal()}>
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableOpacity>
    )
  }

  _renderArrivalView() {
    let { order } = this.state
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.titleText}>{this._renderTitle()}</Text>
          {this._renderAddressEditButton()}
        </View>
        {this._renderUserAddress()}
        {this._renderContactInfoView()}
        {this._renderInstructionsView()}
      </View>
    )
  }

  _renderUserAddress() {
    let { isDeliverSelected, selectedAddress } = this.state
    if (!isDeliverSelected) {
      return null
    }

    let titleStyle =
      selectedAddress == null ? styles.errorText : styles.contactText
    return (
      <View style={styles.contactContainer}>
        <Text style={titleStyle}>{this._getAddress()}</Text>
      </View>
    )
  }

  _renderContactInfoView() {
    let { isDeliverSelected } = this.state
    let renderTitle = null
    if (isDeliverSelected) {
      renderTitle = <Text style={styles.titleText}>Contact Info</Text>
    }
    return (
      <View>
        {renderTitle}
        <View style={styles.contactContainer}>
          <Text style={[styles.contactText, { lineHeight: 25 }]}>
            {this._getUserInfo()}
          </Text>
        </View>
      </View>
    )
  }

  _renderInstructionsView() {
    let { order } = this.state
    return (
      <View>
        <Text style={styles.titleText}>Instructions</Text>
        {this._renderInstructionsButton()}
        {this._renderInstructions(order.instructions)}
      </View>
    )
  }

  _renderOrderItems() {
    let basket = BasketManager.get()
    return basket.items.map((item, index) => {
      return (
        <View style={styles.orderItemContainer}>
          <OrderDetailItem
            item={item}
            currency={this.state.venue.currency}
            numberOfLines={1}
          />
        </View>
      )
    })
  }

  _renderOrderView() {
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={[styles.titleText, { marginTop: 5 }]}>Your Order</Text>
        </View>
        {this._renderOrderItems()}
      </View>
    )
  }

  _renderSelectedCard() {
    let { selectedCard } = this.state
    if (!selectedCard) {
      return null
    }

    return (
      <View style={styles.contactContainer}>
        <Text style={styles.contactText}>
          {selectedCard.brand.toUpperCase()}
        </Text>
        <Text style={[styles.cardText, { marginTop: 10 }]}>
          **** **** **** {selectedCard.last_four}
        </Text>
      </View>
    )
  }

  _renderPaymentType() {
    let { paymentType } = this.state

    if (paymentType == PAYMENT_TYPE_CARD) {
      return this._renderSelectedCard()
    }

    let title =
      paymentType == null
        ? 'Please select a payment type'
        : String.capitalize(PAYMENT_TYPE_CASH)
    let titleStyle = paymentType == null ? styles.errorText : styles.contactText
    return (
      <View style={styles.contactContainer}>
        <Text style={titleStyle}>{title}</Text>
      </View>
    )
  }

  _renderPaymentView() {
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.titleText}>Payment</Text>
          <TouchableOpacity
            onPress={() =>
              this.setState({
                paymentModalVisible: true
              })
            }
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
        </View>
        {this._renderPaymentType()}
      </View>
    )
  }

  _renderDeliveryFee() {
    if (!this.state.isDeliverSelected) {
      return null
    }
    return (
      <View style={styles.deliveryContainer}>
        <View style={styles.row}>
          <Text style={styles.contactText}>Delivery Fee</Text>
          <Text style={styles.contactText}>
            {this._renderPrice(this.state.venue.delivery_fee)}
          </Text>
        </View>
      </View>
    )
  }

  _goToCompleteOrder(order) {
    let { isDeliverSelected } = this.state
    this.props.navigator.push({
      screen: global.Screens.CompleteOrder,
      passProps: { isDeliverSelected, order }
    })
  }

  _getDiscountAmount(coupon) {
    let couponValue = BasketManager.getCouponValue(coupon)
    return this._renderPrice(couponValue)
  }

  _renderDiscountPrice() {
    let { coupon } = this.state
    return (
      <View style={styles.row}>
        <Text style={styles.totalText}>{coupon.title}</Text>
        <Text style={styles.totalText}>{this._getDiscountAmount(coupon)}</Text>
      </View>
    )
  }

  _renderDiscountView() {
    if (this.state.coupon !== null) {
      return this._renderDiscountPrice()
    }
    return this._renderVoucherButton()
  }

  _renderVoucherButton() {
    return (
      <Button
        type="quaternary"
        textStyle={styles.voucherTitle}
        title="Add Voucher Code"
        style={styles.voucherButton}
        onPress={() => this._openVoucherModal()}
      />
    )
  }

  _getTotal() {
    let { coupon, isDeliverSelected } = this.state
    let total = BasketManager.getTotalPrice(isDeliverSelected, coupon)
    return this._renderPrice(total)
  }

  _isValid() {
    let { paymentType, selectedCard } = this.state
    let isValid = true

    if (!paymentType) {
      alert('Please select a payment type')
      isValid = false
    }
    if (paymentType == PAYMENT_TYPE_CARD && selectedCard == null) {
      alert('Please select a card ')
      isValid = false
    }

    return isValid
  }

  _sendOrder() {
    let {
      isLoading,
      selectedDate,
      paymentType,
      isDeliverSelected,
      cutlery,
      instructions,
      selectedAddress,
      selectedCard,
      coupon
    } = this.state

    if (isLoading) {
      return
    }

    let selectedCardId =
      paymentType == PAYMENT_TYPE_CARD ? selectedCard.id : null
    let selectedAddressId = selectedAddress ? selectedAddress.id : null
    this.setState({ isLoading: true })

    cutlery = false

    let order = BasketManager.createOrder(
      selectedDate,
      paymentType,
      isDeliverSelected,
      cutlery,
      instructions,
      selectedAddressId,
      selectedCardId,
      coupon
    )
    Backend.sendOrder(order)
      .then(order => {
        this.setState({ isLoading: false }, () => {
          this._goToCompleteOrder(order)
          DripHelper.trackOrder(order)
          BasketManager.clear()
        })
      })
      .catch(error => {
        this.setState({ isLoading: false })
        console.log('ERROR', error)
        alert(error.message)
      })
  }

  _onSendButtonClicked() {
    if (!this._isValid()) {
      return
    }
    this._sendOrder()
  }

  _renderBottomContainer() {
    return (
      <View style={styles.bottomContainer}>
        <View style={[styles.row, { margin: 10 }]}>
          <Text style={styles.totalText}>Total Payment</Text>
          <Text style={styles.totalText}>{this._getTotal()}</Text>
        </View>
        <Button
          title="Confirm & Pay"
          style={styles.button}
          isDisabled={this.state.confirmDisabled}
          onPress={() => this._onSendButtonClicked()}
        ></Button>
      </View>
    )
  }

  _openScheduleModal() {
    this.setState({ scheduleModalVisible: true })
  }

  _openAddCardModal() {
    this.setState({ paymentModalVisible: false }, () => {
      setTimeout(() => {
        this.setState({ addCardModalVisible: true })
      }, MODAL_CLOSE_TIME)
    })
  }

  _validateCoupon(code) {
    let { isLoading } = this.state
    if (isLoading) {
      return
    }
    if (!code) {
      this.setState({ showCouponError: true })
      return
    }

    this.setState({ showCouponError: false, isLoading: true })

    let venue = BasketManager.getVenue()
    Backend.validateCoupon(code, venue)
      .then(coupons => {
        let showCouponError = coupons.length == 0
        let coupon = null
        if (!showCouponError) {
          coupon = coupons[0]
        }
        this.setState({
          coupon,
          showCouponError,
          isLoading: false,
          voucherModalVisible: coupon == null
        })
      })
      .catch(error => {
        this.setState({ codeError: true, isLoading: false })
        alert(error.message)
        console.log('ERROR', error)
      })
  }

  _updateUser(selectedCard) {
    AuthManager.refreshCurrentUser()
      .then(customer => {
        this.setState({
          customer,
          addCardModalVisible: false,
          selectedCard,
          paymentType: PAYMENT_TYPE_CARD
        })
      })
      .catch(error => {
        console.log('error', error)
      })
  }

  render() {
    let {
      venue,
      selectedDate,
      isDeliverSelected,
      scheduleModalVisible
    } = this.state
    return (
      <View style={styles.mainContainer}>
        <OrderHeader
          venue={venue}
          selectedDate={selectedDate}
          isDeliverSelected={isDeliverSelected}
          onPress={() => this._openScheduleModal()}
        />
        <KeyboardAwareScrollView contentContainerStyle={styles.scrollContainer}>
          {this._renderArrivalView()}
          {this._renderOrderView()}
          {this._renderPaymentView()}
          {this._renderDeliveryFee()}
          {this._renderDiscountView()}
        </KeyboardAwareScrollView>
        {this._renderBottomContainer()}
        <OrderScheduleModal
          openingHours={this.state.venue.opening_hours}
          visible={scheduleModalVisible}
          selectedDate={selectedDate}
          onModalClosed={() => this.setState({ scheduleModalVisible: false })}
          onSelectedDateUpdated={selectedDate =>
            this.setState({ selectedDate })
          }
        />
        <TextFieldModal
          modalTitle="Delivery Instructions"
          placeholder="Instructions for your order (optional)"
          buttonTitle="Done"
          visible={this.state.instructionsModalVisible}
          value={this.state.instructions}
          buttonPressed={instructions =>
            this.setState({
              instructions,
              instructionsModalVisible: false
            })
          }
          onModalClosed={() =>
            this.setState({ instructionsModalVisible: false })
          }
        />
        <TextFieldModal
          modalTitle="Voucher Code"
          buttonTitle="Add"
          placeholder="Code"
          validationText={this.state.couponErrorMessage}
          showValidationText={this.state.showCouponError}
          buttonPressed={code => this._validateCoupon(code)}
          visible={this.state.voucherModalVisible}
          onModalClosed={() => this.setState({ voucherModalVisible: false })}
        />
        <AddCardModal
          visible={this.state.addCardModalVisible}
          onModalClosed={() => this.setState({ addCardModalVisible: false })}
          newCardAdded={card => this._updateUser(card)}
        />
        <PaymentModal
          visible={this.state.paymentModalVisible}
          customer={this.state.customer}
          selectedCardId={
            this.state.selectedCard ? this.state.selectedCard.id : null
          }
          onPaymentMethodChanged={(paymentType, selectedCard) =>
            this.setState({ paymentType, selectedCard })
          }
          addNewCardPressed={() => this._openAddCardModal()}
          onModalClosed={() => this.setState({ paymentModalVisible: false })}
        />
        <LoadingView isLoading={this.state.isLoading} size="small" />
      </View>
    )
  }
}
const text = {
  fontSize: 16,
  fontWeight: '600'
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: global.Colors.backgroundColor,
    paddingBottom: 90
  },
  container: { marginBottom: 10, marginLeft: 10 },
  cutleryContainer: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  scrollContainer: {
    padding: 10,
    paddingBottom: 40
  },
  subTotalContainer: { flex: 1, justifyContent: 'flex-end' },
  titleText: {
    marginTop: 15,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: '600',
    color: '#909090'
  },
  errorText: {
    marginTop: 5,
    fontSize: 17,
    fontWeight: '700',
    color: 'red'
  },
  totalText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
    marginRight: 10
  },
  text: { fontSize: 16, fontWeight: '600' },
  iconContainer: {
    marginLeft: 5,
    marginRight: 5,
    borderWidth: 0.5,
    borderRadius: 20,
    padding: 2,
    borderColor: '#909090'
  },
  buttonText: {
    color: global.Colors.Primary,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginRight: 10
  },
  smallText: { marginTop: 5, color: '#909090' },
  button: { marginLeft: 40, marginRight: 40, marginTop: 5 },
  voucherButton: { marginHorizontal: 10 },
  voucherTitle: { fontSize: 14, textAlign: 'left' },
  contactText: { marginTop: 5, fontSize: 17, fontWeight: '700' },
  contactContainer: { marginLeft: 40, marginTop: 10 },
  cardText: { ...text, color: '#909090', marginRight: 8 },
  deliveryContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginTop: 10,
    marginBottom: 15,
    marginLeft: 10,
    marginRight: 10
  },
  instructionText: {
    flexWrap: 'wrap',
    width: '70%',
    fontSize: 15,
    marginLeft: 40,
    marginTop: 10,
    fontWeight: '700'
  },
  orderItemContainer: {
    marginTop: 5,
    paddingLeft: 10,
    paddingRight: 10
  },
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
