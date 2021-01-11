import React, { Component } from 'react'
import PropTypes from 'prop-types'

import List from '../../utils/List'

export const PAGINATION_MODE_CURSOR = 'cursor'
export const PAGINATION_MODE_PAGE = 'page'
export const PAGINATION_MODE_LIMIT_OFFSET = 'limit_offset'
export const PAGINATION_MODE_CUSTOM = 'custom'
export const PAGINATION_MODE_OFF = 'off'

export const PAGINATION_MODES = [
  PAGINATION_MODE_CURSOR,
  PAGINATION_MODE_PAGE,
  PAGINATION_MODE_LIMIT_OFFSET,
  PAGINATION_MODE_CUSTOM,
  PAGINATION_MODE_OFF
]

export default class LazyLoader extends Component {
  constructor(props) {
    super(props)
    this._validate(props)

    this.state = {
      endpoint: props.endpoint,
      mode: props.mode,
      params: props.params,
      headers: props.headers,

      items: [],

      // cursor
      nextUrl: null,
      previousUrl: null,

      // page mode (we'll keep track of the page regardless)
      page: 1,

      // limit offset mode
      offset: 0,
      limit: props.limit,

      // custom mode, customParams should be params that define the nextPage
      customParams: props.customParams,

      loading: false,
      hasMore: true,

      onEndReachedName: props.onEndReachedName,

      method: props.method
    }
  }

  componentDidMount() {
    this._loadMore()
  }

  componentWillReceiveProps(nextState) {
    let shouldRefresh = false
    if (nextState.endpoint != this.state.endpoint) {
      shouldRefresh = true
    } else if (
      JSON.stringify(nextState.params) != JSON.stringify(this.state.params)
    ) {
      shouldRefresh = true
    }

    this.setState(nextState, () => {
      if (shouldRefresh) {
        this._refresh()
      }
    })
  }

  hasMore() {
    return this.state.hasMore
  }

  isLoading() {
    return this.state.loading
  }

  _refresh() {
    this.setState(
      {
        items: [],
        loading: false,
        hasMore: true,
        nextUrl: null,
        previousUrl: null,
        page: 1,
        offset: 0
      },
      () => {
        if (this.props.onRefresh) {
          this.props.onRefresh()
        }
        this._loadMore()
      }
    )
  }

  _loadMore() {
    let { endpoint, nextUrl, loading, hasMore, method, headers } = this.state

    if (loading || !hasMore) {
      return
    }

    let options = {
      method,
      headers
    }

    this.setState({ loading: true })

    let statusCode = null
    let response = null

    let url = nextUrl || endpoint

    url = this._handleAddParams(url)

    fetch(url, options)
      .then(result => {
        response = result
        statusCode = response.status
        if (statusCode == 204) {
          throw new Error('204 (No Content) response is not supported')
        }
        return response.json()
      })
      .then(responseJson => {
        if (statusCode < 200 || statusCode > 299) {
          throw new Error(responseJson)
        }
        this._handleResponse(response, responseJson)
      })
      .catch(error => {})
  }

  _handleResponse(response, responseJson) {
    let { mode } = this.state

    switch (mode) {
      case PAGINATION_MODE_CURSOR:
        return this._handleCursorResponse(responseJson)
      case PAGINATION_MODE_PAGE:
        return this._handlePageResponse(responseJson)
      case PAGINATION_MODE_LIMIT_OFFSET:
        return this._handleLimitOffsetResponse(responseJson)
      case PAGINATION_MODE_CUSTOM:
        return this._handleCustomResponse(response, responseJson)
      case PAGINATION_MODE_OFF:
        return this._handleOffResponse(responseJson)
      default:
        throw new Error(
          'Undexpected mode: ' + mode + ' must be one of ' + PAGINATION_MODES
        )
    }
  }

  _handleCursorResponse(responseJson) {
    let newItems = responseJson.results
    this._handleParsedResponse(newItems, responseJson.next)
  }

  _handleCustomResponse(response, responseJson) {
    let { endpoint, page } = this.state

    let { items, hasMore, customParams } = this.props.parseResponse({
      response,
      responseJson,
      page
    })

    this._validateCustomReponse(items, hasMore, customParams)

    let nextUrl = hasMore ? endpoint : null

    this._handleParsedResponse(items, nextUrl, customParams)
  }

  _handleOffResponse(responseJson) {
    let { endpoint, page } = this.state

    let items = responseJson
    let nextUrl = null
    let customParams = {}

    this._handleParsedResponse(items, nextUrl)
  }

  _handleParsedResponse(newItems, nextUrl, customParams) {
    let items = [...this.state.items, ...newItems]
    let hasMore = nextUrl != null

    this.props.onItemsUpdated(items)
    this.setState({
      items,
      hasMore,
      nextUrl,
      customParams,
      page: this.state.page + 1,
      loading: false
    })
  }

  _onEndReached() {
    this._loadMore()
  }

  // our validate method enforces that there is only one child
  _renderList() {
    return React.Children.map(this.props.children, child => {
      let props = {}
      props[this.state.onEndReachedName] = this._onEndReached.bind(this)
      return React.cloneElement(child, props)
    })
  }

  render() {
    return this._renderList()
  }

  /*** HELPER / SETUP FUNCTIONS (BORING STUFF) ***/

  _validate(props) {
    if (React.Children.count(props.children) != 1) {
      throw new Error('LazyLoader: needs to have 1 child component')
    }

    if (props.mode == PAGINATION_MODE_CUSTOM && props.parseResponse == null) {
      throw new Error(
        'LazyLoader: ' +
          PAGINATION_MODE_CUSTOM +
          " mode requires you to specify a 'parseResponse' func prop that returns an object"
      )
    }

    if (props.mode == PAGINATION_MODE_CUSTOM && props.customParams == null) {
      throw new Error(
        'LazyLoader: ' +
          PAGINATION_MODE_CUSTOM +
          " mode requires you to specify a 'customParams' prop"
      )
    }
  }

  _validateCustomReponse(items, hasMore, customParams) {
    if (items == null) {
      throw new Error(
        "LazyLoader: 'parseResponse' must return an object with an 'items' array"
      )
    }

    if (!Array.isArray(items)) {
      throw new Error(
        "LazyLoader: 'items' object in 'parseReponse' must be an array"
      )
    }

    if (hasMore == null) {
      throw new Error(
        "LazyLoader: 'parseResponse' must return an object with a 'hasMore' boolean"
      )
    }

    if (customParams == null) {
      throw new Error(
        "LazyLoader: 'parseResponse' must return an object with an 'customParams' object"
      )
    }
  }

  _handleAddParams(url) {
    let { mode, page, params, customParams } = this.state

    if (mode != PAGINATION_MODE_CURSOR || page == 1) {
      url = this._addParams(url, params)
    }

    if (mode == PAGINATION_MODE_CUSTOM) {
      url = this._addParams(url, customParams)
    }

    return url
  }

  _addParams(url, params) {
    if (Object.keys(params).length == 0) {
      return url
    }

    // TODO: switch to an actual url helper here to avoid bugs/edge cases
    if (url.indexOf('?') == -1) {
      url += '?'
    } else if (!url.endsWith('&')) {
      url += '&'
    }

    Object.keys(params).forEach(function(key) {
      url += key + '=' + params[key] + '&'
    })

    // remove last '&'
    url = url.slice(0, -1)
    return url
  }

  /*** EXPRIMENTAL ***/
  updateItem(itemToUpdate, key = 'id') {
    let items = [...this.state.items]

    for (index in items) {
      item = items[index]

      if (itemToUpdate[key] && itemToUpdate[key] === item[key]) {
        items[index] = itemToUpdate

        break
      }
    }

    this.setState({ items })
  }

  updateOrRefresh(itemToUpdate, key) {
    let items = [...this.state.items]
    let index = List.indexOf(items, itemToUpdate, 'id')

    if (index >= 0) {
      items = List.findAndReplace(items, itemToUpdate)

      this.setState({ items }, () => {
        this.props.onItemsUpdated(items)
      })
      return
    }

    this._refresh()
  }

  removeItem(itemToRemove) {
    let items = [...this.state.items]
    items = List.findAndRemove(items, itemToRemove)
    this.setState({ items }, () => {
      this.props.onItemsUpdated(items)
    })
  }
}

LazyLoader.defaultProps = {
  mode: PAGINATION_MODE_CURSOR,
  params: {},
  headers: {},
  autoLoad: true,
  onEndReachedName: 'onEndReached',
  method: 'GET',
  onItemsUpdated: () => {}
}

LazyLoader.propTypes = {
  endpoint: PropTypes.string.isRequired,
  mode: PropTypes.oneOf(PAGINATION_MODES),
  params: PropTypes.object,
  customParams: PropTypes.object,
  headers: PropTypes.object,
  onEndReachedName: PropTypes.string,
  method: PropTypes.string,
  onItemsUpdated: PropTypes.func,
  parseResponse: PropTypes.func
}
