import { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Alert } from 'react-native'

import { Container, Content, Icon } from './styles'

import { Header } from '@components/Header'
import { Highlight } from '@components/Highlight'
import { Button } from '@components/Button'
import { Input } from '@components/Input'
import { groupCreate } from '@storage/group/groupCreate'
import { AppError } from '@utils/AppError'

export function NewGroup() {
  const [group, setGroup] = useState('')

  const navigation = useNavigation()

  const handleNewGroup = async () => {
    try {
      if (group.trim().length === 0) {
        Alert.alert('Novo Grupo', 'Informe o nome da turma.')
      }

      await groupCreate(group)

      navigation.navigate('players', { group })
    } catch (err) {
      if (err instanceof AppError) {
        Alert.alert('Novo Grupo', err.message)
      } else {
        Alert.alert('Novo Grupo', 'Não foi possível criar um novo grupo.')
        console.error(err)
      }
    }
  }

  return (
    <Container>
      <Header showBackButton />

      <Content>
        <Icon />

        <Highlight
          title="Nova turma"
          subtitle="Crie a turma para adicionar as pessoas"
        />

        <Input placeholder="Nome da turma" onChangeText={setGroup} />

        <Button
          title="Criar"
          style={{ marginTop: 20 }}
          onPress={handleNewGroup}
        />
      </Content>
    </Container>
  )
}
