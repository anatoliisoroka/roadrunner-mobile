import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Animated,
  Easing,
  ScrollView,
  Dimensions,
  Platform,
  TouchableOpacity
} from 'react-native'

import Text from 'react-native-text'

import Modal from 'react-native-modal'

import { Picker } from '@react-native-community/picker'

import {
  WheelPicker,
  TimePicker,
  DatePicker
} from 'react-native-wheel-picker-android'

import { Icon } from 'react-native-elements'

import Hr from './Hr'
import TextLabel from './TextLabel'
import PickerField from './PickerField'

import PropTypes from 'prop-types'

import { FormValidationMessage } from 'react-native-elements'

type Props = {}

export default class InLinePicker extends Component<Props> {
  constructor(props) {
    super(props)
    this.state = {}
  }

  _render(picker, selectedValue, index, selectedValues) {
    if (Platform.OS == 'ios') {
      return this._renderIOS(picker, selectedValue, index, selectedValues)
    } else {
      return this._renderAndroid(picker, selectedValue, index, selectedValues)
    }
  }

  _renderIOS(picker, selectedValue, index, selectedValues) {
    return (
      <Picker
        selectedValue={selectedValue}
        style={{
          height: this.props.height,
          width: '100%'
        }}
        onValueChange={(itemValue, itemIndex) => {
          selectedValues = selectedValues || []
          selectedValues[index] = itemValue
          this.props.onValuesChange(selectedValues)
        }}
      >
        {picker.items.map(item => {
          return <Picker.Item label={item.label} value={item.value} />
        })}
      </Picker>
    )
  }

  _renderAndroid(picker, selectedValue, index, selectedValues) {
    let labels = picker.items.map(item => item.label)
    let selectedItemIndex = picker.items.findIndex(
      item => item.value == selectedValue
    )

    let wheelPickerWidth = this.state.containerWidth
      ? this.state.containerWidth / this.props.data.length
      : null
    let wheelPickerStyle = {
      height: 150,
      marginTop: 30
    }
    if (wheelPickerWidth) {
      wheelPickerStyle['width'] = wheelPickerWidth
    }
    return (
      <View
        style={{
          alignItems: 'center',
          flex: 1
        }}
      >
        <WheelPicker
          key={selectedValue}
          selectedItem={selectedItemIndex}
          data={labels}
          indicatorColor={this.props.androidIndicatorColor}
          selectedItemTextSize={22}
          selectedItemTextColor={this.props.androidSelectedTextColor}
          itemTextSize={22}
          onItemSelected={itemIndex => {
            selectedValues = selectedValues || []
            let selectedItem = picker.items[itemIndex]
            let selectedValue = selectedItem ? selectedItem.value : null
            selectedValues[index] = selectedValue
            this.props.onValuesChange(selectedValues)
          }}
          style={wheelPickerStyle}
        />
      </View>
    )
  }
  _renderPickers() {
    let { data, selectedValues } = this.props

    let pickerWidth = `${100 / data.length}%`

    return data.map((picker, index) => {
      let selectedValue = null
      if (selectedValues) {
        selectedValue = selectedValues[index]
      }
      return (
        <View style={[styles.column, this.props.columnStyle]}>
          {picker.label && (
            <Text style={[styles.pickerLabel, this.props.labelStyle]}>
              {picker.label}
            </Text>
          )}
          {this._render(picker, selectedValue, index, selectedValues)}
        </View>
      )
    })
  }

  render() {
    return (
      <View
        style={styles.container}
        onLayout={event => {
          var { x, y, width, height } = event.nativeEvent.layout
          this.setState({ containerWidth: width })
        }}
      >
        {this._renderPickers()}
      </View>
    )
  }
}

InLinePicker.defaultProps = {
  placeholder: null,
  items: [],
  mode: 'primary',
  onValuesChange: () => {},
  fontWeight: '600',
  height: 180,
  labelStyle: {
    fontSize: 17
  },
  androidIndicatorColor: '#555555',
  androidSelectedTextColor: '#222222'
}

const styles = {
  container: {
    flexDirection: 'row'
  },
  column: {
    flexDirection: 'column',
    flex: 1
  },
  pickerLabel: {
    textAlign: 'center',
    color: 'black'
  }
}
