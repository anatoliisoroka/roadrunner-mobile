import React, { Component } from 'react'
import { StyleSheet, View, Text } from 'react-native'

import Button from 'apsl-react-native-button'

type Props = {}
export default class Counter extends Component<Props> {
  constructor(props) {
    super(props)
    this.state = {
      value: props.value
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps)
  }

  _decreaseValue() {
    let value = this.state.value
    value -= 1
    if (value == 0) {
      return
    }
    this.setState({ value }, () => this.props.valueChanged(this.state.value))
  }

  _increaseValue() {
    let value = this.state.value
    value += 1
    this.setState({ value }, () => this.props.valueChanged(this.state.value))
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <Button
          style={styles.button}
          textStyle={styles.buttonText}
          onPress={() => this._decreaseValue()}
        >
          -
        </Button>
        <Text style={styles.value}>{this.state.value}</Text>
        <Button
          style={styles.button}
          textStyle={styles.buttonText}
          onPress={() => this._increaseValue()}
        >
          +
        </Button>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  button: {
    width: 100,
    borderRadius: 20,
    backgroundColor: global.Colors.Primary
  },
  buttonText: {
    color: 'white',
    fontSize: 30,
    fontWeight: '600'
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    color: 'black',
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10
  }
})

Counter.defaultProps = {
  value: 1
}
