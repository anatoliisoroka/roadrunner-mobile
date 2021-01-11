import React, { Component } from 'react'
import {
  StyleSheet,
  Platform,
  View,
  Text,
  Image,
  TextInput
} from 'react-native'

import moment from 'moment'

import Map from '../../components/shared/Map'
import Button from '../../components/shared/Button'
import LocationFormat from '../../utils/LocationFormat'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Ratings from '../../utils/Ratings'
import String from '../../utils/String'
import AuthManager from '../../utils/AuthManager'

import screenStyles from '../../assets/css/screens'

type Props = {}
export default class MoreInfo extends Component {
  static navigatorStyle = global.Screens.PrimaryNavBar
  constructor(props) {
    super(props)
    this.state = {
      venue: props.venue,
      user: AuthManager.getCurrentUser()
    }
  }

  componentDidMount() {
    this.props.navigator.setTitle({ title: 'More Info' })
  }

  _goTo() {
    this.props.navigator.push({
      screen: global.Screens.Feedback
    })
  }

  _renderRating() {
    let { average_rating } = this.state.venue
    if (average_rating == 0) {
      return 'No Rating'
    }
    return Ratings.round(average_rating) + ' Rating'
  }

  _renderHeader() {
    let { venue } = this.state
    return (
      <View style={styles.titleContainer}>
        <View style={styles.leftContainer}>
          <Text style={styles.title}>{venue.title}</Text>
          <View style={styles.row}>
            <Text style={styles.ratingText}>{this._renderRating()}</Text>
            <Text style={styles.reviewText}>
              {Ratings.format(venue.total_ratings)}
            </Text>
          </View>
        </View>
        <View style={styles.rightContainer}>
          <Text style={styles.grayText}>{this._renderCategories()}</Text>
        </View>
      </View>
    )
  }

  _renderCategories() {
    let categoryTitles = this.state.venue.categories.map(category => {
      return category.title
    })
    let categoriesString = categoryTitles.join(' ')
    return (
      <Text numberOfLines={3} style={styles.grayText}>
        {categoriesString}
      </Text>
    )
  }

  _renderOpeningHours(hours) {
    return hours.map(hour => {
      return (
        <View style={styles.hoursContainer}>
          <Text style={styles.day}>• {String.capitalize(hour.day)}</Text>
        </View>
      )
    })
  }

  _renderFeedback() {
    let { user } = this.state

    if (!user) {
      return null
    }

    return (
      <View style={styles.feedbackContainer}>
        <Text style={styles.text}>Have feedback about the app?</Text>
        <Button
          type="secondary"
          style={{ marginTop: -5 }}
          title="Help us improve it, let us know"
          onPress={() => this._goTo()}
        />
      </View>
    )
  }

  render() {
    let { location } = this.state.venue

    return (
      <View style={{ backgroundColor: 'white' }}>
        <KeyboardAwareScrollView contentContainerStyle={styles.mainContainer}>
          {this._renderHeader()}
          <Map
            style={{ borderRadius: 5 }}
            type={'padded'}
            initialPosition={location}
            initialLocationBelongsToVenue={true}
          />
          <Text style={styles.location}>
            {LocationFormat.fullAddress(this.state.venue.location)}
          </Text>
          <Text style={[styles.subtitle, { marginLeft: 20, marginTop: 20, marginBottom: 10}]}>
            Delivery Days
          </Text>
          {this._renderOpeningHours(this.state.venue.opening_hours)}
          {this._renderFeedback()}
        </KeyboardAwareScrollView>
      </View>
    )
  }
}

const text = {
  fontSize: 18,
  color: '#000',
  fontWeight: '600'
}
const styles = StyleSheet.create({
  mainContainer: {
    flexGrow: 1,
    paddingBottom: 20,
    backgroundColor: global.Colors.backgroundColor
  },
  titleContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  leftContainer: {
    flexShrink: 1,
    flexDirection: 'column',
    marginRight: 20
  },
  rightContainer: {
    flexShrink: 2,
    flexWrap: 'wrap'
  },
  feedbackContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 5
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  text: { fontSize: 15 },
  title: {
    fontSize: 25,
    fontWeight: '800',
    marginBottom: 5
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 5
  },
  ratingText: {
    fontSize: 17,
    color: global.Colors.Primary
  },
  reviewText: {
    fontSize: 16,
    fontWeight: '100',
    marginLeft: 5
  },
  grayText: {
    fontSize: 14,
    color: '#909090',
    paddingTop: 3
  },
  location: {
    ...text,
    marginTop: 20,
    marginLeft: 20
  },
  hoursContainer: {
    marginLeft: 20,
    marginBottom: 10
  },
  day: {
    marginLeft: 20,
    fontSize: 18
  },
  open: {
    ...text,
    marginLeft: 40,
    marginBottom: 10
  },
  close: {
    ...text,
    marginBottom: 10
  }
})
