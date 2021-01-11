import React, { Component } from 'react'
import { StyleSheet, View, Text, FlatList } from 'react-native'

import Button from 'apsl-react-native-button'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import LazyLoadingFlatList from '../../components/shared/LazyLoadingFlatList'
import FilterListItem from '../../components/customer/FilterListItem'
import CategoryFilterItem from '../../components/customer/CategoryFilterItem'
import LoadingView from '../../components/shared/LoadingView'

import List from '../../utils/List'

import moment from 'moment'

import screenStyles from '../../assets/css/screens'

import Backend from '../../utils/Backend'
import MockData from '../../utils/MockData'

const ALL_OFFERS_VALUE = 'all_offers'
const ORDER_BY_TITLE_VALUE = 'title'
const PARAM_ORDER_BY = 'order_by'
const PARAM_ORDER_DIRECTION = 'order_direction'
const PARAM_DIETARIES = 'dietaries'
const PARAM_CATEGORIES = 'categories'

export default class Filter extends Component {
  static navigatorStyle = global.Screens.PrimaryNavBar
  static navigatorButtons = {
    rightButtons: [{ id: 'done', title: 'Done' }]
  }
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      filters: { ...props.filters },
      orderOptions: [],
      offers: [],
      categories: [],
      dietaries: [],
      selectedOrderOption: null,
      selectedOfferValue: null,
      selectedDietaries: [],
      selectedCategories: []
    }
  }

  componentDidMount() {
    this.props.navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this))
    this.props.navigator.setTitle({ title: 'Filter' })
    this._getVenueFilters()
  }

  _onNavigatorEvent(event) {
    if (event.id == 'done') {
      this._updateFilters()
    }
  }

  _updateFilters() {
    let {
      selectedOrderOption,
      selectedOfferValue,
      selectedDietaries,
      selectedCategories,
      filters,
      offers
    } = this.state

    filters[PARAM_ORDER_BY] = selectedOrderOption.value
    filters[PARAM_ORDER_DIRECTION] =
      selectedOrderOption.value == ORDER_BY_TITLE_VALUE ? 'asc' : 'desc'

    offers.map(offer => {
      delete filters[offer.value]
    })

    if (selectedOfferValue) {
      if (selectedOfferValue === ALL_OFFERS_VALUE) {
        offers.map(offer => {
          if (offer.value != ALL_OFFERS_VALUE) {
            filters[offer.value] = true
          }
        })
      } else {
        filters[selectedOfferValue] = true
      }
    }

    if (selectedDietaries.length > 0) {
      filters[PARAM_DIETARIES] = selectedDietaries.toString()
    } else {
      delete filters[PARAM_DIETARIES]
    }

    if (selectedCategories.length > 0) {
      filters[PARAM_CATEGORIES] = selectedCategories.toString()
    } else {
      delete filters[PARAM_CATEGORIES]
    }

    this.props.onFiltersUpdated(filters)
    this.props.navigator.pop()
  }

  _getVenueFilters() {
    let { isLoading, filters } = this.state
    if (isLoading) {
      return
    }

    this.setState({ isLoading: true })
    Backend.getFilters()
      .then(venueFilters => {
        this.setState(
          {
            orderOptions: venueFilters.order_options,
            offers: venueFilters.offers,
            categories: venueFilters.categories,
            dietaries: venueFilters.dietaries,
            isLoading: false
          },
          () => {
            this._setSelectedFilters()
          }
        )
      })
      .catch(error => {
        console.log('ERROR', error)
        this.setState({ isLoading: false })
      })
  }

  _setSelectedFilters() {
    let { orderOptions, offers, categories, dietaries, filters } = this.state

    let selectedOrderOption = null
    let selectedOrderFilter = filters[PARAM_ORDER_BY]
    if (!selectedOrderFilter) {
      selectedOrderOption = orderOptions[0]
    } else {
      selectedOrderOption = List.getItemByValue(
        orderOptions,
        selectedOrderFilter,
        'value'
      )
    }

    let selectedOfferValue = null
    let selectedOffers = []
    offers.map(offer => {
      if (filters[offer.value]) {
        selectedOffers.push(offer.value)
      }
    })

    if (selectedOffers.length > 0) {
      // if multiple offers selected, api is filtering by all offers
      selectedOfferValue =
        selectedOffers.length > 1 ? ALL_OFFERS_VALUE : selectedOffers[0]
    }

    let selectedDietaries = []
    let selectedDietariesFilter = filters[PARAM_DIETARIES]
    if (selectedDietariesFilter) {
      let selectedDietaryIds = selectedDietariesFilter.split(',')
      selectedDietaries = selectedDietaryIds.map(dietaryId => {
        let dietary = List.getItemByValue(dietaries, dietaryId, 'id')
        if (dietary) {
          return dietary.id
        }
      })
    }

    let selectedCategories = []
    let selectedCategoryIds = null
    let selectedCategoriesFilter = filters[PARAM_CATEGORIES]
    if (selectedCategoriesFilter) {
      if (this._isNumber(selectedCategoriesFilter)) {
        selectedCategories.push(selectedCategoriesFilter)
      } else {
        selectedCategoryIds = selectedCategoriesFilter.split(',')
      }
      if (selectedCategoryIds) {
        selectedCategories = selectedCategoryIds.map(categoryId => {
          let category = List.getItemByValue(categories, categoryId, 'id')
          if (category) {
            return category.id
          }
        })
      }
    }

    this.setState({
      selectedOrderOption,
      selectedOfferValue,
      selectedDietaries,
      selectedCategories
    })
  }

  _isNumber(value) {
    return typeof value === 'number' && isFinite(value)
  }

  _renderSortByList() {
    return (
      <FlatList
        ref={list => (this.list = list)}
        data={this.state.orderOptions}
        extraData={this.state.selectedOrderOption}
        horizontal={true}
        contentContainerStyle={styles.listContainer}
        style={styles.list}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <FilterListItem
              title={item.title}
              value={item.value}
              selected={this.state.selectedOrderOption === item}
              onItemSelected={() =>
                this.setState({ selectedOrderOption: item })
              }
            />
          )
        }}
      />
    )
  }

  _renderOffersList() {
    let { selectedOfferValue } = this.state
    return (
      <FlatList
        ref={list => (this.list = list)}
        data={this.state.offers}
        extraData={selectedOfferValue}
        horizontal={true}
        contentContainerStyle={styles.listContainer}
        style={styles.list}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <FilterListItem
              title={item.title}
              value={item.value}
              selected={item.value == selectedOfferValue}
              onItemUnselected={() =>
                this.setState({ selectedOfferValue: null })
              }
              onItemSelected={() =>
                this.setState({ selectedOfferValue: item.value })
              }
            />
          )
        }}
      />
    )
  }

  _renderDietariesList() {
    let { dietaries, selectedDietaries } = this.state
    return (
      <FlatList
        ref={list => (this.list = list)}
        data={dietaries}
        extraData={this.state}
        horizontal={true}
        contentContainerStyle={styles.listContainer}
        style={styles.list}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <FilterListItem
              title={item.title}
              value={item.value}
              selected={List.contains(selectedDietaries, item.id)}
              onItemSelected={() => {
                selectedDietaries.push(item.id)
                this.setState({ selectedDietaries })
              }}
              onItemUnselected={() => {
                List.removeItem(selectedDietaries, item.id)
                this.setState({ selectedDietaries })
              }}
            />
          )
        }}
      />
    )
  }

  _renderCategoriesList() {
    let { categories, selectedCategories } = this.state
    return (
      <FlatList
        ref={list => (this.list = list)}
        data={categories}
        extraData={this.state}
        contentContainerStyle={styles.listContainer}
        style={styles.list}
        renderItem={({ item }) => {
          return (
            <CategoryFilterItem
              category={item}
              selected={List.contains(selectedCategories, item.id)}
              onItemSelected={() => {
                selectedCategories.push(item.id)
                this.setState({ selectedCategories })
              }}
              onItemUnselected={() => {
                List.removeItem(selectedCategories, item.id)
                this.setState({ selectedCategories })
              }}
            />
          )
        }}
      />
    )
  }

  _renderSortBy() {
    return (
      <View>
        <Text style={[styles.title, { marginTop: 20 }]}>Sort by</Text>
        {this._renderSortByList()}
      </View>
    )
  }

  _renderOffers() {
    return (
      <View>
        <Text style={styles.title}>Offers</Text>
        {this._renderOffersList()}
      </View>
    )
  }

  _renderAllergies() {
    return (
      <View>
        <Text style={styles.title}>Dietary</Text>
        {this._renderDietariesList()}
      </View>
    )
  }

  _renderCategories() {
    return (
      <View>
        <Text style={styles.title}>Categories</Text>
        {this._renderCategoriesList()}
      </View>
    )
  }

  render() {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={[
          screenStyles.mainPaddedContainer,
          styles.noPadding
        ]}
      >
        {this._renderSortBy()}
        {this._renderOffers()}
        {this._renderAllergies()}
        {this._renderCategories()}
        <LoadingView isLoading={this.state.isLoading} size="small" />
      </KeyboardAwareScrollView>
    )
  }
}

Filter.defaultProps = {
  filters: {}
}

const styles = StyleSheet.create({
  list: { paddingLeft: 25 },
  noPadding: { padding: 0 },
  listContainer: {
    paddingRight: 20
  },
  title: {
    marginTop: 10,
    marginLeft: 15,
    marginBottom: 15,
    color: '#909090',
    fontSize: 18,
    fontWeight: '600'
  }
})
