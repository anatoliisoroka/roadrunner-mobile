import React, { Component } from 'react'
import { StyleSheet, Text, View, SafeAreaView } from 'react-native'

import SegmentedControl from '../shared/SegmentedControl'

import List from '../../utils/List'

const DELIVER = 'Deliver'
const COLLECT = 'Collect'
const DATA = [DELIVER, COLLECT]

export default class DeliverCollectSegmentedControl extends Component {
  constructor(props) {
    super(props)
    let isDeliverSelected = this._getDeliverSelected(props)
    let selectedIndex = this._getSelectedIndex(isDeliverSelected)

    this.state = {
      isDeliverSelected,
      venue: props.venue,
      data: DATA,
      selectedIndex
    }
  }

  _getDeliverSelected(props) {
    let isDeliverSelected = props.isDeliverSelected
    let venue = props.venue

    if (!venue) {
      return isDeliverSelected
    }
    if (isDeliverSelected && !venue.delivery) {
      this.props.onChange(false)
      return false
    }
    if (!isDeliverSelected && !venue.collection) {
      this.props.onChange(true)
      return true
    }

    return isDeliverSelected
  }

  _getSelectedIndex(isDeliverSelected) {
    let selectedItem = isDeliverSelected ? DELIVER : COLLECT
    let selectedIndex = List.indexOf(DATA, selectedItem)
    return selectedIndex
  }

  _onChange() {
    let { selectedIndex, data } = this.state
    let selectedItem = data[selectedIndex]
    let isDeliverSelected = selectedItem == DELIVER

    this.setState({ isDeliverSelected }, () => {
      this.props.onChange(isDeliverSelected)
    })
  }

  _isDisabled() {
    let { venue } = this.state

    if (!venue) {
      return false
    }

    if (venue.delivery && venue.collection) {
      return false
    }

    return true
  }

  render() {
    let { data, selectedIndex } = this.state
    return (
      <SegmentedControl
        buttons={data}
        selectedIndex={selectedIndex}
        disabled={this._isDisabled()}
        onPress={selectedIndex => {
          this.setState(
            {
              selectedIndex
            },
            () => {
              this._onChange()
            }
          )
        }}
      />
    )
  }
}

DeliverCollectSegmentedControl.defaultProps = {
  isDeliverSelected: true,
  venue: null,
  onChange: () => {}
}
