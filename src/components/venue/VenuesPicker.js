import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'

import Picker from '../shared/PickerField'
import Backend from '../../utils/Backend'

const VENUES_ALL = { label: 'All', value: 0, title: 'All' }
export default class VenuesPicker extends Component {
  constructor(props) {
    super(props)
    let venues = [VENUES_ALL]
    this.state = {
      venues,
      items: [...venues],
      selectedIndex: 0
    }
  }

  componentDidMount() {
    this._getVenues()
  }

  _getVenues() {
    let { venues } = this.state
    Backend.getVenues()
      .then(results => {
        venues = [...venues, ...results]

        let items = this._getItems(venues)
        this.setState({ venues, items })
      })
      .catch(error => {
        console.log('ERROR', error)
      })
  }

  _getItems(venues) {
    let items = venues.map(venue => {
      if (venue.id) {
        return {
          label: venue.title + ' - ' + venue.location.address_line_1,
          value: venue.id
        }
      }

      return venue
    })
    return items
  }

  render() {
    let { items, selectedIndex, venues } = this.state

    return (
      <Picker
        underlined={false}
        data={[
          {
            items
          }
        ]}
        selectedValues={[selectedIndex]}
        label={() => {
          return venues[selectedIndex].title
        }}
        textStyle={{ color: global.Colors.Primary }}
        onValuesChange={values => {
          selectedIndex = values[0]
          let venue = venues[selectedIndex]
          this.setState({ selectedIndex })
          this.props.onValueChange(venue)
        }}
      />
    )
  }
}

VenuesPicker.defaultProps = {
  placeholder: null,
  items: [],
  mode: '',
  onValueChange: () => {},
  onDonePressed: () => {}
}
