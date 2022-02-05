import styles from "../styles/error/Error.module.scss";
const { error, errorContent } = styles;

///////////////////////////////////////////////////////////////////////////
const Error = ({ statusCode }: any) => {
  return (
    <div className={error}>
      <h1 className={errorContent}>{statusCode} - Page Not Found</h1>
    </div>
  );
};

Error.getInitialProps = ({ res, err }: any) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
