import { useEffect, useState, useRef } from 'react'
import { Alert, FlatList, TextInput, Keyboard } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

import { playerAddByGroup } from '@storage/player/playerAddByGroup'
import { playersGetByGroupAndTeam } from '@storage/player/playerGetByGroupAndTeam'
import { playerStorageDTO } from '@storage/player/PlayerStorageDTO'

import { AppError } from '@utils/AppError'

import { Header } from '@components/Header'
import { Highlight } from '@components/Highlight'
import { ButtonIcon } from '@components/ButtonIcon'
import { Input } from '@components/Input'
import { Filter } from '@components/Filter'
import { PlayerCard } from '@components/PlayerCard'
import { ListEmpty } from '@components/ListEmpty'
import { Button } from '@components/Button'

import { Container, Form, HeaderList, NumberOfPlayers } from './styles'
import { playerRemoveByGroup } from '@storage/player/playerRemoveByGroup'
import { groupRemove } from '@storage/group/groupRemove'
import { Loading } from '@components/Loading'

type RouteParams = {
  group: string
}

export function Players() {
  const [isLoading, setIsLoading] = useState(true)
  const [newPlayerName, setNewPlayerName] = useState('')
  const [selectedTeam, setSelectedTeam] = useState('Time A')
  const [players, setPlayers] = useState<playerStorageDTO[]>([])

  const navigation = useNavigation()
  const route = useRoute()
  const { group } = route.params as RouteParams

  const newPlayerNameInputRef = useRef<TextInput>(null)

  const removePlayer = async (playerId: string) => {
    try {
      await playerRemoveByGroup({
        group,
        playerId: playerId,
      })
    } catch (err) {
      console.error(err)
      Alert.alert('Remover jogador', 'Não foi possível remover esse jogador.')
    }

    setPlayers((oldValue) => oldValue.filter((p) => p.id !== playerId))
    fechPlayerByTeam()
  }

  const handleAddPlayer = async () => {
    if (newPlayerName.trim().length === 0) {
      return Alert.alert(
        'Novo jogador',
        'Informe o nome do jogador para adicionar.'
      )
    }

    try {
      const newPlayer = {
        id: uuidv4(),
        name: newPlayerName,
        team: selectedTeam,
      }

      await playerAddByGroup({
        newPlayer: newPlayer,
        group: group,
      })

      newPlayerNameInputRef.current.blur()
      Keyboard.dismiss()

      fechPlayerByTeam()
      setNewPlayerName('')
    } catch (err) {
      if (err instanceof AppError) {
        Alert.alert('Novo jogador', err.message)
      } else {
        Alert.alert('Novo jogador', 'Não foi possível adicionar o jogador.')

        console.error(err)
      }
    }
  }

  const fechPlayerByTeam = async () => {
    try {
      setIsLoading(true)
      const playersByTeam = await playersGetByGroupAndTeam({
        group,
        team: selectedTeam,
      })

      setPlayers(playersByTeam)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const removeGroup = async () => {
    try {
      await groupRemove(group)
      navigation.navigate('groups')
    } catch (err) {
      console.error(err)
      Alert.alert('Remover grupo', 'Não foi possível remover o grupo.')
    }
  }

  const handleGroupRemove = async () => {
    Alert.alert('Remover grupo', 'Tem certeza que deseja remove esse grupo?', [
      { text: 'Não', style: 'cancel' },
      { text: 'Sim', onPress: () => removeGroup() },
    ])
  }

  useEffect(() => {
    fechPlayerByTeam()
  }, [selectedTeam])

  return (
    <Container>
      <Header showBackButton />

      <Highlight title={group} subtitle="adicione a galera e separe os times" />

      <Form>
        <Input
          inputRef={newPlayerNameInputRef}
          placeholder="Nome da pessoa"
          autoCorrect={false}
          onChangeText={setNewPlayerName}
          value={newPlayerName}
          onSubmitEditing={handleAddPlayer}
          returnKeyType="done"
        />

        <ButtonIcon icon="add" onPress={handleAddPlayer} />
      </Form>

      <HeaderList>
        <FlatList
          data={['Time A', 'Time B']}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Filter
              title={item}
              isActive={item === selectedTeam}
              onPress={() => setSelectedTeam(item)}
            />
          )}
          showsHorizontalScrollIndicator={false}
          horizontal
        />

        <NumberOfPlayers>{players.length}</NumberOfPlayers>
      </HeaderList>

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={players}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PlayerCard
              name={item.name}
              onRemove={() => removePlayer(item.id)}
            />
          )}
          ListEmptyComponent={<ListEmpty message="Não há pessoas nesse time" />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            { paddingBottom: 50 },
            players.length === 0 && { flex: 1 },
          ]}
        />
      )}

      <Button
        title="Remover turma"
        type="secondary"
        onPress={handleGroupRemove}
      />
    </Container>
  )
}
