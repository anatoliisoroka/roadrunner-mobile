import React, { Component } from 'react'
import { View, Text } from 'react-native'

import StarRating from 'react-native-star-rating'

type Props = {}
export default class Rating extends Component<Props> {
  constructor(props) {
    super(props)
    this.state = {
      value: props.value
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps)
  }

  getValue() {
    return this.state.value
  }

  _onStarRatingPress(value) {
    this.setState({
      value
    })
  }

  render() {
    return (
      <StarRating
        disabled={false}
        emptyStar={'star'}
        fullStar={'star'}
        containerStyle={this.props.containerStyle}
        iconSet={'FontAwesome'}
        maxStars={5}
        starSize={35}
        rating={this.state.value}
        selectedStar={value => this._onStarRatingPress(value)}
        fullStarColor={global.Colors.Primary}
        emptyStarColor={'#ededed'}
        starStyle={{ marginLeft: 8 }}
      />
    )
  }
}

Rating.defaultProps = {
  value: 0
}
