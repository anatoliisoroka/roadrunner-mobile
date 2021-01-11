import React, { Component } from 'react'
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native'
import Text from 'react-native-text'

import TextFormat from '../../utils/TextFormat'

import textStyles from '../../assets/css/text'

export default class PaymentListItem extends Component {
  constructor(props) {
    super(props)
    this.state = { card: props.card, showDelete: props.showDelete }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps)
  }

  _renderMakeDefaultButton() {
    if (this.state.card.is_default) {
      return null
    }
    return (
      <TouchableOpacity onPress={this.props.onMakeDefaultPress}>
        <Text style={styles.button}>Make Default</Text>
      </TouchableOpacity>
    )
  }
  _renderDeleteButton() {
    if (!this.state.showDelete) {
      return null
    }
    return (
      <TouchableOpacity onPress={this.props.onDeletePress}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    )
  }

  _renderCardName() {
    let { name } = this.state.card
    if (!name) {
      return null
    }
    return <Text style={styles.text}>{name}</Text>
  }

  render() {
    let { card } = this.state
    return (
      <View style={styles.main}>
        <View>
          {this._renderCardName()}
          <Text style={{ marginBottom: 5 }}>
            {TextFormat.capitalizeFirst(card.brand)}
          </Text>
          <Text style={{ marginBottom: 5 }}>
            ●●●● - ●●●● - ●●●● - {card.last_four}
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <Text>
              {card.expiry_month}
              {'/'}
            </Text>
            <Text>{card.expiry_year}</Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          {this._renderDeleteButton()}
          {this._renderMakeDefaultButton()}
        </View>
      </View>
    )
  }
}

PaymentListItem.defaultProps = {
  showDelete: true
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 8,
    marginRight: 5,
    padding: 5,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fafafa'
  },
  text: { marginTop: 5, marginBottom: 5, color: '#4A4A4A' },
  buttonContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 5
  },
  deleteText: {
    color: global.Colors.Secondary,
    marginRight: 5
  },
  button: {
    color: global.Colors.Primary,
    marginRight: 5
  }
})
