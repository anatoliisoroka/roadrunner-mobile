import React, { Component } from 'react'
import { Alert, View, Text, StyleSheet, FlatList } from 'react-native'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import LoadingView from '../../components/shared/LoadingView'
import Button from '../../components/shared/Button'
import AddressListItem from '../../components/customer/AddressListItem'
import LazyLoadingFlatList from '../../components/shared/LazyLoadingFlatList'
import AddressModal from '../../components/customer/AddressModal'
import NoResult from '../../components/shared/NoResults'

import AuthManager from '../../utils/AuthManager'
import MockData from '../../utils/MockData'
import Backend from '../../utils/Backend'

import List from '../../utils/List'

import screenStyles from '../../assets/css/screens'

type Props = {}
export default class Addresses extends Component {
  static navigatorStyle = global.Screens.PrimaryNavBar
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      isModal: props.isModal,
      isLoading: false,
      user: AuthManager.getCurrentUser(),
      selectedAddress: null
    }
  }

  componentDidMount() {
    this.props.navigator.setTitle({ title: 'Delivery Address' })
  }

  _UpdateUser() {
    if (this.state.isModal) {
      this.list.refresh()
    }
    AuthManager.refreshCurrentUser().then(user => {
      this.setState({ user, modalVisible: false })
    })
  }

  _onDoneButtonPressed() {
    if (this.state.isModal) {
      this.props.navigator.dismissModal()
    }
    this.props.navigator.pop()
  }

  _showDeleteAlert(address) {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this Address?',
      [
        { text: 'Yes', onPress: () => this._deleteAddress(address) },
        {
          text: 'No',
          style: 'cancel'
        }
      ]
    )
  }

  _deleteAddress(address) {
    this.setState({ isLoading: true })
    Backend.deleteAddress(address)
      .then(response => {
        this._UpdateUser()
        this.setState({ isLoading: false })
      })
      .catch(error => {
        console.warn(error.message)
        this.setState({ isLoading: false })
      })
  }

  _renderButtons() {
    return (
      <View style={styles.buttonContainer}>
        {this._renderAddAddressButton()}
        {this._renderDoneButton()}
      </View>
    )
  }

  _renderAddAddressButton() {
    return (
      <Button
        type="quaternary"
        title="Add New Address"
        style={{
          marginBottom: 20,
          marginTop: 10
        }}
        onPress={() => this._openModal()}
      />
    )
  }

  _openModal() {
    this.setState({ modalVisible: true })
  }

  _renderDoneButton() {
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

  _renderNoResults() {
    if (this.state.user.locations.length <= 0 && !this.state.isLoading) {
      return <NoResult style={{ marginTop: 20 }} title="No address found." />
    }
  }

  _addressSelected(selectedAddress) {
    this.props.onAddressSelected(selectedAddress)
    this.props.navigator.dismissModal()
  }

  _renderModalAddressList() {
    console.log('URL', global.Api.Locations + '?venue=' + this.props.venue.id)
    return (
      <LazyLoadingFlatList
        ref={list => (this.list = list)}
        endpoint={global.Api.Locations + '?venue=' + this.props.venue.id}
        ListEmptyComponent={() => {
          if (!this.list || this.list.lazyLoader.isLoading()) {
            return null
          }
          return (
            <NoResult style={{ marginTop: 20 }} title="Add a new address" />
          )
        }}
        extraData={this.state}
        renderItem={({ item }) => {
          return (
            <AddressListItem
              location={item}
              isModal={this.state.isModal}
              onPress={() => this._showDeleteAlert(item)}
              addressSelected={selectedAddress =>
                this._addressSelected(selectedAddress)
              }
            />
          )
        }}
      />
    )
  }

  _renderAddressList() {
    return (
      <FlatList
        ref={addresslist => (this.addresslist = addresslist)}
        data={this.state.user.locations}
        extraData={this.state.user}
        ListEmptyComponent={this._renderNoResults()}
        renderItem={({ item }) => {
          return (
            <AddressListItem
              location={item}
              isModal={this.state.isModal}
              onPress={() => this._showDeleteAlert(item)}
              addressSelected={selectedAddress =>
                this._addressSelected(selectedAddress)
              }
            />
          )
        }}
      />
    )
  }

  _renderAddressListContainer() {
    if (this.state.isModal) {
      return this._renderModalAddressList()
    }
    return this._renderAddressList()
  }

  render() {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={[screenStyles.mainContainer, { padding: 20 }]}
      >
        <Text style={{ fontSize: 16, fontWeight: '600' }}>Address List</Text>
        {this._renderAddressListContainer()}
        {this._renderButtons()}
        <AddressModal
          visible={this.state.modalVisible}
          onAddressSelected={location => this.setState({ location })}
          onModalClosed={() => this.setState({ modalVisible: false })}
          onAddressAdded={() => this._UpdateUser()}
        />
        <LoadingView isLoading={this.state.isLoading} size="small" />
      </KeyboardAwareScrollView>
    )
  }
}

Addresses.defaultProps = {
  isModal: false
}

const styles = StyleSheet.create({
  buttonContainer: { flex: 1, width: '100%', justifyContent: 'flex-end' }
})
