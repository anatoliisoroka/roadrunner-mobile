import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'

import Text from 'react-native-text'

import Modal from 'react-native-modal'

import { Icon } from 'react-native-elements'

import Hr from './Hr'
import TextLabel from './TextLabel'
import InLinePickerField from './InLinePickerField'

import PropTypes from 'prop-types'

type Props = {}

export default class PickerField extends Component<Props> {
  constructor(props) {
    super(props)
    this.state = {
      isVisible: props.isVisible
    }
  }

  _hide() {
    this.setState({ isVisible: false })
  }
  _renderUnderline() {
    let underlined = this.props.underlined
    return underlined ? <Hr /> : null
  }

  _renderTitle() {
    let title = this.props.title

    if (!title) {
      return null
    }
    return (
      <Text style={{ color: global.Colors.DarkGray, marginBottom: 4 }}>
        {this.props.title}
      </Text>
    )
  }

  render() {
    return (
      <View style={[{ flexDirection: 'row' }, styles.borderContainer]}>
        <TouchableOpacity
          onPress={() => this.setState({ isVisible: true })}
          style={[styles.container, this.props.containerStyle]}
        >
          {this._renderTitle()}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <TextLabel
              style={[styles.textStyle, this.props.textStyle]}
              numberOfLines={1}
            >
              {this.props.label()}
            </TextLabel>
            {this.props.showArrow && (
              <Icon
                name="chevron-down"
                type="feather"
                color={global.Colors.Primary}
              />
            )}
          </View>
          {this._renderUnderline()}
        </TouchableOpacity>

        <Modal
          isVisible={this.state.isVisible}
          onBackdropPress={() => this._hide()}
          onBackButtonPress={() => this._hide()}
          useNativeDriver={true}
          style={{ margin: 0 }}
        >
          <View style={[styles.pickerContainer, this.props.pickerContainer]}>
            <Text
              style={[styles.doneButton, this.props.doneButtonStyle]}
              onPress={() => this._hide()}
            >
              {this.props.doneTitle}
            </Text>
            <InLinePickerField
              data={this.props.data}
              selectedValues={this.props.selectedValues}
              onValuesChange={values => this.props.onValuesChange(values)}
            />
          </View>
        </Modal>
      </View>
    )
  }
}

PickerField.defaultProps = {
  doneTitle: 'Done',
  textStyle: {},
  pickerContainer: {
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    backgroundColor: 'white',
    paddingBottom: 30
  },

  showArrow: true,
  label: () => {},
  underlined: true,
  containerStyle: {}
}

const styles = {
  pickerContainer: {
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    backgroundColor: 'white'
  },

  textStyle: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600'
  },

  borderContainer: {
    borderColor: global.Colors.Primary,
    borderWidth: 2,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginHorizontal: 10,
    marginVertical: 10
  },

  container: {
    width: '100%'
  },
  doneButton: {
    textAlign: 'right',
    color: global.Colors.Accent,
    padding: 15
  }
}
