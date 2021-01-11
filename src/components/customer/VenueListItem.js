import React, { Component } from 'react'
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native'
import Text from 'react-native-text'

import Ratings from '../../utils/Ratings'
import Price from '../../utils/Price'

export default class VenueListItem extends Component {
  constructor(props) {
    super(props)
    this.state = { venue: this.props.venue }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps)
  }

  _showRating() {
    return (
      <Text style={[styles.text, { marginTop: 5 }]}>
        {Ratings.format(this.state.venue.total_ratings)}
      </Text>
    )
  }

  _renderPrice(price) {
    let { currency } = this.state.venue
    return Price.format(price, currency)
  }

  _renderCategories() {
    let categoryTitles = this.state.venue.categories.map(category => {
      return category.title
    })

    let categoriesString = categoryTitles.join(', ')
    return (
      <Text numberOfLines={1} style={styles.categoryText}>
        {categoriesString}
      </Text>
    )
  }

  _renderImage() {
    return (
      <Image
        style={{ width: 140, height: 115 }}
        source={{ uri: this.state.venue.logo.thumbnail }}
      />
    )
  }

  render() {
    let { venue } = this.state
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={styles.container}>
          <View style={styles.row}>
            {this._renderImage()}
            <View style={styles.column}>
              <Text style={styles.title} numberOfLines={2}>
                {venue.title}
              </Text>
              <View style={styles.row}>
                <Text style={styles.ratingText}>
                  {Ratings.round(venue.average_rating)} Rating
                </Text>
                {this._showRating()}
              </View>
              <View style={[styles.row, { marginTop: 5 }]}>
                <Text style={styles.text}>Min Delivery: </Text>
                <Text style={styles.delivery}>
                  {this._renderPrice(venue.minimum_order_amount)}
                </Text>
              </View>
              {this._renderCategories()}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 20, marginLeft: 10, height: 115 },
  row: { flexDirection: 'row' },
  column: { flex: 1, flexDirection: 'column', marginLeft: 20 },
  title: { fontSize: 17, fontWeight: '700', marginTop: 5 },
  ratingText: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 5,
    marginRight: 3,
    color: global.Colors.Primary
  },
  categoryText: {
    fontSize: 13,
    color: '#909090',
    marginTop: 10,
    marginRight: 5
  },
  text: { fontSize: 13, fontWeight: '300' },
  delivery: { fontSize: 13, fontWeight: '300', marginLeft: 5 }
})
