import { FC, useEffect, useState } from 'react'

// Styles
import styles from '../../styles/faq/Faq.module.scss'

// Import components
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
import axios from 'axios'
import { HostStatus } from '@types'
import Link from 'next/link'
import { serverHandle } from 'utils/graphql'
import { PLAYER_BY_STEAMIDS } from 'types/graphql/quary'
import { Player } from '@store'
import Head from 'next/head'
// import { LanguageContext } from '../App'

interface Developers extends Partial<Player> {
  steamid: string
  id: number
  nickname: string
  description: Record<Language, string>
}

interface FaqInner {
  title: string
  text: JSX.Element | ((any) => void)
}

type FaqContent = Record<Language, FaqInner>

enum Language {
  EN = 'EN',
  RU = 'RU',
}

interface Props {
  hostStatus: HostStatus
  developers: Developers[]
}

const aboutText: FaqContent = {
  EN: {
    title: 'About server',
    text: (
      <div className={styles.about}>
        <div className={styles.aboutItem}>
          <p className={styles.aboutText}>
            &emsp;A server for trick surfing, one of the modes created by the
            gaming community based on surf mechanics. The server tracks the
            player's movements on the map and, if the trajectories are correct,
            counts the performance of one or another tricks, currently 3 maps
            are available <b>Ski2 </b>
            <code>full coverage</code> / <b>xDream </b>
            <code>mostly tricks</code> / <b>Aero </b>
            <code>alpha</code>. All possible routes on these maps can be found
            in the
            <Link href="/tricks">
              <a className={styles.aboutLink}>/tricks</a>
            </Link>
            section. All tricks are divided into two types with Pre-Strafe and
            Unlimited. About each in brief
          </p>
        </div>
        <p className={styles.aboutText}>
          &emsp;<em>Pre-Strafe </em> - The beginning of the trip always starts
          from a place and tracking happens only after the jump (when the player
          leaves the place(triggers) which is the start of one or another
          trick). The speed must not be greater than
          <strong> 405</strong>. In order to achieve this speed you need to be
          able to make a special U-turn, which will help you gain speed (the
          power of higher mathematics to help you).
        </p>
        <p className={styles.aboutText}>
          &emsp;<em>Unlimited </em>- Start of Trick may be from any spot and at
          any speed but you can achieve it.
        </p>
        <p className={styles.aboutText}>
          &emsp;If you successfully complete the tricks, they will be added to
          the database and you will get the results (in terms of speed and
          time). You can see all the stats in the
          <Link href="/tricks">
            <a className={styles.aboutLink}>/leaderboards</a>
          </Link>
          , where the places are calculated according to the 4 tops
          <code>
            (Sum of all points for tricks / Sum of all unique tricks points /
            Sum of all unique tricks points)
          </code>
          . There is also a daily score table. On the server you can write{' '}
          <code>!d / !daily</code> and do the proposed tricks, this will give
          you points for the difficulty of the daily tricks. If you have an
          epiphany and suddenly see an awesome route, then you can always write
          it in
          <Link href="/tricks">
            <a className={styles.aboutLink}>/trick-creator</a>
          </Link>
          , after moderation the tricks will be published.
        </p>
        <p className={styles.aboutText}>
          &emsp;Due to the tracking of most events, there are achievements
          affecting various areas on the server, all of which can be accessed
          <Link href="/tricks">
            <a className={styles.aboutLink}>/achievements</a>
          </Link>
        </p>
        <p className={styles.aboutText}>
          &emsp;The server and all its additions were made on the enthusiasm of
          a couple of people and the moral support of the community. The entire
          development team is on a volunteer basis, and if you have a desire to
          take part in this, well, or just adopt what is already available, and
          maybe even support this project, I will be glad to talk discord -
        </p>
        <p className={styles.aboutText}>
          Server ip{' '}
          <code>
            <a className="link" href="steam://connect/194.147.90.131:27015">
              194.147.90.131:27015
            </a>
          </code>
        </p>
      </div>
    ),
  },
  RU: {
    title: 'О сервере',
    text: (
      <div className={styles.about}>
        <div className={styles.aboutItem}>
          <p className={styles.aboutText}>
            &emsp;Сервер для трик серфа, один из режимов, созданный игровым
            сообществом, базирующимся на механики скольжения. Сервер отслеживает
            перемещение игрока по карте и при правильных траекториях засчитывает
            выполнения того или иного трика, на данный момент доступны 3 карты{' '}
            <b>Ski2 </b>
            <code>полное покрытие</code> / <b>xDream </b>
            <code>большинство триков</code> / <b>Aero </b>
            <code>в разработке</code>. Все возможные маршруты на данных картах
            можно посмотреть в резделе
            <Link href="/tricks">
              <a className={styles.aboutLink}>/tricks</a>
            </Link>
            . Все трики делятся два типа с Pre-Strafe и Unlimited. О каждом в
            кратце
          </p>
        </div>
        <p className={styles.aboutText}>
          &emsp;<em>Pre-Strafe </em> - Начало трика обязательно начинается с
          места и отслеживание происходит только после прыжка (когда игрок
          покинет места, которое является началом того или иного трика). При
          этом скорость не должна быть больше
          <strong> 405</strong>. Чтобы добиться такой скорости, нужно уметь
          делать специальный разворот благодаря которому вы будете приобретать
          скорость (сила высшей математике вам в помощь)
        </p>
        <p className={styles.aboutText}>
          &emsp;<em>Unlimited </em>- Начало трика может быть с любого места и с
          не любой скоростью, главное достичь результата.
        </p>
        <p className={styles.aboutText}>
          &emsp;При успешном выполнении трика, он будет добавлен в базу данных,
          а вы свою очередь получите его результаты ( скорость и время). Всю
          статистику вы можете посмотреть в разделах
          <Link href="/leaderboards">
            <a className={styles.aboutLink}>/leaderboards</a>
          </Link>
          в котором места высчитывается по 4 топам
          <code>
            ( Сумма всех очков за выполнненые трики / Сумма всех очков
            уникальных выполнненых триков / Сумма всех выполнныных триков /
            Сумма всех уникальных выполнненых триков )
          </code>
          . Также имеется таблица рейтинга по дайли трикам. На сервере вы можете
          написать <code>!d / !daily</code> и выполнить достпуный трик, за это
          вы получите очки относительно сложности дейли трика. Если у вас пришло
          прозрение и вы вдруг увидели восхитительный рут, в таком случае вы
          всегда можете записать его в разделе
          <Link href="/trick-creator">
            <a className={styles.aboutLink}>/trick-creator</a>
          </Link>
          , после провки модерацией данный трик будет опубликован.
        </p>
        <p className={styles.aboutText}>
          &emsp;Благодаря отслеживанию большинства событий, на сервере
          присутствуют достижения затрагивающие различные сферы, со всеми ними
          можно ознакомиться в разделе
          <Link href="/achievements">
            <a className={styles.aboutLink}>/achievements</a>
          </Link>
        </p>
        <p className={styles.aboutText}>
          &emsp;Сервер и все его дополнения были сделаны на энтузиазме пары
          человек и моральной поддержкой сообщества. Вся команда разработчиков
          находится на волонтерской основе, и если у вас есть желание принять
          участие в этом, ну или просто перенять, то что уже имеется, а может и
          вовсе поддержать данный проект, буду рад побеседовать discord -
        </p>
        <p className={styles.aboutText}>
          Server ip
          <code>
            <a className="link" href="steam://connect/194.147.90.131:27015">
              194.147.90.131:27015
            </a>
          </code>
        </p>
      </div>
    ),
  },
}

const cmdText: FaqContent = {
  EN: {
    title: 'Available commands',
    text: (
      <div className={styles.commands}>
        <p className={styles.commandsText}>
          &emsp;<code>!ski2 !strafes </code> - select a map to track routes
        </p>
        <p className={styles.commandsText}>
          &emsp;<code>!saveloc !startpos </code> - save your position
        </p>
        <p className={styles.commandsText}>
          &emsp;<code>!teleport !tele !r !back </code> - teleport to saved
          position
        </p>
        <p className={styles.commandsText}>
          &emsp;<code>!mhud </code> - set up your hud with speed and pressing
          keys keyboard
        </p>
        <p className={styles.commandsText}>
          &emsp;<code>!triggers </code>
          <code>!t </code> - show triggers touch
        </p>
        <p className={styles.commandsText}>
          &emsp;<code>!showtriggers </code>
          <code>!st </code> - show world triggers
        </p>
        <p className={styles.commandsText}>
          &emsp;<code>!daily </code>
          <code>!d </code> - daily tricks
        </p>
        <p className={styles.commandsText}>
          &emsp;<code>!skybox </code>
          <code>!sky </code> - skybox change
        </p>
        <p className={styles.commandsText}>
          &emsp;<code>!skin </code>
          <code>!s </code> - get skins for achievements
        </p>
        <p className={styles.commandsText}>
          &emsp;<code>!trickassist </code>
          <code>!ta </code> - display trigger touch information in chat
        </p>
        <p className={styles.commandsText}>
          &emsp;<code>!tah </code> - display trigger touch information on screen
        </p>
        <p className={styles.commandsText}>
          &emsp;<code>!pack </code>
          <code>!p </code> - tricks pack
        </p>
        <p className={styles.commandsText}>
          &emsp;<code>!noclipme </code> <b className={styles.vip}>vip</b> -
          enable / disable flight mode
        </p>
        <p className={styles.commandsText}>
          &emsp;<code>!zone </code> <b className={styles.vip}>vip</b> -
          teleportation to the nearest possible starting area of the trick
        </p>
      </div>
    ),
  },
  RU: {
    title: 'Доступные команды',
    text: (
      <div className={styles.commands}>
        <p className={styles.commandsText}>
          &emsp;<code>!ski2 !strafes </code> - выбрать карту для отслеживания
          траекторий
        </p>
        <p className={styles.commandsText}>
          &emsp;<code>!saveloc !startpos </code> - сохранить свою позицию
        </p>
        <p className={styles.commandsText}>
          &emsp;<code>!teleport !tele !r !back </code> - телепорт к сохраненной
          позиции
        </p>
        <p className={styles.commandsText}>
          &emsp;<code>!mhud </code> - настройка худа со скоростью и отображением
          клавиш
        </p>
        <p className={styles.commandsText}>
          &emsp;<code>!triggers </code>
          <code>!t </code> - отображение касания триггеров
        </p>
        <p className={styles.commandsText}>
          &emsp;<code>!showtriggers </code>
          <code>!st </code> - отображение моделей триггеров
        </p>
        <p className={styles.commandsText}>
          &emsp;<code>!daily </code>
          <code>!d </code> - список ежедневных заданий-триков
        </p>
        <p className={styles.commandsText}>
          &emsp;<code>!skybox </code>
          <code>!sky </code> - смена скайбокса
        </p>
        <p className={styles.commandsText}>
          &emsp;<code>!skin </code>
          <code>!s </code> - получение скина за выполненные достижения
        </p>
        <p className={styles.commandsText}>
          &emsp;<code>!trickassist </code>
          <code>!ta </code> - отображение информации о касании триггеров при
          входе и выходе в чате
        </p>
        <p className={styles.commandsText}>
          &emsp;<code>!tah </code> - отображение информации о касании триггеров
          при входе и выходе на экране
        </p>
        <p className={styles.commandsText}>
          &emsp;<code>!pack </code>
          <code>!p </code> - tricks pack
        </p>
        <p className={styles.commandsText}>
          &emsp;<code>!noclipme </code>{' '}
          <b className="faq-about__text vip">vip</b> - включить / выключить
          режим полета
        </p>
        <p className={styles.commandsText}>
          &emsp;<code>!zone </code> <b className="faq-about__text vip">vip</b> -
          телепортация к ближайщей возможной зоне старта трика
        </p>
      </div>
    ),
  },
}

const hostText: any = {
  EN: {
    title: 'Host status',
    text: (hostStatus: HostStatus) => {
      return (
        <div className={styles.host}>
          <p className={styles.hostText}>
            &emsp;<code>Server status</code> -{' '}
            {hostStatus?.online === 1 ? 'online' : 'offline'}
          </p>
          <p className={styles.hostText}>
            &emsp;<code>Ip address </code> - {hostStatus?.server_address}
          </p>
          <p className={styles.hostText}>
            &emsp;<code>Current online</code> -{' '}
            {hostStatus?.data?.s?.players +
              ' / ' +
              hostStatus?.data?.s?.playersmax}
          </p>
          <p className={styles.hostText}>
            &emsp;<code>Map</code> - {hostStatus?.data?.s?.map}
          </p>
          <p className={styles.hostText}>
            &emsp;<code>Location </code> - {hostStatus?.server_location}
          </p>
          <p className={styles.hostText}>
            &emsp;<code>Hardware </code> - {hostStatus?.server_type}
          </p>
          <p className={styles.hostText}>
            &emsp;<code>Days to block </code> - {hostStatus?.server_daystoblock}
          </p>
        </div>
      )
    },
  },
  RU: {
    title: 'Информацмя о хосте',
    text: (hostStatus: HostStatus) => {
      return (
        <div className={styles.host}>
          <p className={styles.hostText}>
            &emsp;<code>Статус сервера</code> -{' '}
            {hostStatus?.online === 1 ? 'включен' : 'выключен'}
          </p>
          <p className={styles.hostText}>
            &emsp;<code>Айпи адрес </code> - {hostStatus?.server_address}
          </p>
          <p className={styles.hostText}>
            &emsp;<code>Текущий онлайн</code> -{' '}
            {hostStatus?.data?.s?.players +
              ' / ' +
              hostStatus?.data?.s?.playersmax}
          </p>
          <p className={styles.hostText}>
            &emsp;<code>Карта</code> - {hostStatus?.data?.s?.map}
          </p>
          <p className={styles.hostText}>
            &emsp;<code>Локация </code> - {hostStatus?.server_location}
          </p>
          <p className={styles.hostText}>
            &emsp;<code>Железяка </code> - {hostStatus?.server_type}
          </p>
          <p className={styles.hostText}>
            &emsp;<code>Дней до отключения </code> -{' '}
            {hostStatus?.server_daystoblock}
          </p>
        </div>
      )
    },
  },
}

const teamText: any = {
  EN: {
    title: 'Development team',
    text: <div></div>,
  },
  RU: {
    title: 'Команда разработчиков',
    text: <div></div>,
  },
}

// Component
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const Faq = ({ hostStatus, developers }: Props) => {
  // Need create i18n
  const [state, setState] = useState<Language>(Language.EN)
  // const { setLanguage } = useSetApplication()
  // const { language } = useApplication()

  return (
    <>
      <Head>
        <title>SurfGxds faq</title>
        <meta name="description" property="og:description" content="SurfGxds" />
        <meta name="og:title" content="SurfGxds" />
        <meta name="robots" content="INDEX,FOLLOW" />
        <link rel="canonical" />
      </Head>
      <section className={styles.faq}>
        <h5 className={styles.header}>FAQ</h5>

        {/*  <h4 className={styles.hr}>
      <TopTooltip title={'Change Language'} className="faq-language">
          <div
            onClick={(e) => {
              setLanguage(language === 'en' ? 'ru' : 'en')
            }}
            className="faq-language"
          >
            Switching to {language === 'en' ? 'Russian' : 'English'}
          </div>
        </TopTooltip> 
      </h4>*/}

        <h4 className={styles.hr}> {aboutText[state].title}</h4>
        {aboutText[state].text}

        <h4 className={styles.hr}> {cmdText[state].title}</h4>
        {cmdText[state].text}

        <h4 className={styles.hr}> {hostText[state].title}</h4>
        {hostText[state].text(hostStatus)}

        <h4 className={styles.hr}> {teamText[state].title}</h4>

        <div className={styles.dev}>
          {developers.map((val, key) => {
            // console.log('val', val)

            return (
              <div key={key}>
                <div className={styles.embend}>
                  <div className={styles.embendAvatar}>
                    <img
                      src={
                        val?.avatarCustom
                          ? val?.avatarCustom
                          : val?.avatarfull
                          ? val?.avatarfull
                          : process.env.AVATAR_NULL
                      }
                      alt="none avatar"
                    ></img>
                  </div>
                  <div className={styles.embendBody}>
                    <Link href={'/' + val.steamid}>
                      <a className={styles.embendNick}>{val.nickname}</a>
                    </Link>
                    <p className={styles.embendDescription}>
                      {val.description[state]}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        {/* <h4 className="faq-hr">Q & A</h4>
      <div>empty</div> */}
      </section>
    </>
  )
}

Faq.getInitialProps = async ({ query, store, res }) => {
  try {
    const { data } = await axios.get<HostStatus>(
      `https://www.myarena.ru/api.php?query=status&token=` +
        process.env.NEXT_MY_ARENA_TOKEN
    )

    const developers: Developers[] = [
      {
        steamid: '76561198177823310',
        id: 54,
        nickname: 'EVAI',

        description: {
          EN: 'Main developer of the plugin and website, and responsible for the database for the entire project',
          RU: 'Основной разработчик плагина и веб-сайта, и также ответственный за базу данных всего проекта',
        },
      },
      {
        steamid: '76561198279987304',
        id: 49,
        nickname: 'Halisha',
        description: {
          EN: 'Game designer, projected and came up with the server and plugin concept',
          RU: 'Геймдизайнер, спроектировал карту и придумал основную концепцию плагина',
        },
      },
      {
        steamid: '76561198120754101',
        id: 73,
        nickname: 'Parta',
        description: {
          EN: 'Head tester and trick creator',
          RU: 'Главный тестер и создатель множества триков',
        },
      },
      {
        steamid: '76561198058934072',
        id: 65,
        nickname: 'ArturPertuh',
        description: {
          EN: 'Dxg eater, surf genius and discord lord',
          RU: 'Рамповый владыка, дискордный повелитель и просто тригональный маестро',
        },
      },
    ]

    const [players, errors] = await serverHandle(res, PLAYER_BY_STEAMIDS, {
      steamids64: developers.map((val) => val.steamid),
    })

    return {
      hostStatus: data,
      developers: developers.map((val) => {
        return {
          ...val,
          ...players.find((val1: Player) => val1.steamid64 === val.steamid),
        }
      }),
    }
  } catch (err) {
    // console.log('err', err)
  } finally {
  }
}

export default Faq
