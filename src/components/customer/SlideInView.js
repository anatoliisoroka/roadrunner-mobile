import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Animated,
  TouchableOpacity
} from 'react-native'

type Props = {}
export default class SlideInView extends Component<Props> {
  constructor(props) {
    super(props)
    this.state = {
      top: new Animated.Value(-props.height * 3)
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps)
  }

  componentDidMount() {}

  toggleModal() {
    if (!this.props.show) {
      return
    }
    Animated.timing(this.state.top, {
      toValue: 0,
      duration: this.props.duration
    }).start()
  }

  closeModal() {
    if (this.props.show) {
      return
    }
    Animated.timing(this.state.top, {
      toValue: -this.props.height * 3,
      duration: this.props.duration
    }).start()
  }

  render() {
    this.toggleModal()
    this.closeModal()
    return (
      <Animated.View
        style={[
          styles.mainContainer,
          { height: this.props.height, top: this.state.top }
        ]}
      >
        {this.props.content}
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    zIndex: 2,
    width: '100%',
    backgroundColor: 'white',
    position: 'absolute'
  }
})

SlideInView.defaultProps = {
  height: 60,
  duration: 200
}
