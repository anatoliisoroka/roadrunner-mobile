import React, { Component } from 'react'
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native'
import { Icon } from 'react-native-elements'

import DateTime from '../../utils/DateTime'

const TODAY_DATE = DateTime.now()
const TOMORROW_DATE = DateTime.tomorrow()
export default class OrderScheduleNavBarButton extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: props.title
    }
    this.props.navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this))
  }

  _onNavigatorEvent(event) {
    if (event.type == 'DeepLink') {
      let payload = event.payload

      if (event.link == global.Broadcast.SelectedDateUpdated) {
        this._setTitle(payload)
      }
    }
    if (event.id == this.props.eventId) {
      this.props.onEvent(this.props.eventId)
    }
  }

  _setTitle(date) {
    let title = DateTime.getDayTimeTitle(date)
    this.setState({ title })
  }

  render() {
    return (
      <View style={styles.main}>
        <TouchableOpacity onPress={this.props.onPress} style={styles.container}>
          <Text>{this.state.title}</Text>
          <Icon
            iconStyle={styles.icon}
            color={global.Colors.Primary}
            type="octicon"
            name="chevron-down"
          />
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main: { flex: 1, justifyContent: 'center' },
  container: { flexDirection: 'row', alignItems: 'center' },
  icon: {
    marginLeft: 5
  }
})
