import AsyncStorage from '@react-native-async-storage/async-storage'

import { AppError } from '@utils/AppError'
import { PLAYER_COLLECTION } from '@storage/storageConfig'
import { playersGetByGroup } from './playersGetByGroup'

import { playerStorageDTO } from './PlayerStorageDTO'

interface playerAddByGroupProps {
  newPlayer: playerStorageDTO
  group: string
}

export const playerAddByGroup = async (props: playerAddByGroupProps) => {
  try {
    const storedPlayers = await playersGetByGroup(props.group)

    const playerAlreadyExists = storedPlayers.filter(
      (player) => player.name === props.newPlayer.name
    )

    if (playerAlreadyExists.length > 0) {
      throw new AppError('Essa pessoa já foi adicionada no time.')
    }

    const storage = JSON.stringify([...storedPlayers, props.newPlayer])

    await AsyncStorage.setItem(`${PLAYER_COLLECTION}-${props.group}`, storage)
  } catch (err) {
    throw err
  }
}
