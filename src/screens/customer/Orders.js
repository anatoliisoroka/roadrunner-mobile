import React, { Component } from 'react'
import { StyleSheet, View, Text, Alert } from 'react-native'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import LoadingView from '../../components/shared/LoadingView'
import LazyLoadingFlatList from '../../components/shared/LazyLoadingFlatList'
import NoResult from '../../components/shared/NoResults'
import OrderListItem from '../../components/customer/OrderListItem'

import AuthManager from '../../utils/AuthManager'
import MockData from '../../utils/MockData'
import Backend from '../../utils/Backend'

import screenStyles from '../../assets/css/screens'

type Props = {}
export default class Orders extends Component {
  static navigatorStyle = global.Screens.PrimaryNavBar
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false
    }
  }

  componentDidMount() {
    this.props.navigator.setTitle({ title: 'My Orders' })
  }

  _goTo(item) {
    this.props.navigator.push({
      screen: global.Screens.OrderDetails,
      passProps: {
        order: item
      }
    })
  }

  _renderOrdersList() {
    return (
      <LazyLoadingFlatList
        ref={list => (this.list = list)}
        endpoint={global.Api.Orders}
        ListEmptyComponent={() => {
          if (!this.list || this.list.lazyLoader.isLoading()) {
            return null
          }

          return (
            <NoResult
              style={{ marginTop: 20 }}
              title="You have not placed an order yet."
            />
          )
        }}
        renderItem={({ item }) => {
          return (
            <OrderListItem orderItem={item} onPress={() => this._goTo(item)} />
          )
        }}
      />
    )
  }

  render() {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={screenStyles.mainPaddedContainer}
      >
        <Text style={styles.text}>Orders</Text>
        {this._renderOrdersList()}
      </KeyboardAwareScrollView>
    )
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
    marginTop: 10
  }
})
