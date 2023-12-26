import AsyncStorage from '@react-native-async-storage/async-storage'

import { PLAYER_COLLECTION } from '@storage/storageConfig'
import { playersGetByGroup } from './playersGetByGroup'

interface playerRemoveByGroupProps {
  playerId: string
  group: string
}

export const playerRemoveByGroup = async (props: playerRemoveByGroupProps) => {
  try {
    const storage = await playersGetByGroup(props.group)

    const filtered = storage.filter((player) => player.id !== props.playerId)

    const players = JSON.stringify(filtered)

    await AsyncStorage.setItem(`${PLAYER_COLLECTION}-${props.group}`, players)
  } catch (err) {
    throw err
  }
}
