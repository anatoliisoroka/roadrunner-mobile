import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SectionList,
  SafeAreaView,
  Platform,
  Alert,
  PixelRatio
} from 'react-native'
import ParallaxScrollView from 'react-native-parallax-scroll-view'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ScrollingMenu from 'react-native-scrolling-menu'
import ReviewVenueModal from '../../components/customer/ReviewVenueModal'
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout'

import SlideInView from '../../components/customer/SlideInView'
import Button from '../../components/shared/Button'
import LoadingView from '../../components/shared/LoadingView'
import MenuListItem from '../../components/customer/MenuListItem'
import Hr from '../../components/shared/Hr'

import Ratings from '../../utils/Ratings'
import Price from '../../utils/Price'

import BasketManager from '../../utils/BasketManager'
import Backend from '../../utils/Backend'
import MockData from '../../utils/MockData'
import AuthManager from '../../utils/AuthManager'

import screenStyles from '../../assets/css/screens'
import { ifIphoneX } from 'react-native-iphone-x-helper'

const STICKY_HEADER_HEIGHT = 60
const BACK_BUTTON = require('../../assets/icons/back.png')

type Props = {}
export default class Menu extends Component {
  static navigatorStyle = global.Screens.PrimaryNavBar

  constructor(props) {
    super(props)
    this.state = {
      venue: props.venue,
      isLoading: false,
      isDeliverSelected: props.isDeliverSelected,
      selectedDate: props.selectedDate,
      menu: null,
      images: [],
      items: [],
      menuVisible: false,
      basket: BasketManager.get(),
      parallaxHeaderHeight: 400,
      orderReviewModalVisible: false,
      order: null
    }
    this.props.navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this))
    this.getItemLayout = sectionListGetItemLayout({
      // The height of the row with rowData at the given sectionIndex and rowIndex
      getItemHeight: (rowData, sectionIndex, rowIndex) => 110,
      // These three properties are optional
      getSeparatorHeight: () => 1 / PixelRatio.get(), // The height of your separators
      getSectionHeaderHeight: () => 80 // The height of your section headers
    })
  }

  _onNavigatorEvent(event) {
    if (event.id == 'back') {
      this._onBackButtonPressed()
    }
    if (event.id == 'profile') {
      this.props.navigator.push({
        screen: global.Screens.Profile
      })
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.navigator.setTitle({ title: 'Menu' })
      this._setupProfileButton()
    }, 500)
    this._checkForReviews()
    this._getVenueDetailsById()
  }

  _checkForReviews() {
    Backend.getOrderPendingReview().then(order => {
      if (order == null) {
        return
      }
      this.setState({ order, orderReviewModalVisible: true, venue: null })
    })
  }

  _setupProfileButton() {
    if (!AuthManager.isAuthenticated()) {
      return null
    }
    this.props.navigator.setButtons({
      rightButtons: [
        {
          id: 'profile',
          title: 'Profile'
        }
      ]
    })
  }

  _onBackButtonPressed() {
    if (BasketManager.isEmpty()) {
      this.props.navigator.pop()
      return
    }
    this._showExistingBasketAlert()
  }

  _showExistingBasketAlert() {
    Alert.alert(
      'Existing Basket',
      'You will lose your basket. Do you want to continue?',
      [
        {
          text: 'Yes',
          onPress: () => {
            BasketManager.clear()
            let basket = BasketManager.get()
            this.setState({ basket })
            this.props.navigator.pop()
          }
        },
        {
          text: 'No',
          style: 'cancel'
        }
      ]
    )
  }

  _renderPrice(price) {
    let { currency } = this.state.venue
    return Price.format(price, currency)
  }

  _getVenueDetailsById() {
    console.log("FETCHING DETAILS");
    let { venue, isLoading } = this.state

    if (isLoading) {
      return
    }
    let venueId = global.Api.IsDebug ? 63 : 4
    this.setState({ isLoading: true })
    Backend.getVenueDetailsById(venueId)
      .then(venue => {
        this.setState({ venue, isLoading: false }, () => {
          this._loadMenu()
        })
      })
      .catch(error => {
        alert('Venue Not Found', error.message)
        this.setState({ isLoading: false, showLocationModal: true })
      })
  }

  _getVenueDetails() {
    let { venue, isLoading } = this.state

    if (isLoading) {
      return
    }
    this.setState({ isLoading: true })
    Backend.getVenueDetails(venue)
      .then(venue => {
        this.setState({ venue, isLoading: false })
      })
      .catch(error => {
        //alert('Venue Not Found', error.message)
        this.setState({ isLoading: false })
      })
  }

  _setBannerImages() {
    let { venue } = this.state
    let images = []
    venue.images.map(image => {
      images.push(image.banner)
    })
    this.setState({ images })
  }

  _loadMenu() {
    let { venue, isLoading } = this.state
    let menus = venue.menus

    if (isLoading) {
      return
    }

    this.setState({ isLoading: true })
    Backend.getMenu(menus)
      .then(menu => {
        this.setState(
          {
            menu,
            isLoading: false
          },
          () => {
            //this._getVenueDetails()
            this._setMenuItems()
          }
        )
      })
      .catch(error => {
        this.setState({ isLoading: false })
        alert('ERROR', error.message)
      })
  }

  _setMenuItems() {
    let items = []
    this.state.menu.sections.map(section => {
      items.push(section.title)
    })
    this.setState({ items })
  }

  _getSections(menu) {
    return menu.sections.map(section => {
      return {
        title: section.title,
        data: section.items
      }
    })
  }

  _moreInfoPressed() {
    this.props.navigator.push({
      screen: global.Screens.MoreInfo,
      passProps: {
        venue: this.state.venue
      }
    })
  }

  _renderImages() {
    let { images } = this.state.venue

    if (images == null) {
      return null
    }
    let imageStyle =
      images.length > 1 ? styles.multipleBannerImage : styles.singleBannerImage
    return images.map((image, index) => {
      return <Image style={imageStyle} source={{ uri: image.banner }} />
    })
  }

  _renderBanner() {
    return (
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.bannerScroll}
        >
          {this._renderImages()}
        </ScrollView>
      </View>
    )
  }

  _menuSectionSelected(index) {
    if (!index) {
      return
    }
    this.scrollToSection(index)
  }

  _renderMenuSections() {
    return (
      <ScrollingMenu
        items={this.state.items}
        defaultIndex={0}
        onSelect={index => this._menuSectionSelected(index)}
        containerStyle={styles.menuSection}
        itemStyle={styles.menuSectionItem}
        selectedItemStyle={[styles.menuSectionItem, styles.menuSectionSelected]}
      />
    )
  }

  _onBasketUpdated() {
    let basket = BasketManager.get()
    this.setState({ basket })
  }

  _goToSubMenu(item) {
    this.props.navigator.push({
      screen: global.Screens.SubMenu,
      passProps: {
        item,
        venue: this.state.venue,
        menu: this.state.menu,
        onBasketUpdated: () => this._onBasketUpdated()
      }
    })
  }

  _goToBasket() {
    let { isDeliverSelected, selectedDate } = this.state

    this.props.navigator.push({
      screen: global.Screens.Basket,
      passProps: {
        isDeliverSelected,
        selectedDate,
        basketUpdated: () => this._onBasketUpdated()
      }
    })
  }

  scrollToSection(index) {
    if (this.sectionList) {
      this.sectionList.scrollToLocation({
        animated: true,
        sectionIndex: index,
        itemIndex: 0
      })
    }
  }

  _renderRating() {
    let { average_rating } = this.state.venue
    if (average_rating == 0) {
      return 'No Rating'
    }
    return Ratings.round(average_rating) + ' Rating'
  }

  _renderParallaxHeader() {
    return (
      <View
        style={{ backgroundColor: 'white' }}
        onLayout={event => {
          var { x, y, width, height } = event.nativeEvent.layout
          this.setState({ parallaxHeaderHeight: height })
        }}
      >
        {this._renderBanner()}

        <View style={styles.venueContainer}>
          <View style={styles.venueLeftContainer}>
            <Text style={styles.title}>{this.state.venue.title}</Text>
            <View style={styles.row}>
              <Text style={styles.ratingText}>{this._renderRating()}</Text>
              <Text style={styles.reviewText}>
                {Ratings.format(this.state.venue.total_ratings)}
              </Text>
            </View>
            <View style={[styles.row, { marginTop: 5 }]}>
              <Text style={styles.delivery}>Minimum Delivery</Text>
              <Text style={[styles.delivery, { marginLeft: 5 }]}>
                {this._renderPrice(this.state.venue.minimum_order_amount)}
              </Text>
            </View>
          </View>
          <View style={styles.venueRightContainer}>
            <TouchableOpacity onPress={() => this._moreInfoPressed()}>
              <Text style={styles.moreText}>More Info</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  _handleScroll(event) {
    let { parallaxHeaderHeight } = this.state
    if (parallaxHeaderHeight == 0) {
      return
    }
    if (event.nativeEvent.contentOffset.y <= parallaxHeaderHeight) {
      if (this.state.menuVisible != false) {
        this.setState({ menuVisible: false })
      }
    }
    if (event.nativeEvent.contentOffset.y > parallaxHeaderHeight) {
      if (this.state.menuVisible != true) {
        this.setState({ menuVisible: true })
      }
    }
  }

  _renderParallaxScrollView(props) {
    return (
      <ParallaxScrollView
        onScroll={props.onScroll}
        backgroundColor="#fff"
        fadeOutForeground={false}
        parallaxHeaderHeight={this.state.parallaxHeaderHeight}
        renderForeground={() => this._renderParallaxHeader()}
      />
    )
  }

  _renderMenu() {
    const { onScroll = () => {} } = this.props
    let { menu } = this.state
    if (menu === null) {
      return null
    }
    return (
      <SectionList
        ref={sectionList => {
          this.sectionList = sectionList
        }}
        getItemLayout={this.getItemLayout}
        onScroll={event => this._handleScroll(event)}
        stickySectionHeadersEnabled={false}
        renderScrollComponent={props => this._renderParallaxScrollView(props)}
        sections={this._getSections(menu)}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.headerTitle}>{title}</Text>
        )}
        renderItem={({ item, index, section }) => (
          <MenuListItem
            item={item}
            currency={this.state.menu.currency}
            onPress={() => this._goToSubMenu(item)}
          />
        )}
        ItemSeparatorComponent={() => <Hr style={styles.hr} />}
        keyExtractor={(item, index) => item + index}
      />
    )
  }

  _renderBasketButton() {
    let { basket, venue } = this.state
    if (!basket) {
      return null
    }
    if (!venue) {
      return null
    }
    if (basket.items.length <= 0) {
      return null
    }
    if (!basket.venue.id) {
      return null
    }
    if (basket.venue.id != venue.id) {
      return null
    }
    return (
      <View style={styles.buttonContainer}>
        <Button
          title="Go to Basket"
          type="primary"
          style={styles.button}
          onPress={() => this._goToBasket()}
        />
      </View>
    )
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        {this._renderMenu()}
        {this._renderBasketButton()}
        <LoadingView isLoading={this.state.isLoading} size="small" />
        <SlideInView
          show={this.state.menuVisible}
          content={this._renderMenuSections()}
        />
        <ReviewVenueModal
          visible={this.state.orderReviewModalVisible}
          order={this.state.order}
          onReviewSubmitted={() =>
            this.setState({ orderReviewModalVisible: false }, () =>
              this._getVenueDetailsById())
          }
          onReviewSkipped={() =>
            this.setState({ orderReviewModalVisible: false })
          }
        />
      </View>
    )
  }
}

Menu.defaultProps = {
  isDeliverySelected: true,
  selectedDate: null
}

const text = {
  fontSize: 14,
  fontWeight: '400'
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: global.Colors.ScreenBackground
  },
  venueContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  venueLeftContainer: {
    flexShrink: 4,
    flexDirection: 'column'
  },
  venueRightContainer: {
    marginTop: 5,
    marginBottom: 5
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  multipleBannerImage: {
    width: global.Sizes.SCREEN_WIDTH * 0.9,
    marginRight: 5
  },
  singleBannerImage: {
    width: global.Sizes.SCREEN_WIDTH
  },
  bannerScroll: {
    marginBottom: 0,
    height: 195
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 5
  },
  ratingText: {
    fontSize: 17,
    color: global.Colors.Primary
  },
  reviewText: {
    fontSize: 17,
    fontWeight: '100',
    marginLeft: 5
  },
  moreText: {
    ...text,
    fontWeight: '600',
    color: global.Colors.Primary
  },
  menuSection: {
    marginTop: 20,
    backgroundColor: 'white'
  },
  menuSectionItem: {
    fontSize: 18,
    fontWeight: '700',
    height: 60,
    color: '#909090',
    paddingLeft: 20
  },
  menuSectionSelected: {
    color: global.Colors.Primary
  },
  headerTitle: {
    color: '#909090',
    backgroundColor: 'white',
    fontSize: 16,
    fontWeight: '700',

    marginLeft: 20
  },
  hr: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 40,
    marginRight: 40
  },
  button: { marginLeft: 40, marginRight: 40 },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: '#f7f7f7',
    ...ifIphoneX(
      {
        height: 70
      },
      {
        height: 60
      }
    ),
    justifyContent: 'center'
  },
  parallaxHeader: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    paddingTop: 100
  },
  stickySection: {
    height: STICKY_HEADER_HEIGHT,
    backgroundColor: 'white',
    width: '100%',
    justifyContent: 'flex-end'
  }
})
