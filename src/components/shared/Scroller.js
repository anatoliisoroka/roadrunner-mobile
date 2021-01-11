
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  Easing,
  ScrollView,
  Dimensions,
} from 'react-native';

import PropTypes from 'prop-types'


const { width } = Dimensions.get('window');

type Props = {};
export default class Scroller extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
      currentPage: 0,
      totalPagesNo: props.totalPagesNo
    };
  }

  goToStart(){
    let {
      currentPage,
      totalPagesNo
    } = this.state

    if(currentPage == 0){
      return
    }

    let nextPage = 0
    this.scrollView.scrollTo(0, nextPage * width)
    this.setState({ currentPage: nextPage })
  }

  next(){
    let {
      currentPage,
      totalPagesNo
    } = this.state

    if(currentPage == totalPagesNo - 1){
      return
    }

    let nextPage = currentPage + 1
    this.scrollView.scrollTo(0, nextPage * width)
    this.setState({ currentPage: nextPage })
  }

  previous(){
    let {
      currentPage,
      totalPagesNo
    } = this.state

    if(currentPage == 0){
      return
    }

    let nextPage = currentPage - 1
    this.scrollView.scrollTo(0, nextPage * width)
    this.setState({ currentPage: nextPage })
  }

  handleScroll = (event) => {
   const x = event.nativeEvent.contentOffset.x
   var value = x / (width * (this.state.totalPagesNo - 1))

   // clamp the value
   if(value < 0){
     value = (-value) / 2
   }
   else if(value > 0.95){
     value = 0.95
   }

   const progress = new Animated.Value(value)
   const currentPage = Math.round(x / width)

   if(this.state.currentPage != currentPage){
     this.props.onPageChanged(currentPage)
   }
   this.setState({progress, currentPage})
  }

  renderPages = () => {
    let {
      totalPagesNo
    } = this.state

    let pages = []
    for(var i = 0; i < totalPagesNo; i++){
      pages.push(
        <View style={{ width }}>

          { this.props.renderPage(i) }

        </View>
      )
    }

    return pages
  }

  render() {
    return (
      <ScrollView
        contentContainerStyle={this.props.contentContainerStyle}
        ref={(scrollView) => { this.scrollView = scrollView; }}
        horizontal={true}
        pagingEnabled={true} // animates ScrollView to nearest multiple of it's own width
        showsHorizontalScrollIndicator={false}
        onScroll={this.handleScroll}
        scrollEnabled={false}
        scrollEventThrottle={32} // this will ensure that this ScrollView's onScroll prop is called no faster than 16ms between each function call
        >
          {this.renderPages()}
      </ScrollView>
    );
  }
}

Scroller.propTypes = {
  onPageChanged: PropTypes.func.isRequired,
}
