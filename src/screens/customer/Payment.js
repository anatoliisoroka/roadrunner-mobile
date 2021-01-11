import React, { Component } from 'react'
import { View, Text, Alert, FlatList, StyleSheet } from 'react-native'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import LoadingView from '../../components/shared/LoadingView'
import Card from '../../components/customer/Card'
import Button from '../../components/shared/Button'
import PaymentListItem from '../../components/customer/PaymentListItem'
import AddCardModal from '../../components/customer/AddCardModal'
import NoResults from '../../components/shared/NoResults'

import AuthManager from '../../utils/AuthManager'
import MockData from '../../utils/MockData'
import Backend from '../../utils/Backend'

import List from '../../utils/List'

import screenStyles from '../../assets/css/screens'

type Props = {}
export default class Payment extends Component {
  static navigatorStyle = global.Screens.PrimaryNavBar
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      modalVisible: false,
      cards: [],
      defaultCard: null,
      user: AuthManager.getCurrentUser()
    }
  }

  componentDidMount() {
    this.props.navigator.setTitle({ title: 'Payment Details' })
  }

  _updateUser() {
    AuthManager.refreshCurrentUser()
      .then(user => {
        this.setState({ user })
      })
      .catch(error => {
        console.log('error', error)
      })
  }

  _showDeleteAlert(card) {
    Alert.alert(
      'Delete Payment Method',
      'Are you sure you want to delete this payment method?',
      [
        { text: 'Yes', onPress: () => this._deletePaymentMethod(card) },
        {
          text: 'No',
          style: 'cancel'
        }
      ]
    )
  }

  _showMakeDefaultAlert(card) {
    Alert.alert(
      'Default Payment Method',
      'Are you sure you want to set this card as your default payment method?',
      [
        { text: 'Yes', onPress: () => this._setDefaultPaymentMethod(card) },
        {
          text: 'No',
          style: 'cancel'
        }
      ]
    )
  }

  _deletePaymentMethod(card) {
    Backend.deletePaymentMethod(card)
      .then(response => {
        let { cards } = this.state.user
        List.removeItem(cards, card, 'id')
        this.setState({ cards })
      })
      .catch(error => {
        console.warn(error.message)
      })
  }

  _setDefaultPaymentMethod(card) {
    Backend.updateCard(card)
      .then(response => {
        scroll.props.scrollToPosition(0, 0)
        this._updateUser()
      })
      .catch(error => {
        console.warn(error.message)
      })
  }

  _onDoneButtonPressed() {
    this.props.navigator.pop()
  }

  _renderButtons() {
    return (
      <View style={{ flex: 1, width: '100%', justifyContent: 'flex-end' }}>
        {this._renderAddCardButton()}
        {this._renderSaveButton()}
      </View>
    )
  }

  _renderAddCardButton() {
    return (
      <Button
        type="quaternary"
        title="Add New Card"
        style={{
          marginBottom: 20
        }}
        onPress={() => this._openModal()}
      />
    )
  }

  _openModal() {
    this.setState({ modalVisible: true })
  }

  _renderSaveButton() {
    return (
      <Button
        type="primary"
        title="Done"
        style={{
          marginLeft: 50,
          marginRight: 50,
          marginBottom: 50
        }}
        onPress={() => this._onDoneButtonPressed()}
      />
    )
  }

  _renderCard() {
    let { cards } = this.state.user
    if (cards.length <= 0) {
      return null
    }
    return <Card defaultCard={cards[0]} />
  }

  _renderPaymentTitle() {
    let { cards } = this.state.user
    if (cards.length <= 0) {
      return null
    }
    return <Text style={styles.title}>Payment Details</Text>
  }

  _renderNoResults() {
    let { cards } = this.state.user
    if (cards.length <= 0 && !this.state.isLoading) {
      return <NoResults title="No payment methods added." />
    }
  }

  _renderPaymentMethodList() {
    let { cards } = this.state.user
    return (
      <FlatList
        ref={list => (this.list = list)}
        data={cards}
        extraData={this.state}
        ListEmptyComponent={this._renderNoResults()}
        renderItem={({ item }) => {
          return (
            <PaymentListItem
              card={item}
              showDelete={false}
              onDeletePress={() => this._showDeleteAlert(item)}
              onMakeDefaultPress={() => this._showMakeDefaultAlert(item)}
            />
          )
        }}
      />
    )
  }

  render() {
    return (
      <KeyboardAwareScrollView
        enableOnAndroid
        innerRef={ref => {
          scroll = ref
        }}
        contentContainerStyle={[screenStyles.mainContainer, { padding: 20 }]}
      >
        {this._renderCard()}
        {this._renderPaymentTitle()}

        {this._renderPaymentMethodList()}
        {this._renderButtons()}
        <AddCardModal
          visible={this.state.modalVisible}
          onModalClosed={() => this.setState({ modalVisible: false })}
          newCardAdded={() => this._updateUser()}
        />
        <LoadingView isLoading={this.state.isLoading} size="small" />
      </KeyboardAwareScrollView>
    )
  }
}

const styles = StyleSheet.create({
  title: { fontSize: 16, fontWeight: '600' }
})
