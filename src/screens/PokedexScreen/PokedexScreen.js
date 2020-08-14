import React, { useEffect, useState, Component } from 'react'
import { FlatList, Keyboard, Text, TextInput, TouchableOpacity, View, Image, ScrollView, Button } from 'react-native'
import styles from './styles';
import { firebase } from '../../firebase/config'
import { firestore } from 'firebase';


export default class PokedexScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      pokemon: [],
      renderedPokemon: [],
      user: this.props.extraData,
      caught: {}
    }
    this.sortByNum = this.sortByNum.bind(this);
    this.sortByName = this.sortByName.bind(this);
    this.setCaught = this.setCaught.bind(this);
    this.handleCatch = this.handleCatch.bind(this)
    this.search = this.search.bind(this)
  }

  componentDidMount () {
    this.sortByNum()
    this.setCaught()
  }

  async sortByNum () {
    const pokemonRef = firebase.firestore().collection('pokemon')
    const pokemon = await pokemonRef.orderBy('number');
    pokemon
      .onSnapshot(
        querySnapshot => {
          const newPokemon = []
          querySnapshot.forEach(doc => {
            const pokemon = doc.data()
            newPokemon.push(pokemon)
          });
          this.setState({pokemon: newPokemon})
          this.setState({renderedPokemon: newPokemon})
        },
        error => {
          console.log(error)
        }
      )
  }

  async sortByName () {
    const pokemonRef = firebase.firestore().collection('pokemon')
    const pokemon = await pokemonRef.orderBy('name');
    pokemon
      .onSnapshot(
        querySnapshot => {
          const newPokemon = []
          querySnapshot.forEach(doc => {
            const pokemon = doc.data()
            newPokemon.push(pokemon)
            console.log(newPokemon)
          });
          this.setState({renderedPokemon: newPokemon})
        },
        error => {
          console.log(error)
        }
      )
  }

  async setCaught(pokeNum) {
    const pokeRef = firebase.firestore().collection('users').doc(this.state.user.id)
      .collection('pokemon')
      .doc('standard')
    const pokemon = await pokeRef
    pokemon
      .onSnapshot(
        querySnapshot => {
          this.setState({caught: querySnapshot.data()})
        }
      )
  }

  async handleCatch (pokemon) {
    console.log('you caught it')
    pokemon = pokemon.toLowerCase()
    if (this.state.caught[pokemon]) {
      const data = {[pokemon]: false}
      firebase.firestore().collection('users').doc(this.state.user.id)
        .collection('pokemon')
        .doc('standard')
        .set(data, {merge: true})
    }
    else {
      const data = {[pokemon]: true}
      firebase.firestore().collection('users').doc(this.state.user.id)
        .collection('pokemon')
        .doc('standard')
        .set(data, {merge: true})
    }
  }

  styleMe (pokemon) {
    pokemon = pokemon.toLowerCase()
    if (this.state.caught[pokemon]) {
      return styles.caughtContainer
    } else {
      return styles.uncaughtContainer
    }
  }

  search (text) {
    text = text.toLowerCase()
    const render = []
    this.state.pokemon.map(pokemon =>{
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
          onPress={this.sortByName}
          title='Sort By Name'
          style={styles.buttonLeft}
        />
        <Button
          onPress={this.sortByNum}
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
