import React, { Component } from 'react'
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native'

import Modal from 'react-native-modal'
import Button from '../shared/Button'
import TextField from './TextField'

import modalStyles from '../../assets/css/modal'

export default class TextFieldModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: props.visible,
      isLoading: props.isLoading,
      nowChecked: false,
      scheduleChecked: false,
      value: props.value,
      validationText: props.validationText,
      showValidationText: false
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps)
  }

  close() {
    this.setState({ visible: false })
    this.props.onModalClosed()
  }

  _buttonPressed(value) {
    this.props.buttonPressed(value)
  }

  _renderValidationText() {
    if (!this.state.showValidationText) {
      return null
    }
    return (
      <Text style={styles.validationText}>{this.state.validationText}</Text>
    )
  }

  renderModal() {
    return (
      <View>
        <Text style={modalStyles.title}>{this.props.modalTitle}</Text>
        <TextField
          ref="tfValue"
          value={this.state.value}
          placeholder={this.props.placeholder}
          containerStyle={{ marginBottom: 20 }}
          onChangeText={value => {
            this.setState({ value })
          }}
        />
        {this._renderValidationText()}
        <Button
          title={this.props.buttonTitle}
          style={styles.button}
          isLoading={this.state.isLoading}
          onPress={() => this._buttonPressed(this.state.value)}
        />
      </View>
    )
  }

  render() {
    return (
      <Modal
        isVisible={this.state.visible}
        onBackdropPress={() => this.close()}
      >
        <View style={modalStyles.container}>{this.renderModal()}</View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 30
  },
  button: {
    marginTop: 20
  },
  container: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderColor: '#e2e2e2',
    marginLeft: 10,
    marginRight: 10
  },
  text: {
    textAlign: 'left',
    width: '95%',
    paddingLeft: 10,
    fontSize: 16,
    fontWeight: '500'
  },
  validationText: {
    color: 'red'
  }
})

TextFieldModal.defaultProps = {
  visible: false,
  title: 'Modal Title'
}
