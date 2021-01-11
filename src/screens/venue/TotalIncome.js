import React, { Component } from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import SegmentedControl from '../../components/shared/SegmentedControl'

import VenuesPicker from '../../components/venue/VenuesPicker'
import LoadingView from '../../components/shared/LoadingView'

import Price from '../../utils/Price'
import AuthManager from '../../utils/AuthManager'
import Backend from '../../utils/Backend'

import screenStyles from '../../assets/css/screens'

const TIME_PERIOD_TODAY = 'today'
const TIME_PERIOD_WEEK = 'week'
const TIME_PERIOD_MONTH = 'month'

// they affect each other, please update both in any change
const TIME_PERIODS = ['Today', '7 Days', '30 Days']
const SERVER_TIME_PERIODS = [
  TIME_PERIOD_TODAY,
  TIME_PERIOD_WEEK,
  TIME_PERIOD_MONTH
]

const CURRENCIES = ['EUR', 'GBP', 'USD']

const VENUES_ALL = { label: 'All', value: 0 }
export default class TotalIncome extends Component {
  static navigatorStyle = global.Screens.PrimaryNavBar
  constructor(props) {
    super(props)
    this.state = {
      stats: [],
      isLoading: false,
      selectedCurrencyIndex: 0,
      selectedDaysIndex: 0,
      selectedVenue: { label: 'All', value: 0 }
    }
  }

  componentDidMount() {
    this.props.navigator.setTitle({ title: 'Total Income' })

    this._getEarnings()
  }

  _renderPrice(price) {
    let { selectedCurrencyIndex } = this.state
    let currency = CURRENCIES[selectedCurrencyIndex].toLowerCase()
    return Price.format(price, currency)
  }

  _getEarnings() {
    let {
      selectedCurrencyIndex,
      selectedDaysIndex,
      selectedVenue,
      isLoading
    } = this.state

    if (isLoading) {
      return
    }

    let currency = CURRENCIES[selectedCurrencyIndex].toLowerCase()
    let timePeriod = SERVER_TIME_PERIODS[selectedDaysIndex]
    let venue = { ...selectedVenue }
    // this will get all venue results
    if (this._hasDefaultVenueSelected()) {
      venue = null
    }

    this.setState({ isLoading: true })
    Backend.getVenueStats(venue, timePeriod, currency)
      .then(stats => {
        this.setState({ stats, isLoading: false })
      })
      .catch(error => {
        this.setState({ isLoading: false })
        console.log('ERROR', error)
      })
  }

  _hasDefaultVenueSelected() {
    let { selectedVenue } = this.state
    return selectedVenue.value === VENUES_ALL.value
  }

  _segmentCurrencyUpdated(selectedCurrencyIndex) {
    this.setState({ selectedCurrencyIndex }, () => this._getEarnings())
  }

  _segmentDaysUpdated(selectedDaysIndex) {
    this.setState({ selectedDaysIndex }, () => this._getEarnings())
  }

  _renderCurrencySegmentedController() {
    let { selectedCurrencyIndex } = this.state

    if (!this._hasDefaultVenueSelected()) {
      return null
    }
    return (
      <SegmentedControl
        buttons={CURRENCIES}
        style={{ marginBottom: 10 }}
        selectedIndex={selectedCurrencyIndex}
        onPress={selectedCurrencyIndex =>
          this._segmentCurrencyUpdated(selectedCurrencyIndex)
        }
      />
    )
  }

  _renderStats() {
    return this.state.stats.map(item => {
      let value = item.currency ? this._renderPrice(item.value) : item.value
      return (
        <View style={styles.row}>
          <Text style={styles.text}>{item.title}</Text>
          <Text style={styles.total}>{value}</Text>
        </View>
      )
    })
  }

  render() {
    return (
      <View style={screenStyles.mainContainer}>
        <SegmentedControl
          buttons={TIME_PERIODS}
          selectedIndex={this.state.selectedDaysIndex}
          onPress={selectedDaysIndex =>
            this._segmentDaysUpdated(selectedDaysIndex)
          }
        />
        <VenuesPicker
          onValueChange={selectedVenue =>
            this.setState({ selectedVenue }, () => this._getEarnings())
          }
        />
        {this._renderCurrencySegmentedController()}
        <View style={styles.statsContainer}>{this._renderStats()}</View>
        <LoadingView isLoading={this.state.isLoading} size="small" />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  row: {
    marginLeft: 20,
    marginRight: 20,
    margin: 5,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  statsContainer: { flex: 1, marginTop: 20 },
  text: { fontSize: 16 },
  total: {
    fontSize: 15,
    fontWeight: '500'
  }
})
