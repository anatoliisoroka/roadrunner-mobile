import React, { Component } from 'react'
import { StyleSheet, Text, View, FlatList } from 'react-native'

import { FormInput } from 'react-native-elements'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Button from '../../components/shared/Button'
import DietaryListItem from '../../components/customer/DietaryListItem'
import LoadingView from '../../components/shared/LoadingView'

import Backend from '../../utils/Backend'
import List from '../../utils/List'

import screenStyles from '../../assets/css/screens'

type Props = {}
export default class Dietaries extends Component {
  static navigatorStyle = global.Screens.PrimaryNavBar
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      dietaryTitle: '',
      dietaries: []
    }
  }

  componentDidMount() {
    this.props.navigator.setTitle({ title: 'Dietaries' })
    this._getDietaries()
  }

  _getDietaries() {
    let { isLoading } = this.state

    if (isLoading) {
      return
    }
    this.setState({ isLoading: true })

    Backend.getUserDietaries()
      .then(response => {
        let dietaries = response.results
        this.setState({ dietaries, isLoading: false })
      })
      .catch(error => {
        console.warn(error)
        this.setState({ isLoading: false })
      })
  }

  _updateDietaries() {
    let { isLoading, dietaries } = this.state

    if (isLoading) {
      return
    }

    let dietariesData = dietaries.filter(dietary => {
      return dietary.selected
    })

    this.setState({ isLoading: true })

    Backend.updateDietaries(dietariesData)
      .then(() => {
        this.setState({ isLoading: false }, () => {
          this._getDietaries()
        })
      })
      .catch(error => {
        console.warn(error.message)
        this.setState({ isLoading: false })
      })
  }

  _onTextInputSubmitted() {
    let { dietaryTitle, dietaries } = this.state
    let dietary = {
      title: dietaryTitle,
      selected: true
    }
    dietaries.push(dietary)
    this.input.clearText()
    this.setState({ dietaries, dietaryTitle: '' }, () => {
      setTimeout(() => {
        this.list.scrollToIndex({
          animated: true,
          index: dietaries.length - 2
        })
      }, 100)
    })
  }

  _onItemPressed(dietary) {
    let dietaries = [...this.state.dietaries]
    dietaries = List.findAndReplace(dietaries, dietary)
    this.setState({ dietaries })
  }

  _renderDietaryList() {
    let { dietaries } = this.state
    if (!dietaries) {
      return null
    }
    return (
      <FlatList
        ref={list => (this.list = list)}
        data={this.state.dietaries}
        horizontal={true}
        contentContainerStyle={styles.listContainer}
        style={styles.list}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <DietaryListItem
              dietary={item}
              onItemPressed={dietary => this._onItemPressed(dietary)}
            />
          )
        }}
      />
    )
  }

  _textInputUpdated(dietaryTitle) {
    this.setState({ dietaryTitle })
  }

  _renderTextInput() {
    return (
      <FormInput
        placeholder={'Others'}
        ref={input => (this.input = input)}
        onChangeText={input => this._textInputUpdated(input)}
        containerStyle={styles.inputContainer}
        placeholderTextColor={'#929292'}
        inputStyle={styles.input}
        returnKeyType="send"
        onSubmitEditing={() => this._onTextInputSubmitted()}
      />
    )
  }

  _renderSpacer() {
    return <View style={styles.spacer}></View>
  }

  _renderSaveButton() {
    return (
      <View style={styles.buttonContainer}>
        <Button
          type="primary"
          title="Save"
          isLoading={this.state.isLoading}
          style={styles.button}
          onPress={() => this._updateDietaries()}
        />
      </View>
    )
  }

  render() {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={[screenStyles.mainContainer, styles.noPadding]}
      >
        <View style={styles.textContainer}>
          <Text style={styles.headerText}>
            We will try our best to accommodate for your dietary restrictions.
          </Text>
          <Text style={styles.subText}>
            Let us know below and this information will be sent to the
            restaurant with your order.
          </Text>
        </View>
        <View style={{ justifyContent: 'center' }}>
          {this._renderDietaryList()}
          {this._renderTextInput()}
        </View>
        {this._renderSpacer()}
        {this._renderSaveButton()}
        <LoadingView isLoading={this.state.isLoading} />
      </KeyboardAwareScrollView>
    )
  }
}

const styles = StyleSheet.create({
  list: { paddingLeft: 20 },
  noPadding: { padding: 0 },
  listContainer: {
    paddingRight: 20
  },
  inputContainer: {
    borderRadius: 5,
    backgroundColor: '#ededed',
    borderBottomWidth: 0,
    marginTop: 25
  },
  input: {
    marginLeft: 10
  },
  buttonContainer: {
    width: '100%',
    justifyContent: 'flex-end'
  },
  button: {
    marginLeft: 50,
    marginRight: 50,
    marginBottom: 50,
    padding: 10
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 10
  },
  headerText: {
    fontWeight: '500',
    fontSize: 17,
    marginBottom: 20,
    textAlign: 'center',
    paddingLeft: 30,
    paddingRight: 30,
    padding: 10
  },
  subText: {
    fontWeight: '100',
    fontSize: 14,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: 'center'
  },
  spacer: {
    flex: 1,
    justifyContent: 'space-between'
  }
})
