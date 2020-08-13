import React, { useEffect, useState, Component } from 'react'
import { FlatList, Keyboard, Text, TextInput, TouchableOpacity, View, Image, ScrollView } from 'react-native'
import styles from './styles';
import { firebase } from '../../firebase/config'
import { firestore } from 'firebase';




export default class PokedexScreen extends Component {

  constructor () {
    super()
    this.state = {
      pokemon: []
    }
  }

  async componentDidMount () {
    var storage = firebase.storage()
    const pokemonRef = firebase.firestore().collection('pokemon')
    const pokemon = await pokemonRef.orderBy('number');
    pokemon
      .onSnapshot(
        querySnapshot => {
          const newPokemon = []
          querySnapshot.forEach(doc => {
            const pokemon = doc.data()
            newPokemon.push(pokemon)
            console.log(newPokemon)
          });
          this.setState({pokemon: newPokemon})
        },
        error => {
          console.log(error)
        }
      )
  }

  render () {

    const pokemon = this.state.pokemon

    return (
      <ScrollView>
        <View style={styles.entityContainer}>
          {pokemon.map(pokemon => {
            return (
              <View key={pokemon.number} style={styles.entityContainer}>
                <Text style={styles.entityText}>No. {pokemon.number}</Text>
                <Text style={styles.entityText}>{pokemon.name}</Text>
                <Image source={{uri: pokemon.image}}
                  style={{width:50, height: 50}}/>
              </View>
            )
          })}
        </View>
      </ScrollView>
    )}

}







// export default function PokedexScreen(props) {

//   const [pokemon, setPokemon] = useState([])

//   const pokemonRef = firebase.firestore().collection('pokemon')
//   // const pokemon = await pokemonRef.get();


//   useEffect(() => {
//     pokemonRef
//       .onSnapshot(
//         querySnapshot => {
//           const newPokemon = []
//           querySnapshot.forEach(doc => {
//             const pokemon = doc.data()
//             newPokemon.push(pokemon)
//           });
//           setPokemon(newPokemon)
//         },
//         error => {
//           console.log(error)
//         }
//       )
//   }, [])



//   return (
//     <View><Text>hello</Text></View>

//   )

// }
