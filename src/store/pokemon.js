import { firebase } from '../firebase/config'

export const SET_POKEMON = 'SET_POKEMON'
export const SET_CAUGHT = 'SET_CAUGHT'
export const CATCH_EM = 'CATCH_EM'


export const setPokemon = pokemon => {
  return {
    type: SET_POKEMON,
    pokemon
  }
}

export const setCaught = caught => {
  return {
    type: SET_CAUGHT,
    caught
  }
}

export const catchEm = pokemon => {
  return {
    type: CATCH_EM,

  }
}

export const getPokemon = () => async dispatch => {
  try {
    const pokemonRef = firebase.firestore().collection('pokemon')
    const snapshot = await pokemonRef.get();
    const newPokemon = []
    snapshot.forEach(doc => {
      const pokemon = doc.data()
      newPokemon.push(pokemon)
    })
    dispatch(setPokemon(newPokemon))
  } catch (error) {
    console.log(error)
  }
}

export const getCaught = (userId) => async dispatch => {
  try {
    const pokeRef = firebase.firestore().collection('users').doc(userId)
    const pokemon = await pokeRef.get()
    dispatch(setCaught(pokemon.data().caught))
  } catch (error) {
    console.log(error)
  }
}

// async catchMon (pokemon) {
//   pokemon = pokemon.toLowerCase()
//   if (this.state.caught[pokemon]) {
//     const data = {[pokemon]: false}
//     firebase.firestore().collection('users').doc(this.state.user.id)
//       .collection('pokemon')
//       .doc('standard')
//       .set(data, {merge: true})
//   }
//   else {
//     const data = {[pokemon]: true}
//     firebase.firestore().collection('users').doc(this.state.user.id)
//       .collection('pokemon')
//       .doc('standard')
//       .set(data, {merge: true})
//   }
// }

const initialState = {}

export default function pokemonReducer (state = initialState, action) {
  switch (action.type) {
    case SET_POKEMON:
      return {...state, pokemon: action.pokemon}
    case SET_CAUGHT:
      return {...state, caught: action.caught}
    default:
      return state
  }
}
