import stripe from 'tipsi-stripe'

const PUBLISHABLE_KEY = global.Api.IsDebug
  ? 'pk_test_4xAjjVWq0jSKvQyaYK7V3ijj001CX8HDBn'
  : 'pk_live_L1ga6uzcrjuvr622FWZeGKuW00Cwv4aZqT'

stripe.setOptions({
  publishableKey: PUBLISHABLE_KEY
})

export default class StripeHelper {
  static get() {
    return stripe
  }

  static async createBank(
    accountHolderName,
    accountHolderType,
    accountNumber,
    countryCode,
    currency,
    routingNumber = null
  ) {
    const params = {
      accountNumber,
      countryCode,
      currency,
      accountHolderName,
      accountHolderType
    }

    return stripe.createTokenWithBankAccount(params).then(token => {
      return token.tokenId
    })
  }
  static createCard(name, number, expMonth, expYear, cvc) {
    const params = {
      number,
      expMonth: parseInt(expMonth),
      expYear: parseInt(expYear),
      cvc,
      name
    }

    return StripeHelper.get()
      .createTokenWithCard(params)
      .then(token => {
        return token
      })
  }

  static confirmPaymentIntent(clientSecret, publishableKey) {
    stripe.setOptions({
      publishableKey
    })

    return stripe
      .authenticatePaymentIntent({ clientSecret })
      .then(response => {
        stripe.setOptions({
          publishableKey: PUBLISHABLE_KEY
        })
        if (response.status != 'requires_confirmation') {
          throw {
            error: 'Cancelled',
            message: 'Verification Cancelled'
          }
        }
        return response
      })
      .catch(error => {
        stripe.setOptions({
          publishableKey: PUBLISHABLE_KEY
        })
        throw error
      })
  }
}
