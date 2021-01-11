import React, { Component } from 'react'
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native'
import Text from 'react-native-text'
import { Icon } from 'react-native-elements'

import DateTime from '../../utils/DateTime'
import Price from '../../utils/Price'

import textStyles from '../../assets/css/text'

export default class OrderListItem extends Component {
  constructor(props) {
    super(props)
    this.state = { orderItem: props.orderItem }
  }

  _renderDateTime() {
    return (
      <View style={styles.row}>
        <Text style={styles.text}>
          {DateTime.formatDateTime(this.state.orderItem.created_at)}
        </Text>
      </View>
    )
  }

  _renderPrice() {
    let { total_price, currency } = this.state.orderItem
    return Price.format(total_price, 'eur')
  }

  render() {
    let { orderItem } = this.state
    return (
      <TouchableOpacity
        style={[styles.main, styles.separator]}
        onPress={this.props.onPress}
      >
        <View>
          {this._renderDateTime()}
          <Text style={styles.title}>
            {orderItem.venue.title} -{' '}
            {orderItem.data.venue_location.address_line_1}
          </Text>
          <Text style={[styles.text, styles.textPrice]}>
            {this._renderPrice()}
          </Text>
        </View>
        <View style={styles.chevronContainer}>
          <Icon
            name="chevron-right"
            type="octicon"
            size={30}
            color={global.Colors.Primary}
          />
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 0,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    padding: 5
  },
  row: { flexDirection: 'row' },
  text: {
    marginBottom: 5,
    color: '#4A4A4A'
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5
  },
  textPrice: { marginBottom: 10 },
  chevronContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: 20
  },
  deleteText: {
    color: global.Colors.Secondary,
    marginTop: 5,
    marginRight: 10
  },
  separator: {
    marginTop: 10,
    marginBottom: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  }
})
