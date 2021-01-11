import React, { Component } from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native'

import DateTime from '../../utils/DateTime'

type Props = {}
export default class OrderHeader extends Component<Props> {
  constructor(props) {
    super(props)
    this.state = {
      venue: props.venue,
      isDeliverSelected: props.isDeliverSelected,
      selectedDate: props.selectedDate
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps)
  }

  _renderBannerImage() {
    return (
      <View>
        <Image
          style={styles.image}
          source={{ uri: this.state.venue.logo.banner }}
        />
        <View style={styles.imageOverlay}></View>
      </View>
    )
  }

  _renderArrivalText() {
    let { isDeliverSelected } = this.state
    return isDeliverSelected ? 'Delivery For:' : 'Collection For:'
  }

  _getTitle() {
    let { selectedDate } = this.state
    if(!selectedDate){
      selectedDate = DateTime.getMinutesFromNow(5)
    }
    return DateTime.getDayTimeTitle(selectedDate)
  }

  _renderArrivalContainer() {
    return (
      <View style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.text}>{this._renderArrivalText()}</Text>
          <Text style={[styles.text, styles.timeText]}>{this._getTitle()}</Text>
        </View>
        <View style={styles.rightContainer}>
          <TouchableOpacity onPress={this.props.onPress}>
            <Text style={styles.text}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render() {
    return (
      <View>
        {this._renderBannerImage()}
        {this._renderArrivalContainer()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 110,
    left: 0,
    height: 200,
    width: '100%'
  },
  centerContainer: { alignSelf: 'center' },
  rightContainer: {
    alignSelf: 'flex-end',
    right: 20,
    bottom: 24
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center'
  },
  timeText: { marginTop: 5, fontSize: 24, fontWeight: '800' },
  image: {
    height: 200,
    width: '100%'
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 200,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  }
})
