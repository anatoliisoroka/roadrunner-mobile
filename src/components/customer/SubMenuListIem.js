import React, { Component } from 'react'
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native'
import Text from 'react-native-text'

import Price from '../../utils/Price'

const DEFAULT_QUANTITY = 1

export default class SubMenuListItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      item: props.item,
      section: props.section,
      currency: props.currency,
      selected: false,
      quantity: 0
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps)
  }

  _formatPrice(price) {
    let { currency } = this.state
    return Price.format(price, currency)
  }

  _itemSelected() {
    let { selected, section } = this.state
    if (selected) {
      this.props.onItemUnselected(section)
    } else {
      this.props.onItemSelected(section)
    }
  }

  _renderPrice() {
    let { price } = this.state.item
    if (price == 0) {
      return null
    }
    let priceText = ' + (' + this._formatPrice(price) + ')'

    return <Text style={styles.text}>{priceText}</Text>
  }

  render() {
    let { item } = this.state
    return (
      <TouchableOpacity onPress={() => this._itemSelected()}>
        <View
          style={[
            styles.mainContainer,
            this.state.selected ? styles.selected : styles.item
          ]}
        >
          <Text style={styles.text}>{item.title}</Text>
          {this._renderPrice()}
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    height: 50,
    alignItems: 'center',
    paddingLeft: 20,
    flexDirection: 'row'
  },
  text: {
    paddingLeft: 20,
    fontWeight: '600'
  },
  item: {
    backgroundColor: 'white'
  },
  selected: {
    backgroundColor: '#d6cde8'
  }
})
