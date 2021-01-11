import React, { Component } from 'react'
import { View, Image, Platform } from 'react-native'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'

import { Icon, FormValidationMessage } from 'react-native-elements'

export default class LocationSearch extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      error: null
    }
  }
  onPlaceSelected(data, details) {
    var data = {}
    if (details.geometry && details.geometry.location) {
      const location = details.geometry.location
      data['longitude'] = location.lng
      data['latitude'] = location.lat
    }

    data['address'] = details.name
    data['formattedAddress'] = details.formatted_address
    details.address_components.forEach(function(address_component) {
      var type = address_component.types[0]
      if (type == 'country') {
        data['country'] = address_component.long_name
        data['countryShort'] = address_component.short_name
      }
      if (type == 'locality' || type == 'postal_town') {
        data['city'] = address_component.long_name
      } else if (type == 'administrative_area_level_1') {
        data['state'] = address_component.long_name
      }
    })
    this.setState({ data })
    this.props.onPlaceSelected(data)
  }
  isValid() {
    const {
      country,
      countryShort,
      city,
      address,
      state,
      longitude,
      latitude
    } = this.state.data
    const errorMessage = 'Please enter a more specific location'
    var error = null
    this.setState({ error })

    if (country == null || country == '') {
      error = errorMessage
    } else if (country == null || country == '') {
      error = errorMessage
    } else if (countryShort == null || countryShort == '') {
      error = errorMessage
    } else if (city == null || city == '') {
      error = errorMessage
    } else if (address == null || address == '') {
      error = errorMessage
    } else if (state == null || state == '') {
      error = errorMessage
    } else if (longitude == null || latitude == null) {
      error = errorMessage
    }

    if (error) {
      this.setState({ error })
      return false
    }
    return true
  }
  errorMessage() {
    if (this.state.error == null || this.state.error == '') {
      return <View style={{ marginBottom: 10 }} />
    }

    return (
      <FormValidationMessage containerStyle={{ marginBottom: 10 }}>
        {this.state.error}
      </FormValidationMessage>
    )
  }

  _getTextInputStyle() {
    let { data } = this.state
    let textColor = { color: data.address ? 'black' : '#929292' }
    return {
      backgroundColor: '#f7f7f7',
      ...textColor
    }
  }

  render() {
    return (
      <View
        style={[
          {
            width: '100%'
          },
          this.props.containerHeight
        ]}
      >
        <GooglePlacesAutocomplete
          enablePoweredByContainer={false}
          placeholder="Delivery Address"
          minLength={2} // minimum length of text to search
          autoFocus={false}
          returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
          listViewDisplayed={this.state.listViewDisplayed}
          fetchDetails={true}
          // renderDescription={row => row.description} // custom description render
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            this.onPlaceSelected(data, details)
            this.setState({ listViewDisplayed: false })
          }}
          textInputProps={{
            onChangeText: text => {
              this.setState({ data: {}, error: null, listViewDisplayed: true })
            }
          }}
          getDefaultValue={() => ''}
          query={{
            // available options: https://developers.google.com/places/web-service/autocomplete
            key: global.Api.GMapsKey,
            language: 'en', // language of the results
            types: '', // default: 'geocode'
            components: 'country:gb|country:ie'
          }}
          styles={{
            textInputContainer: {
              width: '100%',
              backgroundColor: '#f7f7f7',
              borderWidth: 0,
              borderRadius: 8,
              borderTopWidth: 0,
              borderBottomWidth: 0
            },
            textInput: this._getTextInputStyle(),
            description: {
              fontWeight: 'bold'
            },
            predefinedPlacesDescription: {
              color: global.Colors.Secondary
            },
            container: {
              width: '100%',
              marginTop: 10,
              backgroundColor: 'transparent',
              ...this.props.containerStyle
            },
            listView: {
              color: 'white',
              backgroundColor: '#f7f7f7'
            }
          }}
          nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
          GoogleReverseGeocodingQuery={
            {
              // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
            }
          }
          GooglePlacesSearchQuery={{
            // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
            rankby: 'distance'
          }}
          filterReverseGeocodingByTypes={['street_address']}
          // predefinedPlaces={[homePlace, workPlace]}

          debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
          renderRightButton={() => (
            <View
              style={{
                marginLeft: 4,
                marginRight: 10,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Icon
                name="search"
                type="material"
                color={global.Colors.Primary}
                size={28}
              />
            </View>
          )}
          // renderRightButton={() => <Text>Custom text after the input</Text>}
        />
        {this.errorMessage()}
      </View>
    )
  }
}
