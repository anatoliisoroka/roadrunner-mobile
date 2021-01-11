import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  PermissionsAndroid,
  Platform,
  FlatList,
  TouchableOpacity
} from 'react-native'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Button from '../../components/shared/Button'
import FeedListTitle from '../../components/customer/FeedListTitle'
import LazyLoadingFlatList from '../../components/shared/LazyLoadingFlatList'
import NoResult from '../../components/shared/NoResults'
import CategoryFeedListItem from '../../components/customer/CategoryFeedListItem'
import TopRatedFeedListItem from '../../components/customer/TopRatedFeedListItem'
import Map from '../../components/shared/Map'
import LocationSearch from '../../components/shared/LocationSearch'
import ReviewVenueModal from '../../components/customer/ReviewVenueModal'
import SlideInView from '../../components/customer/SlideInView'

import { FormInput, Icon } from 'react-native-elements'

import AuthManager from '../../utils/AuthManager'
import Backend from '../../utils/Backend'
import Notifications from '../../utils/Notifications'

import MockData from '../../utils/MockData'

import screenStyles from '../../assets/css/screens'
import mainStyles from '../../assets/css/main'
import textStyles from '../../assets/css/text'

const LOGO = require('../../assets/icons/mosaic-wheel.png')
const PROFILE = require('../../assets/icons/profile.png')

export default class Feed extends Component {
  static navigatorStyle = global.Screens.NoNavBar
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      orderReviewModalVisible: false,
      order: null,
      venueLocations: [],
      venuesMapLoading: false,
      currentUserLocation: AuthManager.getCurrentUserLocation()
    }

    Notifications.requestPermissionIfLoggedIn()
  }

  componentDidMount() {
    setTimeout(() => {
      this._getVenueLocations()
    }, 1000)

    this._checkForReviews()

    if (global.General.InitialOrder) {
      Navigation.showModal({
        screen: global.Screens.OrderDetails,
        passProps: { order: global.General.InitialOrder }
      })
      global.General.InitialOrder = null
    }
  }

  _checkForReviews() {
    Backend.getOrderPendingReview().then(order => {
      if (order == null) {
        return
      }
      this.setState({ order, orderReviewModalVisible: true })
    })
  }

  _goToMenu(venue) {
    this.props.navigator.push({
      screen: global.Screens.Menu,
      passProps: {
        venue
      }
    })
  }

  _goToVenues(filters) {
    this.props.navigator.push({
      screen: global.Screens.Venues,
      passProps: {
        filters
      }
    })
  }

  _getButtonTitle() {
    let { venueLocations } = this.state
    let count = venueLocations.length
    let title = 'Order from '
    if (count > 0) {
      title += count
    }
    title += ' Restaurants'
    return title
  }

  _goToProfile() {
    this.props.navigator.push({
      screen: global.Screens.Profile
    })
  }

  _getVenueLocations() {
    let { currentUserLocation, venuesMapLoading } = this.state
    if (venuesMapLoading) {
      return
    }

    this.setState({ venuesMapLoading: true })
    Backend.getVenueLocations(currentUserLocation)
      .then(venues => {
        let venueLocations = venues.map(venue => {
          let location = {
            longitude: venue.location.longitude,
            latitude: venue.location.latitude,
            title: venue.title
          }
          return location
        })

        this.setState({ venueLocations, venuesMapLoading: false })
      })
      .catch(error => {
        this.setState({ venuesMapLoading: false })
        console.log(error)
      })
  }

  _renderProfileIcon() {
    if (!AuthManager.isAuthenticated()) {
      return null
    }
    return (
      <TouchableOpacity
        style={mainStyles.profileButton}
        onPress={() => this._goToProfile()}
      >
        <Image source={PROFILE}></Image>
      </TouchableOpacity>
    )
  }

  _renderDeliveryTextField() {
    return (
      <View style={{ flexGrow: 1, marginLeft: 20, marginRight: 20 }}>
        <LocationSearch
          ref={locationField => (this.locationField = locationField)}
          onPlaceSelected={location => {
            let currentUserLocation = {
              longitude: location.longitude,
              latitude: location.latitude
            }

            AuthManager.setCurrentUserLocation(currentUserLocation)
            this.setState({ currentUserLocation }, () => {
              this._getVenueLocations()
            })
          }}
        />
      </View>
    )
  }

  _renderTopRatedList() {
    let endpoint = Backend.getTopVenuesEndpoint()

    return (
      <LazyLoadingFlatList
        ref={list => (this.list = list)}
        endpoint={endpoint}
        horizontal={true}
        contentContainerStyle={{
          paddingRight: 20
        }}
        style={{ paddingLeft: 10 }}
        showsHorizontalScrollIndicator={false}
        ListEmptyComponent={() => {
          if (!this.list || this.list.lazyLoader.isLoading()) {
            return null
          }

          return (
            <NoResult style={{ marginTop: 20 }} title="No venues to show" />
          )
        }}
        renderItem={({ item }) => {
          return (
            <TopRatedFeedListItem
              title={item.title}
              rating={item.average_rating}
              totalRating={item.total_ratings}
              image={item.logo.banner}
              onPress={() => this._goToMenu(item)}
            />
          )
        }}
      />
    )
  }

  _renderCategoryList() {
    return (
      <LazyLoadingFlatList
        ref={list => (this.list = list)}
        endpoint={global.Api.Categories}
        horizontal={true}
        contentContainerStyle={{
          paddingRight: 20
        }}
        style={{ paddingLeft: 10 }}
        showsHorizontalScrollIndicator={false}
        ListEmptyComponent={() => {
          if (!this.list || this.list.lazyLoader.isLoading()) {
            return null
          }

          return (
            <NoResult style={{ marginTop: 20 }} title="No venues to show" />
          )
        }}
        renderItem={({ item }) => {
          return (
            <CategoryFeedListItem
              title={item.title}
              image={item.image.banner}
              onPress={() => {
                let filters = { categories: item.id }
                this._goToVenues(filters)
              }}
            />
          )
        }}
      />
    )
  }

  render() {
    let { currentUserLocation, venueLocations, venuesMapLoading } = this.state

    return (
      <View style={styles.mainContainer}>
        <Map
          type="full"
          latitude={currentUserLocation.latitude}
          longitude={currentUserLocation.longitude}
          locations={venueLocations}
          loading={venuesMapLoading}
        />
        {this._renderProfileIcon()}
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
          style={styles.scroll}
        >
          {this._renderDeliveryTextField()}
          <Button
            title={this._getButtonTitle()}
            style={styles.button}
            onPress={() => this._goToVenues()}
          />
          <FeedListTitle
            title="Top Rated"
            onPress={() => {
              let filters = {
                order_by: 'average_rating',
                order_direction: 'desc'
              }
              this._goToVenues(filters)
            }}
          />
          {this._renderTopRatedList()}
          <FeedListTitle title="In the mood for" showIcon={false} />
          {this._renderCategoryList()}
        </KeyboardAwareScrollView>
        <ReviewVenueModal
          visible={this.state.orderReviewModalVisible}
          order={this.state.order}
          onReviewSubmitted={() =>
            this.setState({ orderReviewModalVisible: false })
          }
          onReviewSkipped={() =>
            this.setState({ orderReviewModalVisible: false })
          }
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flexGrow: 1,
    backgroundColor: global.Colors.ScreenBackground
  },
  scrollContainer: { paddingBottom: 50 },
  scroll: {
    flex: 1,
    paddingTop: 10
  },
  button: {
    marginTop: 15,
    marginRight: 20,
    marginLeft: 20
  }
})
