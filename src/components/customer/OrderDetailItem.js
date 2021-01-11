import React, { Component } from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import ViewMoreText from 'react-native-view-more-text'
import UIStepper from '../../components/customer/UIStepper'

import Price from '../../utils/Price'

const PLUS = require('../../assets/icons/plus-icon.png')
const MINUS = require('../../assets/icons/minus-icon.png')

type Props = {}
export default class OrderDetailItem extends Component<Props> {
  constructor(props) {
    super(props)
    this.state = {
      item: { ...props.item },
      singlePrice: 0,
      price: 0,
      canUpdate: props.canUpdate
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps, () => {
      this._setPrice()
    })
  }

  componentDidMount() {
    this._setPrice()
  }

  _getAdditionalCost() {
    let additionalCost = 0
    let { option_groups } = this.state.item
    option_groups.map(option_group => {
      option_group.options.map(option => {
        if (option.price == null) {
          return
        }
        let quantityPrice = option.price * option.quantity
        additionalCost += quantityPrice
      })
    })
    return additionalCost
  }

  _setPrice() {
    let { price, quantity } = this.state.item

    let extraCost = this._getAdditionalCost()
    let singlePrice = price + extraCost
    this.setState({
      singlePrice,
      price: singlePrice * quantity
    })
  }

  _renderOrderItems() {
    let { option_groups } = this.state.item
    if (option_groups === null) {
      return null
    }
    return option_groups.map(option_group => {
      return option_group.options.map(option => {
        return <Text style={styles.orderItem}>{option.title + '\n'}</Text>
      })
    })
  }

  _renderPrice(price) {
    let { currency } = this.props
    return Price.format(price, currency)
  }

  updateValues(quantity) {
    let price = this.state.singlePrice * quantity
    this.props.onPriceChanged(this.state.item, quantity)
    this.setState({
      quantity,
      price
    })
  }

  _renderStepper() {
    if (this.state.canUpdate === false) {
      return null
    }
    return (
      <View style={styles.stepperContainer}>
        <UIStepper
          onValueChange={quantity => {
            this.updateValues(quantity)
          }}
          borderWidth={0}
          textColor={global.Colors.Primary}
          tintColor={global.Colors.Primary}
          initialValue={this.state.item.quantity}
          displayValue={true}
          fontSize={14}
          value={this.state.item.quantity}
          incrementImage={PLUS}
          decrementImage={MINUS}
          width={70}
          height={25}
        />
      </View>
    )
  }

  _renderQuantity() {
    if (this.state.canUpdate === true) {
      return null
    }
    return (
      <Text onPress={this.props.onPress} style={styles.quantityText}>
        {this.state.item.quantity}x
      </Text>
    )
  }

  renderSeeMore(onPress) {
    return (
      <Text style={{ color: global.Colors.Primary }} onPress={onPress}>
        See more
      </Text>
    )
  }
  renderSeeLess(onPress) {
    return (
      <Text style={{ color: global.Colors.Primary }} onPress={onPress}>
        See less
      </Text>
    )
  }

  render() {
    return (
      <View style={styles.row}>
        <View style={styles.orderItemContainer}>
          {this._renderStepper()}
          {this._renderQuantity()}
          <View style={{ flex: 1 }}>
            <Text style={styles.orderItemTitle}>{this.state.item.title}</Text>
            <ViewMoreText
              numberOfLines={this.props.numberOfLines}
              renderViewMore={this.renderSeeMore}
              renderViewLess={this.renderSeeLess}
            >
              {this._renderOrderItems()}
            </ViewMoreText>
          </View>
        </View>
        <View>
          <Text style={styles.price}>
            {this._renderPrice(this.state.price)}
          </Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 10
  },
  quantityText: {
    color: global.Colors.Primary,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10
  },
  orderItemContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  orderItemTitle: {
    flex: 1,
    flexWrap: 'wrap',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5
  },
  orderItem: {
    flexWrap: 'wrap',
    color: '#909090'
  },
  price: {
    paddingLeft: 5,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right'
  },
  stepperContainer: {
    marginRight: 15,
    justifyContent: 'flex-start'
  }
})

OrderDetailItem.defaultProps = {
  canUpdate: false,
  onPriceChanged: () => {},
  numberOfLines: 3
}
