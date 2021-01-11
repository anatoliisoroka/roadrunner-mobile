import React, { Component } from 'react'
import { StyleSheet, Image } from 'react-native'

import PropTypes from 'prop-types'

type Props = {}
export default class LogoBanner extends Component<Props> {
  constructor(props) {
    super(props)
    this.state = {
      image:
        props.type == 'primary'
          ? require('../../assets/images/splash.png')
          : require('../../assets/images/splash.png')
    }
  }
  render() {
    return <Image style={styles.image} source={this.state.image} />
  }
}

LogoBanner.propTypes = {
  type: PropTypes.oneOf(['primary', 'secondary'])
}

LogoBanner.defaultProps = {
  type: 'primary'
}

const styles = StyleSheet.create({
  image: { width: '70%', flex: 1, resizeMode: 'contain', marginLeft: '5%' }
})
