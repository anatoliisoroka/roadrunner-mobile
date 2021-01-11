import React, { Component } from 'react'
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native'

import { Switch } from 'react-native-switch'
import { CheckBox } from 'react-native-elements'
import Modal from 'react-native-modal'
import InLinePickerField from '../shared/InLinePickerField'
import Hr from '../../components/shared/Hr'
import Button from '../shared/Button'

import Backend from '../../utils/Backend'
import List from '../../utils/List'

import MockData from '../../utils/MockData'

import modalStyles from '../../assets/css/modal'

const PAYMENT_TYPE_CARD = 'card'
const PAYMENT_TYPE_CASH = 'cash'
export default class PaymentModal extends Component {
  constructor(props) {
    super(props)
    let data = this._getCardRelatedData(props)
    let cards = data.cards

    this.state = {
      ...data,
      visible: props.visible,
      isLoading: false,
      cashChecked: false,
      selectedCardId: this._getDefaultCardId(props, cards)
    }
  }

  componentWillReceiveProps(nextProps) {
    let data = this._getCardRelatedData(nextProps)
    let cards = data.cards
    let allProps = { ...nextProps, ...data }
    let newState = {
      ...allProps,
      selectedCardId: this._getDefaultCardId(allProps, cards)
    }
    this.setState(newState)
  }

  // cards are coming from customer and parent controller can update customer
  _getCardRelatedData(props) {
    let customer = props.customer
    let cards = customer.cards

    let data = {
      customer,
      cards,
      items: [{ items: this._getPickerData(cards) }]
    }

    return data
  }

  _getDefaultCardId(props, cards) {
    if (props.selectedCardId) {
      return props.selectedCardId
    }

    let selectedCard = List.getItemByValue(cards, true, 'is_default')
    if (!selectedCard) {
      return null
    }
    let selectedCardId = selectedCard.id
    return selectedCardId
  }

  _getPickerData(cards) {
    let pickerCards = cards.map((card, index) => {
      return {
        label: card.brand.toUpperCase() + ' *' + card.last_four,
        value: card.id,
        isDefault: card.is_default
      }
    })

    return pickerCards
  }

  _close() {
    this.setState({ visible: false })
    this.props.onModalClosed()
  }

  _onPaymentMethodChanged() {
    let { cashChecked, cards } = this.state
    let paymentType = cashChecked ? PAYMENT_TYPE_CASH : PAYMENT_TYPE_CARD
    let selectedCardId = cashChecked ? null : this.state.selectedCardId
    let card = List.getItemByValue(cards, selectedCardId, 'id')
    this.props.onPaymentMethodChanged(paymentType, card)
    this._close()
  }

  _addNewCardPressed() {
    this.props.addNewCardPressed()
  }

  _renderPicker() {
    let { cashChecked, items, selectedCardId } = this.state
    if (cashChecked) {
      return null
    }
    if(items[0].items.length <= 0){
      return null
    }
    return (
      <View>
        <Text style={styles.title}>Pay By Card</Text>
        <InLinePickerField
          data={items}
          selectedValues={[selectedCardId]}
          onValuesChange={values => {
            let value = values[0]
            this.setState({ selectedCardId: value })
          }}
        />
      </View>
    )
  }

  _renderNewCardButton() {
    let { cashChecked, isLoading } = this.state
    if (cashChecked) {
      return null
    }
    return (
      <Button
        title="Add New Card"
        type="quaternary"
        style={styles.button}
        isLoading={isLoading}
        onPress={() => this._addNewCardPressed()}
      />
    )
  }

  _renderModalContent() {
    return (
      <View>
        <View>{this._renderPicker()}</View>
        {this._renderNewCardButton()}
        <Button
          title="Done"
          style={styles.button}
          isLoading={this.state.isLoading}
          onPress={() => this._onPaymentMethodChanged()}
        />
      </View>
    )
  }

  render() {
    return (
      <Modal
        isVisible={this.state.visible}
        onBackdropPress={() => this._close()}
        useNativeDriver={true}
        style={{ justifyContent: 'flex-end', margin: 0 }}
      >
        <View style={styles.pickerContainer}>{this._renderModalContent()}</View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 30
  },
  expiration: {
    flexDirection: 'row',
    backgroundColor: 'pink'
  },
  button: {
    marginTop: 20
  },
  container: {
    borderWidth: 0,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: '#e2e2e2',
    marginLeft: 10,
    marginRight: 10
  },
  text: {
    textAlign: 'left',
    width: '95%',
    paddingLeft: 10,
    fontSize: 16,
    fontWeight: '500'
  },
  title: {
    color: '#4A4E53',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 14,
    marginTop: 10
  },
  pickerContainer: {
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    padding: 10,
    backgroundColor: 'white'
  }
})

PaymentModal.defaultProps = {
  visible: false,
  title: 'Modal Title',
  selectedCardId: null
}
