import React, { Component } from 'react'
import { StyleSheet, Platform, View, TextInput } from 'react-native'

type Props = {}
export default class FeedbackInput extends Component<Props> {
  constructor(props) {
    super(props)
    this.state = {
      description: props.description
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps)
  }

  render() {
    return (
      <TextInput
        onChangeText={description => {
          this.setState({ description })
          this.props.onChangeText(description)
        }}
        value={this.state.description}
        multiline={true}
        placeholder="Feedback"
        placeholderTextColor="#a2a2a2"
        style={styles.textInput}
      />
    )
  }
}

FeedbackInput.defaultProps = {
  description: '',
  onChangeText: () => {}
}

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: '#ededed',
    width: '100%',
    height: 100,
    marginBottom: 30,
    fontSize: 17,
    fontWeight: '500',
    color: '#a2a2a2',
    padding: 5
  }
})
