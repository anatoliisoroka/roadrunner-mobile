import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  KeyboardAvoidingView
} from 'react-native'

import LazyLoadingFlatList from '../../components/shared/LazyLoadingFlatList'
import NoResult from '../../components/shared/NoResults'
import VenueListItem from '../../components/customer/VenueListItem'
import DeliverCollectSegmentedControl from '../../components/customer/DeliverCollectSegmentedControl'
import OrderScheduleModal from '../../components/customer/OrderScheduleModal'
import SearchField from '../../components/shared/SearchField'
import OrderScheduleNavBarButton from '../../components/customer/OrderScheduleNavBarButton'

import AuthManager from '../../utils/AuthManager'
import BasketManager from '../../utils/BasketManager'
import Broadcast from '../../utils/Broadcast'
import DateTime from '../../utils/DateTime'

import moment from 'moment'

import screenStyles from '../../assets/css/screens'
import mainStyles from '../../assets/css/main'

import FILTER from '../../assets/icons/filter.png'

export default class Venues extends Component {
  static navigatorStyle = global.Screens.PrimaryNavBar
  static navigatorButtons = {
    rightButtons: [{ id: 'filter', icon: FILTER }]
  }
  constructor(props) {
    super(props)
    this.state = {
      searchTerm: '',
      modalVisible: false,
      isLoading: false,
      isDeliverSelected: true,
      selectedDate: null,
      filters: { ...props.filters },
      currentUserLocation: AuthManager.getCurrentUserLocation()
    }
    this._setupNavigator()
  }

  _setupNavigator() {
    this.props.navigator.setStyle({
      navBarCustomView: global.Screens.OrderScheduleNavBarButton,
      navBarCustomViewInitialProps: {
        onPress: () => this._showModal(),
        title: 'Today, ASAP',
        navigator: this.props.navigator,
        eventId: 'filter',
        onEvent: () => this._goToFiltersPage()
      }
    })
  }

  _onFiltersUpdated(filters) {
    this.setState({ filters })
  }

  _goTo(venue) {
    let { selectedDate, isDeliverSelected } = this.state
    this.props.navigator.push({
      screen: global.Screens.Menu,
      passProps: {
        venue,
        selectedDate,
        isDeliverSelected
      }
    })
  }

  _goToFiltersPage() {
    let { filters } = this.state
    this.props.navigator.push({
      screen: global.Screens.Filter,
      passProps: {
        onFiltersUpdated: filters => this._onFiltersUpdated(filters),
        filters
      }
    })
  }

  _getVenuesEndpoint() {
    let {
      filters,
      searchTerm,
      isDeliverSelected,
      currentUserLocation
    } = this.state
    let selectedDate = this.state.selectedDate ?? DateTime.getMinutesFromNow(5)

    let selectedDateInIso = selectedDate.toISOString()

    if (isDeliverSelected) {
      filters['delivery'] = true
      filters['deliver_at'] = selectedDateInIso
      delete filters['collection']
      delete filters['collection_at']
    } else {
      filters['collection'] = true
      filters['collection_at'] = selectedDateInIso
      delete filters['delivery']
      delete filters['delivery_at']
    }

    if (searchTerm.length > 0) {
      filters['search_term'] = searchTerm
    } else {
      delete filters['search_term']
    }

    if (currentUserLocation) {
      filters['latitude'] = currentUserLocation.latitude
      filters['longitude'] = currentUserLocation.longitude
    }

    filters['has_menu'] = true

    let params = Object.entries(filters)
      .map(([key, value]) => key + '=' + value)
      .join('&')

    params = '?' + params

    let endpoint = global.Api.Venues + params

    return endpoint
  }

  _showModal() {
    this.setState({ modalVisible: true })
  }

  _onSelectedDateUpdated(selectedDate) {
    this.setState({ selectedDate })
    Broadcast.sendSelectedDate(selectedDate)
  }

  _renderVenues() {
    return (
      <LazyLoadingFlatList
        ref={list => (this.list = list)}
        endpoint={this._getVenuesEndpoint()}
        extraData={this.state.filters}
        contentContainerStyle={{
          paddingBottom: 50
        }}
        ListEmptyComponent={() => {
          if (!this.list || this.list.lazyLoader.isLoading()) {
            return null
          }

          return <NoResult style={{ marginTop: 20 }} title="No venues found." />
        }}
        renderItem={({ item }) => {
          return <VenueListItem venue={item} onPress={() => this._goTo(item)} />
        }}
      />
    )
  }

  _renderSearchBar() {
    return (
      <KeyboardAvoidingView
        behavior="padding"
        style={mainStyles.venueSearchBar}
        keyboardVerticalOffset={140}
      >
        <SearchField
          containerStyle={styles.searchBar}
          placeholder="Search"
          inputStyle={{ marginLeft: 10 }}
          onChangeText={searchTerm => {
            this.setState({ searchTerm })
          }}
        />
      </KeyboardAvoidingView>
    )
  }

  render() {
    let { isDeliverSelected, selectedDate } = this.state
    return (
      <View style={{ flex: 1, marginTop: 10, paddingBottom: 20 }}>
        <DeliverCollectSegmentedControl
          isDeliverSelected={isDeliverSelected}
          onChange={isDeliverSelected => this.setState({ isDeliverSelected })}
        />

        <ScrollView style={screenStyles.mainContainer}>
          {this._renderVenues()}
        </ScrollView>

        {this._renderSearchBar()}
        <OrderScheduleModal
          visible={this.state.modalVisible}
          selectedDate={selectedDate}
          onModalClosed={() => this.setState({ modalVisible: false })}
          onSelectedDateUpdated={date => this._onSelectedDateUpdated(date)}
        />
      </View>
    )
  }
}

Venues.defaultProps = {
  filters: {
    order_by: 'title',
    order_direction: 'asc'
  }
}

const styles = StyleSheet.create({
  searchBar: {
    borderRadius: 5,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    backgroundColor: '#fff',
    margin: 10,
    height: 35
  }
})
