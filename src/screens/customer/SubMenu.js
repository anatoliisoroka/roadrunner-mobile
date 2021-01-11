import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SectionList,
  Platform,
  Alert
} from 'react-native'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Button from '../../components/shared/Button'
import LoadingView from '../../components/shared/LoadingView'
import SubMenuListItem from '../../components/customer/SubMenuListIem'
import Hr from '../../components/shared/Hr'
import Counter from '../../components/customer/Counter'

import BasketManager from '../../utils/BasketManager'
import List from '../../utils/List'
import MockData from '../../utils/MockData'
import Price from '../../utils/Price'

import { ifIphoneX } from 'react-native-iphone-x-helper'

type Props = {}
export default class SubMenu extends Component {
  static navigatorStyle = global.Screens.TransparentNavBar
  constructor(props) {
    super(props)
    this.state = {
      venue: props.venue,
      menu: props.menu,
      item: props.item,
      currency: props.menu.currency,
      selectedOptionGroups: [],
      quantity: 1,
      basket: BasketManager.get()
    }
  }

  _renderPrice(price) {
    let { currency } = this.state.venue
    return Price.format(price, currency)
  }

  _addSelectedOptionGroup(optionGroup, option) {
    let selectedOptionGroup = this._getSelectedOptionGroup(optionGroup)
    if (optionGroup.multi_select === false) {
      selectedOptionGroup.options = []
    }
    selectedOptionGroup.options.push({
      id: option.id,
      price: option.price,
      title: option.title,
      quantity: 1
    })
    this._updateSelectedOptionGroup(selectedOptionGroup)
  }

  _removeSelectedOptionGroup(optionGroup, option) {
    let selectedOptionGroup = this._getSelectedOptionGroup(optionGroup)
    let optionIndex = selectedOptionGroup.options.findIndex(
      item => item.id === option.id
    )
    if (optionIndex > -1) {
      selectedOptionGroup.options.splice(optionIndex, 1)
    }
    if (selectedOptionGroup.options.length === 0) {
      this._deleteSelectedOptionGroup(selectedOptionGroup)
    } else {
      this._updateSelectedOptionGroup(selectedOptionGroup)
    }
  }

  _getSelectedOptionGroup(optionGroup) {
    let selectedOptionGroup = this.state.selectedOptionGroups.find(
      selectedOptionGroup => selectedOptionGroup.id === optionGroup.id
    )
    if (selectedOptionGroup) {
      return selectedOptionGroup
    }
    return {
      id: optionGroup.id,
      title: optionGroup.title,
      options: []
    }
  }

  _canAddToBasket(selectedOptionGroups) {
    if (this.state.item.option_groups.length === selectedOptionGroups.length) {
      return false
    }
    return true
  }

  _updateSelectedOptionGroup(selectedOptionGroup) {
    let { selectedOptionGroups } = this.state

    let selectedOptionGroupIndex = this.state.selectedOptionGroups.findIndex(
      item => item.id === selectedOptionGroup.id
    )
    if (selectedOptionGroupIndex > -1) {
      selectedOptionGroups[selectedOptionGroupIndex] = selectedOptionGroup
    } else {
      selectedOptionGroups.push(selectedOptionGroup)
    }
    this.setState({ selectedOptionGroups })
  }

  _deleteSelectedOptionGroup(selectedOptionGroup) {
    let { selectedOptionGroups } = this.state

    let selectedOptionGroupIndex = selectedOptionGroups.findIndex(
      item => item.id === selectedOptionGroup.id
    )
    if (selectedOptionGroupIndex < 0) {
      return
    }
    selectedOptionGroups.splice(selectedOptionGroupIndex, 1)
    this.setState({ selectedOptionGroups })
  }

  _checkIfSelected(item, section) {
    let { selectedOptionGroups } = this.state
    if (selectedOptionGroups.length === 0) {
      return false
    }
    let foundOptionGroup = selectedOptionGroups.find(
      optionGroup => optionGroup.id === section.id
    )
    if (!foundOptionGroup) {
      return false
    }
    let foundOption = foundOptionGroup.options.find(
      option => option.id === item.id
    )
    return foundOption
  }

  _addToBasket() {
    if (!this._checkIfAddItemToBasket()) {
      return
    }

    let { venue, item, quantity, selectedOptionGroups } = this.state
    let basket_item = {
      id: item.id,
      quantity,
      title: item.title,
      price: item.price,
      option_groups: selectedOptionGroups
    }

    BasketManager.add(basket_item)

    this.props.onBasketUpdated()
    this.props.navigator.pop()
  }

  _checkIfAddItemToBasket() {
    let { basket, venue } = this.state
    if (BasketManager.isEmpty()) {
      this._setNewBasket()
      return true
    }

    if (basket.venue.id == venue.id) {
      return true
    }

    this._showExistingMenuAlert()
    return false
  }

  _showExistingMenuAlert() {
    Alert.alert(
      'Existing Menu',
      'You have an existing basket, would you like to create a new one?',
      [
        {
          text: 'Yes',
          onPress: () => {
            this._setNewBasket()
            this._addToBasket()
          }
        },
        {
          text: 'No',
          onPress: () => this.props.navigator.pop(),
          style: 'cancel'
        }
      ]
    )
  }

  _setNewBasket() {
    let { venue, menu } = this.state
    BasketManager.reset(venue, menu)
    this.setState({ basket: BasketManager.get() })
  }

  _renderDescription(item) {
    if (item.description == null) {
      return null
    }
    return <Text style={styles.description}>{item.description}</Text>
  }

  _renderImage(image) {
    return (
      <View>
        <Image style={styles.image} source={{ uri: image }} />
        <View opacity={0.5} style={styles.imageOverlay}></View>
      </View>
    )
  }

  _renderBannerImage() {
    let { image } = this.state.item
    if (image == null) {
      return <View style={styles.topBar} />
    }
    return this._renderImage(image.banner)
  }

  _getSections(option_groups) {
    return option_groups.map(option_group => {
      return {
        id: option_group.id,
        title: option_group.title,
        data: option_group.options,
        multi_select: option_group.multi_select
      }
    })
  }

  _updateItemQuantity(quantity) {
    this.setState({ quantity })
  }

  _renderSubMenu() {
    let { option_groups } = this.state.item
    if (option_groups === null) {
      return null
    }
    return (
      <SectionList
        sections={this._getSections(option_groups)}
        contentContainerStyle={{ paddingBottom: 90 }}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.headerTitle}>{title}</Text>
        )}
        renderItem={({ item, index, section }) => (
          <SubMenuListItem
            item={item}
            section={section}
            currency={this.state.currency}
            selected={this._checkIfSelected(item, section)}
            onItemSelected={section =>
              this._addSelectedOptionGroup(section, item)
            }
            onItemUnselected={section =>
              this._removeSelectedOptionGroup(section, item)
            }
          />
        )}
        ItemSeparatorComponent={() => <Hr style={styles.hr} />}
        keyExtractor={(item, index) => item + index}
        ListFooterComponent={
          <Counter
            value={this.state.quantity}
            valueChanged={quantity => this._updateItemQuantity(quantity)}
          />
        }
      />
    )
  }

  _renderBasketButton() {
    return (
      <View style={styles.buttonContainer}>
        <Button
          title="Add to Basket"
          style={styles.button}
          onPress={() => this._addToBasket()}
        />
      </View>
    )
  }

  render() {
    let { item } = this.state
    return (
      <View style={styles.mainContainer}>
        {this._renderBannerImage()}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingRight: 10,
            flexWrap: 'wrap'
          }}
        >
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.price}>{this._renderPrice(item.price)}</Text>
        </View>
        {this._renderDescription(item)}

        {this._renderSubMenu()}
        {this._renderBasketButton()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white'
  },
  scrollContainer: {
    flex: 1,
    paddingBottom: 20,
    paddingTop: 10
  },
  title: {
    marginTop: 20,
    marginLeft: 15,
    fontSize: 20,
    fontWeight: '700'
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 25,
    marginLeft: 15
  },
  description: {
    color: '#909090',
    marginTop: 10,
    marginLeft: 15
  },
  image: {
    height: 200,
    width: '100%',
    resizeMode: 'cover'
  },
  topBar: {
    ...ifIphoneX(
      {
        height: 90
      },
      {
        height: Platform.OS == 'ios' ? 60 : 70
      }
    ),
    width: '100%',
    backgroundColor: global.Colors.Primary
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 200,
    width: '100%',
    backgroundColor: '#000'
  },
  headerTitle: {
    color: '#909090',
    backgroundColor: 'white',
    fontSize: 16,
    fontWeight: '700',
    paddingTop: 15,
    paddingLeft: 20,
    paddingBottom: 15
  },
  hr: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 40,
    marginRight: 40
  },
  button: { marginLeft: 40, marginRight: 40 },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: '#f7f7f7',
    ...ifIphoneX(
      {
        height: 70
      },
      {
        height: 60
      }
    ),
    justifyContent: 'center'
  }
})
