import React, { Component } from 'react'
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native'
import Text from 'react-native-text'

import Price from '../../utils/Price'

export default class MenuListItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      item: props.item,
      currency: props.currency
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps)
  }

  _renderPrices(item) {
    let specialPriceText = null
    let currentPriceText = this._renderPrice(styles.price, item.price)
    if (item.special_offer) {
      currentPriceText = this._renderPrice(
        [styles.lineThrough, styles.price],
        item.price
      )
      specialPriceText = this._renderPrice([styles.price], item.reduced_price)
    }
    return (
      <View style={{ flexDirection: 'row' }}>
        {currentPriceText}
        {specialPriceText}
      </View>
    )
  }

  _renderPrice(textStyle, price) {
    return <Text style={textStyle}>{this._formatPrice(price)}</Text>
  }

  _formatPrice(price) {
    let { currency } = this.state
    return Price.format(price, currency)
  }

  _renderImage(item) {
    if (item.image == null) {
      return null
    }

    return (
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: item.image.banner }} />
      </View>
    )
  }

  _renderDescription(item) {
    if (item.description == null) {
      return null
    }
    return <Text numberOfLines={1} style={styles.description}>{item.description}</Text>
  }

  render() {
    let { item } = this.state
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={styles.mainContainer}>
          <View style={styles.textContainer}>
            <Text numberOfLines={2} style={styles.title}>{item.title}</Text>
            {this._renderDescription(item)}
            {this._renderPrices(item)}
          </View>
          {this._renderImage(item)}
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 40,
    marginRight: 40,
    height: 100
  },
  textContainer: { flex: 1, justifyContent: 'center' },
  title: {
    fontSize: 15,
    fontWeight: '500',
    marginTop: 10,
    marginRight: 10
  },
  description: {
    fontSize: 13,
    marginTop: 10,
    color: '#909090',
    marginBottom: 10
  },
  imageContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 10
  },
  image: { width: 80, height: 80 },
  lineThrough: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    textDecorationColor: 'red',
    marginRight: 10
  },
  price: {
    fontSize: 16,
    fontWeight: '600'
  }
})
