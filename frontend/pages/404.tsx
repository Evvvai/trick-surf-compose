import styles from '../styles/error/Error.module.scss'
const { error, errorContent } = styles

///////////////////////////////////////////////////////////////////////////
const Error = () => {
  return (
    <div className={error}>
      <h1 className={errorContent}> ¯\_(ツ)_/¯ </h1>
    </div>
  )
}

export default Error
