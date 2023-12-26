import AsyncStorage from '@react-native-async-storage/async-storage'
import { playerStorageDTO } from './PlayerStorageDTO'
import { PLAYER_COLLECTION } from '@storage/storageConfig'

export const playersGetByGroup = async (group: string) => {
  try {
    const storage = await AsyncStorage.getItem(`${PLAYER_COLLECTION}-${group}`)

    const players: playerStorageDTO[] = storage ? JSON.parse(storage) : []

    return players
  } catch (err) {
    throw err
  }
}
