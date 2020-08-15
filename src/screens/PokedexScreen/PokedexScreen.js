import React, { useEffect, useState, Component } from 'react'
import { FlatList, Keyboard, Text, TextInput, TouchableOpacity, View, Image, ScrollView, Button, ActivityIndicator } from 'react-native'
import styles from './styles';
import { firebase } from '../../firebase/config'
import { firestore } from 'firebase';
import { connect } from 'react-redux'
import { getPokemon, getCaught } from '../../store/pokemon'

export class PokedexScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      // pokemon: [],
      renderedPokemon: [],
      user: this.props.extraData
    }
    this.sortByName = this.sortByName.bind(this);
    this.handleCatch = this.handleCatch.bind(this)
    this.search = this.search.bind(this)
  }

  componentDidMount () {
    this.props.fetchPokemon()
    setTimeout(() => {
      this.sortByNum();
    }, 1000);
    this.props.fetchCaught(this.state.user.id)
  }

  sortByNum () {
    const pokemon = this.props.pokemon.pokemon
    const sorted = pokemon.sort((a, b) => (a.number > b.number) ? 1 : -1)
    this.setState({renderedPokemon: sorted})
  }

  sortByName () {
    const pokemon = this.props.pokemon.pokemon
    const sorted = pokemon.sort((a, b) => (a.name > b.name) ? 1 : -1)
    this.setState({renderedPokemon: sorted})
  }

  async handleCatch (pokemon) {
    console.log('you caught it')
    pokemon = pokemon.toLowerCase()
    if (this.props.pokemon.caught[pokemon]) {
      console.log('its true')
      const data = {caught: {[pokemon]: false}}
      const pokeRef = firebase.firestore().collection('users').doc(this.state.user.id)
      await pokeRef.set(data, {merge: true})
    }
    else {
      const data = {caught: {[pokemon]: true}}
      console.log('its false')
      const pokeRef = firebase.firestore().collection('users').doc(this.state.user.id)
      await pokeRef.set(data, {merge: true})
    }
    this.props.fetchCaught(this.state.user.id)
  }

  styleMe (pokemon) {
    pokemon = pokemon.toLowerCase()
    if (this.props.pokemon.caught[pokemon]) {
      return styles.caughtContainer
    } else {
      return styles.uncaughtContainer
    }
  }

  search (text) {
    text = text.toLowerCase()
    const render = []
    this.props.pokemon.pokemon.map(pokemon =>{
      const name = pokemon.name.toLowerCase()
      if (name.startsWith(text)) {
        render.push(pokemon)
      }
    })
    this.setState({renderedPokemon: render})
  }

  render () {
    const pokemon = this.state.renderedPokemon
    return (
      <View style={{flex:1}}>
        <Button
          onPress={() => this.sortByName()}
          title='Sort By Name'
          style={styles.buttonLeft}
        />
        <Button
          onPress={() => this.sortByNum()}
          title='Sort by Number'
          style={styles.buttonRight}
        />
        <ScrollView>
          <View style={styles.entityContainer}>
            {pokemon.map(pokemon => {
              return (
                <TouchableOpacity key={pokemon.number}
                  style={this.styleMe(pokemon.name)}
                  onPress={()=> this.handleCatch(pokemon.name)}>
                  <Text style={styles.entityText}>No. {pokemon.number}</Text>
                  <Text style={styles.entityText}>{pokemon.name}</Text>
                  <Image source={{uri: pokemon.image}}
                    style={{width:50, height: 50}}/>
                </TouchableOpacity>
              )
            })}
          </View>
        </ScrollView>
        <TextInput
          // style={styles.input}
          placeholder='Search by Name'
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => this.search(text)}
          // value={entityText}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
      </View>
    )}
}

const mapState = state => {
  return {
    pokemon: state.pokemon,
    caught: state.caught
  }
}

const mapDispatch = dispatch => {
  return {
    fetchPokemon: () => dispatch(getPokemon()),
    fetchCaught: (user) => dispatch(getCaught(user))
  }
}

export default connect(mapState, mapDispatch)(PokedexScreen)
