import { Container, Message } from './styles'

type Props = {
  message: string
}

export function ListEmpty(props: Props) {
  return (
    <Container>
      <Message>{props.message}</Message>
    </Container>
  )
}
