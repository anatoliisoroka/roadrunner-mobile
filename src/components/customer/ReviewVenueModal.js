import React, { Component } from 'react'
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Image,
  Platform
} from 'react-native'

import { Icon } from 'react-native-elements'
import Modal from 'react-native-modal'

import Button from '../../components/shared/Button'
import Rating from '../../components/customer/Rating'
import FeedbackInput from '../../components/customer/FeedbackInput'
import LoadingView from '../shared/LoadingView'

import Backend from '../../utils/Backend'
import LocalStorageHelper from '../../utils/LocalStorageHelper'

import modalStyles from '../../assets/css/modal'

const IMAGE_HEIGHT = 150

export default class ReviewVenueModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: props.visible,
      isLoading: props.isLoading,
      rating: 0,
      order: props.order,
      isSending: false
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps)
  }

  _skip() {
    let { order } = this.state
    LocalStorageHelper.setSkippedReviewOrderId(order.id).then(() => {
      this.setState({ visible: false })
      this.props.onReviewSkipped()
    })
  }

  _isValid() {
    var isValid = true

    var rating_value = this.rating.getValue()

    if (rating_value == 0) {
      alert('Please rate this order')
      isValid = false
    }
    return isValid
  }

  _submit() {
    let { order, isSending, description } = this.state

    if (!this._isValid() || isSending) {
      return
    }

    let reviewData = {
      order: order.id,
      description: description ?? null,
      rating: this.rating.getValue(),
      device: Platform.OS,
      platform: global.General.PLATFORM_APP
    }

    this.setState({ isSending: true })
    Backend.submitReview(reviewData)
      .then(response => {
        this.setState({ visible: false, isSending: false })
        this.props.onReviewSubmitted()
      })
      .catch(error => {
        this.setState({ isSending: false })
        console.warn(error.message)
      })
  }

  _renderBanner() {
    let { venue } = this.state.order

    let feature_image = venue.feature_image
    if (!feature_image) {
      return null
    }

    let banner = feature_image.banner

    if (!banner) {
      return null
    }

    return (
      <Image style={styles.image} resizeMode="cover" source={{ uri: banner }} />
    )
  }

  _renderModal() {
    let { order, isSending } = this.state
    if (order == null) {
      return
    }
    return (
      <View>
        <View style={{ height: IMAGE_HEIGHT }}>
          {this._renderBanner()}
          <View style={styles.imageOverlay}>
            <View style={styles.closeButtonContainer}>
              <Icon
                name="ios-close-circle-outline"
                type="ionicon"
                color="white"
                size={30}
                onPress={() => this._skip()}
              />
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Review Past Order</Text>
              <Text style={styles.subtitle}>
                {'Leave a review from your last order with ' +
                  order.venue.title +
                  ' - ' +
                  order.data.venue_location.address_line_1}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.inputContainer}>
          <FeedbackInput
            description={this.state.description}
            onChangeText={description => this.setState({ description })}
          />
          <Rating
            ref={rating => {
              this.rating = rating
            }}
            containerStyle={styles.ratingContainer}
          />
          <Button
            type="tertiary"
            title="Send"
            style={styles.button}
            onPress={() => this._submit()}
          />
        </View>
        <LoadingView isLoading={isSending} size="small" />
      </View>
    )
  }

  render() {
    return (
      <Modal
        isVisible={this.state.visible}
        onBackdropPress={() => this._skip()}
      >
        <View style={modalStyles.containerNoPadding}>
          {this._renderModal()}
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  inputContainer: { padding: 20 },
  title: { color: 'white', fontSize: 22, fontWeight: '600', marginBottom: 10 },
  subtitle: {
    paddingLeft: 10,
    paddingRight: 10,
    color: 'white',
    fontSize: 16,
    textAlign: 'center'
  },
  image: {
    height: IMAGE_HEIGHT,
    width: '100%'
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    height: IMAGE_HEIGHT,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  titleContainer: { justifyContent: 'center', alignItems: 'center' },
  button: {
    marginTop: 20
  },
  container: {
    flex: 1
  },
  validationText: {
    color: 'red'
  },
  ratingContainer: { paddingLeft: 20, paddingRight: 20 },
  closeButtonContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginTop: 10,
    paddingRight: 15
  }
})

ReviewVenueModal.defaultProps = {
  visible: false,
  title: 'Modal Title'
}
