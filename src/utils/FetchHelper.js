import { Platform } from 'react-native'

import AuthManager from './AuthManager'

// returns an authenticated fetch requests if possible
// these method are just shortcuts for including headers into
// fetch requests
const PAGE_LIMIT = 20
export default class FetchHelper {
  static get(
    endpoint,
    validateTokens = AuthManager.getCurrentUser() ? true : false
  ) {
    let data = {}
    data['headers'] = AuthManager.getHeaders()
    let statusCode = null
    return FetchHelper._handleValidateTokens(validateTokens).then(() => {
      return fetch(endpoint, data)
        .then(response => {
          statusCode = response.status
          return response.json()
        })
        .then(responseJson => {
          let status = { code: statusCode, success: responseJson.status }
          if (this._hasError(status)) {
            throw FetchHelper._getError(responseJson)
            return
          }

          return responseJson
        })
    })
  }

  static getPaginated(
    endpoint,
    page,
    validateTokens = AuthManager.getCurrentUser() ? true : false,
    pageLimit = PAGE_LIMIT
  ) {
    if (endpoint.includes('?')) {
      endpoint += '&'
    } else {
      endpoint += '?'
    }
    return FetchHelper._handleValidateTokens(validateTokens).then(() => {
      return FetchHelper.get(endpoint + 'page=' + page).then(responseJson => {
        return responseJson
      })
    })
  }

  static post(
    endpoint,
    data,
    isMultiPart = false,
    validateTokens = AuthManager.getCurrentUser() ? true : false
  ) {
    let statusCode = null
    return FetchHelper._handleValidateTokens(validateTokens).then(() => {
      return fetch(endpoint, {
        method: 'POST',
        headers: isMultiPart
          ? AuthManager.getHeaders('multipart/form-data')
          : AuthManager.getHeaders(),
        body: isMultiPart ? data : JSON.stringify(data)
      })
        .then(response => {
          console.log('RES', response)
          statusCode = response.status
          if (statusCode == 204) {
            return response
          }
          return response.json()
        })
        .then(responseJson => {
          let status = { code: statusCode, success: responseJson.status }
          if (this._hasError(status)) {
            throw FetchHelper._getError(responseJson)
            return
          }
          return responseJson
        })
    })
  }

  static _handleValidateTokens(validateTokens) {
    return new Promise((resolve, reject) => {
      if (validateTokens) {
        return AuthManager.validateTokens(resolve, reject)
      }
      resolve()
    })
  }

  static patch(
    endpoint,
    data,
    stringify = true,
    validateTokens = AuthManager.getCurrentUser() ? true : false
  ) {
    var headers = AuthManager.getHeaders()
    if (stringify) {
      data = JSON.stringify(data)
    } else {
      headers = AuthManager.getHeaders('multipart/form-data')
    }

    let statusCode = null
    return FetchHelper._handleValidateTokens(validateTokens).then(() => {
      return fetch(endpoint, {
        method: 'PATCH',
        headers: headers,
        body: data
      })
        .then(response => {
          statusCode = response.status
          if (statusCode == 204) {
            return response
          }
          return response.json()
        })
        .then(responseJson => {
          let status = { code: statusCode, success: responseJson.status }
          if (this._hasError(status)) {
            throw FetchHelper._getError(responseJson)
          }
          return responseJson
        })
    })
  }

  static put(
    endpoint,
    data,
    stringify = true,
    validateTokens = AuthManager.getCurrentUser() ? true : false
  ) {
    var headers = AuthManager.getHeaders()
    // this is needed by server side for all put requests
    data._method = 'PUT'
    if (stringify) {
      data = JSON.stringify(data)
    } else {
      headers = AuthManager.getHeaders('multipart/form-data')
    }
    let statusCode = null
    return FetchHelper._handleValidateTokens(validateTokens).then(() => {
      return fetch(endpoint, {
        // this is needed by server side for all put requests
        method: 'POST',
        headers: headers,
        body: data
      })
        .then(response => {
          statusCode = response.status
          return response.json()
        })
        .then(responseJson => {
          let status = { code: statusCode, success: responseJson.status }
          if (this._hasError(status)) {
            throw FetchHelper._getError(responseJson)
          }

          return responseJson
        })
    })
  }

  static delete(
    endpoint,
    data,
    validateTokens = AuthManager.getCurrentUser() ? true : false
  ) {
    let statusCode = null
    return FetchHelper._handleValidateTokens(validateTokens).then(() => {
      return fetch(endpoint, {
        method: 'DELETE',
        headers: AuthManager.getHeaders(),
        body: JSON.stringify(data)
      })
        .then(response => {
          statusCode = response.status
          if (statusCode == 204) {
            return response
          }
          return response.json()
        })
        .then(responseJson => {
          let status = { code: statusCode, success: responseJson.status }
          if (this._hasError(status)) {
            throw FetchHelper._getError(responseJson)
            return
          }
          return responseJson
        })
    })
  }

  static _hasError({ code, success }) {
    return code < 200 || code > 299 || success == false
  }

  static _getError(responseJson) {
    error = null

    if (responseJson.message) {
      error = responseJson.message
    } else if (responseJson.non_field_errors) {
      error = responseJson.non_field_errors
    } else {
      error = responseJson
    }

    if (error.constructor == Object) {
      for (var key in error) {
        error =
          key +
          ': ' +
          FetchHelper._getError(error[Object.keys(error)[0]]).message
        break
      }
    }

    message = 'An unexpected error occured'

    if (error instanceof Array) {
      message = error[0]
    } else if (typeof error === 'string') {
      message = error
    }
    if (error.constructor == Object) {
      for (key in error) {
        message = error[key]
      }
    }

    message = message.replace('user: email: ', '')

    let code = responseJson.code ?? null
    return { code, error, message }
  }

  static _hasMore(results, pageLimit) {
    if (results.current_page) {
      return results.current_page < results.last_page
    }
    return results.data.length >= pageLimit
  }
}
