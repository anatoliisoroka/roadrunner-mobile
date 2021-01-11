import React, { Component } from 'react'
import {
  StyleSheet,
  Platform,
  View,
  Image,
  TextInput,
  FlatList
} from 'react-native'
import Text from 'react-native-text'

import { Icon } from 'react-native-elements'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import LoadingView from '../../components/shared/LoadingView'
import SegmentedControl from '../../components/shared/SegmentedControl'
import OrderCard from '../../components/venue/OrderCard'
import NoResult from '../../components/shared/NoResults'
import Notifications from '../../utils/Notifications'
import LazyLoadingFlatList from '../../components/shared/LazyLoadingFlatList'

import PushNotification from 'react-native-push-notification'

import Backend from '../../utils/Backend'
import List from '../../utils/List'

import { ifIphoneX } from 'react-native-iphone-x-helper'
import mainStyles from '../../assets/css/main'

import SETTINGS from '../../assets/icons/settings.png'

const NEW = 0
const IN_PROGRESS = 1
const HISTORY = 2

const PENDING = 'pending'
const ACCEPTED = 'accepted'
const REJECTED = 'rejected'
const CANCELLED = 'cancelled'
const FOOD_PREPARING = 'food_preparing'
const PREPARING = 'preparing'
const FINISHED = 'finished'

type Props = {}
export default class VenueOrders extends Component {
  static navigatorStyle = global.Screens.PrimaryNavBar
  static navigatorButtons = {
    rightButtons: [{ id: 'settings', icon: SETTINGS }]
  }
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      topIndex: 0,
      bottomIndex: 0,
      title: '',
      endpoint: null
    }

    Notifications.requestPermissionIfLoggedIn()
  }

  componentDidMount() {
    this.props.navigator.setTitle({ title: 'New Orders' })
    this.props.navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this))
    if (global.General.InitialOrder) {
      this._goTo(global.General.InitialOrder)
      global.General.InitialOrder = null
    }
    this._setEndpoint()
  }

  _setEndpoint() {
    let { topIndex, bottomIndex } = this.state
    let params = ''
    if (bottomIndex == 0) {
      params = '?status=pending&food_status=pending'
    }
    if (bottomIndex == 1) {
      if (topIndex == 0) {
        params = '?status=accepted&food_status=pending'
      } else {
        params = '?status=accepted&food_status=preparing'
      }
    }
    if (bottomIndex == 2) {
      params = '?status=accepted&food_status=finished'
    }
    let endpoint = global.Api.Orders + params

    this.setState({ endpoint }, () => {})
  }

  _onNavigatorEvent(event) {
    if (event.id == 'settings') {
      this.props.navigator.push({
        screen: global.Screens.Settings
      })
    }
    if (event.type == 'DeepLink') {
      const data = event.payload

      if (data.type == 'order' && data.order_id) {
        this._handleUpdateList(data)
      }
    }
  }

  _handleUpdateList(data) {
    Backend.getOrder(data.order_id)
      .then(order => {
        this._onOrderUpdated(order)
      })
      .catch(error => {
        console.log('Error:', error)
      })
  }

  _goTo(order) {
    this.props.navigator.push({
      screen: global.Screens.VenueOrderDetails,
      passProps: {
        order,
        onOrderUpdated: order => this._onOrderUpdated(order)
      }
    })
  }

  _onOrderUpdated(order) {
    let { orders, bottomIndex, topIndex } = this.state

    if (
      (bottomIndex == NEW && order.status == 'accepted') ||
      ((bottomIndex == IN_PROGRESS &&
        (topIndex == 1 && order.food_status == 'finished')) ||
        (topIndex == 0 && order.food_status == 'preparing'))
    ) {
      this.list.lazyLoader.removeItem(order)
    } else {
      this.list.lazyLoader.updateOrRefresh(order)
    }
  }

  _getPrepareOrders(topIndex) {
    this.setState({ topIndex }, () => {
      this._setEndpoint()
    })
  }

  _renderScreen(title, bottomIndex) {
    this.props.navigator.setTitle({ title: title })

    this.setState({ bottomIndex }, () => {
      this._setEndpoint()
    })
  }

  _renderScreens(bottomIndex) {
    switch (bottomIndex) {
      case NEW:
        return this._renderScreen('New Orders', bottomIndex)
      case IN_PROGRESS:
        return this._renderScreen('Pending Orders', bottomIndex)
      case HISTORY:
        return this._renderScreen('Past Orders', bottomIndex)
      default:
        return this._renderScreen()
    }
  }

  _renderBottomContainer() {
    let { bottomIndex } = this.state
    return (
      <View style={styles.bottomContainer}>
        <SegmentedControl
          buttons={['New', 'In Progress', 'History']}
          selectedIndex={bottomIndex}
          onPress={bottomIndex => this._renderScreens(bottomIndex)}
          style={styles.SegmentedControl}
        />
      </View>
    )
  }

  _showOrderNumber() {
    if (this.state.bottomIndex == HISTORY) {
      return true
    }
    return false
  }

  _updateOrderStatus(order, status, foodStatus) {
    let { bottomIndex, topIndex } = this.state
    Backend.updateOrderStatus(order, status, foodStatus)
      .then(response => {
        this._reload()
      })
      .catch(error => {
        alert(error.message)
      })
  }

  _reload() {
    this.list.refresh()
  }

  _renderTopController() {
    let { topIndex } = this.state
    if (this.state.bottomIndex != IN_PROGRESS) {
      return null
    }
    return (
      <SegmentedControl
        buttons={['Prepare', 'Complete']}
        selectedIndex={topIndex}
        onPress={topIndex => this._getPrepareOrders(topIndex)}
        style={[styles.SegmentedControl, { marginTop: 10 }]}
      />
    )
  }

  _renderItem(item, index) {
    return (
      <OrderCard
        key={item.id}
        order={item}
        showOrderNumber={this._showOrderNumber()}
        onPress={() => this._goTo(item)}
        onOrderStatusUpdated={(status, foodStatus) => {
          this._updateOrderStatus(item, status, foodStatus)
        }}
      />
    )
  }

  _renderOrders() {
    let { endpoint } = this.state
    if (!endpoint) {
      return null
    }
    return (
      <LazyLoadingFlatList
        ref={list => (this.list = list)}
        endpoint={endpoint}
        renderItem={({ item, index }) => {
          return this._renderItem(item, index)
        }}
        contentContainerStyle={styles.scrollContainer}
        ListEmptyComponent={() => {
          if (!this.list || this.list.lazyLoader.isLoading()) {
            return null
          }

          return (
            <NoResult style={{ marginTop: 20 }} title="No orders to show." />
          )
        }}
      />
    )
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        {this._renderTopController()}
        {this._renderOrders()}
        <LoadingView isLoading={this.state.isLoading} size="small" />
        {this._renderBottomContainer()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: global.Colors.ScreenBackground
  },
  scrollContainer: {
    paddingTop: 20,
    paddingBottom: 100,
    paddingLeft: 20,
    paddingRight: 20
  },

  text: {
    fontWeight: '500',
    fontSize: 17,
    marginBottom: 2,
    textAlign: 'center'
  },
  footerContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: '#f7f7f7',
    ...ifIphoneX(
      {
        paddingBottom: 35
      },
      {
        paddingBottom: 10
      }
    ),
    justifyContent: 'center'
  },
  bottomButtonContainer: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 15
  },
  button: {
    width: '50%',
    borderWidth: 0
  },
  buttonText: {
    fontSize: 15,
    color: global.Colors.Primary
  },
  SegmentedControl: { marginTop: 0 },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30
  }
})
