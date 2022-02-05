import { useEffect, useRef, useState } from 'react'
import { clientHandle, serverHandle } from 'utils/graphql'
import { PLAYER, PLAYER_STATS } from 'types/graphql/quary'

// Styles
import styles from '../styles/profile/Profile.module.scss'
const {
  profile,
  Dashboard,
  DashboardEdit,
  DashboardBack,
  info,
  Avatar,
  AvatarImage,
  AvatarBack,
  AvatarEdit,
  Name,
  wave,
  profileInner,
} = styles

// Icons
import FooterWaveIcon from '../assets/icon/FooterWave.svg'
import { TiEdit } from 'react-icons/ti'

// Components
import AvatarEditModal from 'components/profile/avatar-edit/AvatarEdit.component'
import DashboardEditModal from 'components/profile/dasboard-edit/DashboardEdit.component'
import ProfileOverview from '../components/profile/profile-overview/ProfileOverview'

// Custom hooks
import { usePlayer } from '../hooks/store/player/usePlayer'
import { useApp } from 'hooks/store/app'

// Utils
import { Portal } from 'utils/portal'
import Modal from 'components/UI/Modal/Modal.component'
import { Player, PlayerStats } from '@store'
import { useRouter } from 'next/dist/client/router'
import Head from 'next/head'
import { changeDecode } from 'utils/changeDecode'

interface Props {
  playerData: Player
  playerStats: PlayerStats
}

/////////////////////////////////////////////////////////////////////////////////////
const Profile = (props: Props) => {
  const router = useRouter()
  const { playerInfo, loadPlayerStats } = usePlayer()
  const { currentMap } = useApp()

  const [isAvatarEdit, setIsAvatarEdit] = useState<boolean>(false)
  const [isDashboardEdit, setIsDashboardEdit] = useState<boolean>(false)

  const [playerData, setPlayerData] = useState<Player>(props.playerData)
  const [playerStats, setPlayerStats] = useState<PlayerStats>(props.playerStats)

  const mounted = useRef<boolean | null>(null)
  useEffect(() => {
    !mounted.current
      ? (mounted.current = true)
      : loadPlayerStats(playerData.steamid64).then((data) =>
          setPlayerStats(data)
        )
  }, [currentMap])

  return (
    <>
      <Head>
        <title>{`${changeDecode(playerData.nick)} | SurfGxds`}</title>
        <meta name="description" content={`Player profile with his stats`} />
      </Head>
      <div className={profile}>
        <div className={Dashboard}>
          <img
            src={
              playerData?.dashboard !== null
                ? playerData.dashboard
                : process.env.DASHBOARD_NULL
            }
            alt="nope"
          ></img>
          <div className={DashboardBack} />

          {playerData.id === playerInfo?.id && (
            <div
              onClick={(e) => setIsDashboardEdit(true)}
              className={DashboardEdit}
            >
              {/* <Icon asset={'Edit'} /> */}
              <TiEdit />
              <Portal selector="#modal">
                <Modal isOpen={isDashboardEdit} setOpen={setIsDashboardEdit}>
                  <DashboardEditModal />
                </Modal>
              </Portal>
            </div>
          )}
        </div>

        <div className={info}>
          <div className={Avatar}>
            <div className={AvatarBack}></div>
            <img
              className={AvatarImage}
              src={
                playerData.avatarCustom !== null
                  ? playerData.avatarCustom
                  : playerData.avatarfull
                  ? playerData.avatarfull
                  : process.env.AVATAR_NULL
              }
              alt="nope"
            ></img>
            {playerData.id === playerInfo?.id && (
              <div
                onClick={(e) => setIsAvatarEdit(true)}
                className={AvatarEdit}
              >
                {/* <Icon asset={'Edit'} /> */}
                <TiEdit />
                <Portal selector="#modal">
                  <Modal isOpen={isAvatarEdit} setOpen={setIsAvatarEdit}>
                    <AvatarEditModal />
                  </Modal>
                </Portal>
              </div>
            )}
          </div>
          {/* <span className={Name}>{playerData.nick}</span> */}
          <span className={Name}>{changeDecode(playerData.nick)}</span>
        </div>
        <FooterWaveIcon className={wave} />
        <div className={profileInner}>
          {playerStats && <ProfileOverview playerStats={playerStats} />}
        </div>
      </div>
    </>
  )
}

Profile.getInitialProps = async ({ query, store, res }) => {
  try {
    const currentMap = store.getState().app.currentMap

    const [playerData, playerDataErrors] = await serverHandle(res, PLAYER, {
      steamid64: query.steamid,
    })
    const [playerStats, playerStatsErrors] = await serverHandle(
      res,
      PLAYER_STATS,
      {
        steamid64: query.steamid,
        mapId: currentMap.id,
      }
    )

    if (!playerData || playerDataErrors) throw new Error()

    return {
      playerData,
      playerStats,
    }
  } catch (e) {
    res.writeHead(307, { Location: '/404' })
    res.end()
  }
}

export default Profile
