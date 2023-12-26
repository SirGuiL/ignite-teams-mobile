import { playersGetByGroup } from './playersGetByGroup'

interface playersGetByGroupAndTeamProps {
  group: string
  team: string
}

export const playersGetByGroupAndTeam = async (
  props: playersGetByGroupAndTeamProps
) => {
  try {
    const storage = await playersGetByGroup(props.group)

    const players = storage.filter((player) => player.team === props.team)

    return players
  } catch (err) {
    throw err
  }
}
