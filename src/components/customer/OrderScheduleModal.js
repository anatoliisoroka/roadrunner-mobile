import React, { Component } from 'react'
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native'

import { CheckBox } from 'react-native-elements'
import Modal from 'react-native-modal'
import Button from '../shared/Button'
import InLinePickerField from '../shared/InLinePickerField'

import TextFormat from '../../utils/TextFormat'
import DateTime from '../../utils/DateTime'

import moment from 'moment'

import modalStyles from '../../assets/css/modal'

const TODAY = 'Today'
const TOMORROW = 'Tomorrow'

export default class OrderScheduleModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: props.visible,
      openingHours: props.openingHours,
      isLoading: props.isLoading,
      selectedDate: props.selectedDate,
      selectedDay: null,
      selectedTime: '12:00 pm',
      pickerData: null
    }
  }

  componentDidMount() {
    this._initSelectedDayTime()
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps, () => {
      this._setPickerData()
    })
  }

  _initSelectedDayTime() {
    let { selectedDate, openingHours } = this.state
    if (!selectedDate) {
      return
    }
    selectedDay = DateTime.getDayOfWeek(selectedDate)
    selectedTime = DateTime.getTime(selectedDate)
    this.setState({ selectedDay, selectedTime }, () => {this._setPickerData()})
  }

  close() {
    this.setState({ visible: false })
    this.props.onModalClosed()
  }

  _updateSelectedDate() {
    let date = this._getDate()
    this.props.onSelectedDateUpdated(date)
    this.close()
  }

  _getDate() {
    let { selectedDay, selectedTime } = this.state
    let dayValue = DateTime.getMomentDayValue(selectedDay)
    let date = DateTime.getDateFromWeek(dayValue)
    let dayString = moment(date).format('YYYY MM DD')
    return moment.utc(dayString+ ' 12:00 pm', "YYYY MM DD hh:mm a")
  }

  _getTimes() {
    let { selectedDay, openingHours } = this.state
    let startOfDate = ""
    let endOfDate= ""
    if(!selectedDay){
      return
    }
    openingHours.map(openingHour => {
      if(openingHour.day == selectedDay.toLowerCase()){
        startOfDate = moment.utc(openingHour.opens_at, "hh:mm a")
        endOfDate = moment.utc(openingHour.closes_at, "hh:mm a")
      }
    })
    let times = DateTime.quarterIntervals(startOfDate, endOfDate)
    return times
  }

  _setPickerData() {
    let { selectedDay, openingHours } = this.state
    let datePickerItems = []
    openingHours.map(openingHour => {
      let dayLabel = TextFormat.capitalizeFirst(openingHour.day)
      datePickerItems.push({label:dayLabel, value: openingHour.day  })
    })
    let times = this._getTimes()
    let pickerData = [{ items: datePickerItems }]
    this.setState({ pickerData})
  }

  _renderPickerField() {
    let { pickerData, selectedDay } = this.state

    if (!pickerData) {
      return null
    }
    return (
      <InLinePickerField
        data={pickerData}
        selectedValues={[selectedDay, selectedTime]}
        onValuesChange={values => {
          let selectedDay = values[0]
          let selectedTime = values[1]
          this.setState(
            {
              selectedDay,
              selectedTime
            },
            () => {
              this._setPickerData()
            }
          )
        }}
      />
    )
  }

  render() {
    return (
      <Modal
        isVisible={this.state.visible}
        onBackdropPress={() => this.close()}
        useNativeDriver={true}
        style={{ justifyContent: 'flex-end', margin: 0 }}
      >
        <View style={styles.pickerContainer}>
          <Text style={modalStyles.title}>Delivery Days</Text>
          {this._renderPickerField()}

          <Button
            title="Update"
            style={styles.button}
            isLoading={this.state.isLoading}
            onPress={() => this._updateSelectedDate()}
          />
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 30
  },
  expiration: {
    flexDirection: 'row',
    backgroundColor: 'pink'
  },
  button: {
    marginTop: 20,
    marginHorizontal: 40
  },
  container: {
    borderWidth: 0,
    backgroundColor: 'white',
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
  pickerContainer: {
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    padding: 10,
    backgroundColor: 'white'
  }
})

OrderScheduleModal.defaultProps = {
  visible: false,
  title: 'Modal Title'
}
