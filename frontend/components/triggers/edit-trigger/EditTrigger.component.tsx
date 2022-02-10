import React, { FC, useState, useEffect } from 'react'
import cn from 'classnames'
import LinearProgress from '@mui/material/LinearProgress'

// Styles
import stylesModal from '../../../styles/modal/ModalSkelet.module.scss'
import styles from './EditTrigger.module.scss'
const {
  paHeader,
  paHeaderTitle,
  paHeaderClose,
  paPreview,
  paPreviewInfo,
  paPreviewInput,
  paPreviewImg,
  paInfo,
  paInfoItem,
  paSubmit,
  paSubmitUpload,
  paSubmitUploadActive,
  paSubmitClose,
} = styles

// Icons
import { IoIosClose } from 'react-icons/io'

// Components

// Custom Hooks
import { usePlayer, usePlayerPreference } from 'hooks/store/player'
import { useApp } from '../../../hooks/store/app/useApp'
import { useTrick } from 'hooks/store/trick'

// Utils
import { storage } from '../../../utils/firebase'
import { uploadBytesResumable, ref, getDownloadURL } from '@firebase/storage'
import MyInput from '../../UI/MyInput/MyInput.component'
import { Trigger } from '@store'

// Interface
interface Props {
  trigger: Trigger
  close?: any
  isOpen?: any
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const EditTrigger: FC<Props> = (props: Props) => {
  const { updatingTrigger } = useTrick()
  const { currentMap } = useApp()
  const { playerInfo } = usePlayer()

  useEffect(() => {
    setImage({
      image: null,
      imageUrl: props.trigger?.src || null,
    })
    setTriggerName(props.trigger?.name)
  }, [props.isOpen])

  const [triggerName, setTriggerName] = useState<string>(props.trigger.name)
  const [image, setImage] = useState<any>({
    image: null,
    imageUrl: props.trigger.src,
  })
  const [progress, setProgress] = useState<any>(0)

  const handleChange = (e: any) => {
    if (!e.target?.files[0]) return
    if (
      (e.target.files[0].type === 'image/gif' ||
        e.target.files[0].type === 'image/jpeg' ||
        e.target.files[0].type === 'image/jpg' ||
        e.target.files[0].type === 'image/png') &&
      e.target.files[0].size < 9999999
    ) {
      setImage({
        image: e.target.files[0],
        imageUrl: URL.createObjectURL(e.target.files[0]),
      })
    }
    console.log(e.target.files[0])
  }

  const clickUploadHandler = (e: any) => {
    // if (playerInfo?.role !== 'admin') return

    const storageRef = ref(
      storage,
      `triggers/${currentMap.name}/${props.trigger.id.toString()}`
    )
    const uploadTask = uploadBytesResumable(storageRef, image.image)

    if (!verifyImage() || !verifyTriggerName()) return

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        )
        setProgress(progress)
      },
      (error) => {
        console.log(error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          props.close()
          setProgress(0)
          updatingTrigger(props.trigger.name, props.trigger.id, downloadURL)
        })
      }
    )
  }

  const verifyImage = () => {
    if (props.trigger?.src !== image.imageUrl && progress === 0) return true

    return false
  }

  const verifyTriggerName = () => {
    if (triggerName !== '') return true

    return false
  }

  return (
    <form
      onClick={(e) => e.stopPropagation()}
      className={stylesModal.formContent}
    >
      <section className={stylesModal.formInner}>
        <div className={paHeader}>
          <div className={paHeaderTitle}>Trigger settings</div>
        </div>

        <div className={paPreview}>
          <div className={paPreviewInfo}>
            {/* <Image /> */}
            <div>Drop your image here</div>
          </div>
          <input
            onChange={handleChange}
            className={paPreviewInput}
            type="file"
            accept="image/gif,image/jpeg,image/png"
          />
          <img
            className={paPreviewImg}
            alt="none"
            src={image.imageUrl ? image.imageUrl : process.env.NOT_INVITES}
          ></img>
        </div>

        <LinearProgress
          variant="determinate"
          sx={{ backgroundColor: 'transparent' }}
          value={progress}
        />

        <div className={paInfo}>
          <div className={styles.paInfoTrigger}>
            <MyInput
              label={'Trigger in game name'}
              model={{ value: triggerName, setValue: setTriggerName }}
              type={'text'}
              name={'search'}
              // callback={}
              // debounce={350}
            />
          </div>
          {/* <span>
            <div className={paInfoItem}>
              <span>X</span>
              <input />
            </div>
            <div className={paInfoItem}>
              <span>Y</span>
              <input />
            </div>
            <div className={paInfoItem}>
              <span>Z</span>
              <input />
            </div>
          </span> */}
        </div>

        <div className={paSubmit}>
          <div
            onClick={clickUploadHandler}
            className={cn(paSubmitUpload, {
              [paSubmitUploadActive]: verifyImage() && verifyTriggerName(),
            })}
          >
            Upload
          </div>
          <div onClick={props.close} className={paSubmitClose}>
            Close
          </div>
        </div>
      </section>
      <div className={stylesModal.formClose} onClick={props.close}>
        <IoIosClose />
      </div>
    </form>
  )
}

export default React.memo(EditTrigger)
