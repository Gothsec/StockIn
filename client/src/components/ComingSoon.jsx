// proposito: Nos permite mostrar un mensaje de próximamente

const ComingSoon = () => {
  return (
    <div style={styles.container}>
      <div style={styles.icon}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100"
          height="100"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#2864ec"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="icon icon-tabler icons-tabler-outline icon-tabler-ghost"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M5 11a7 7 0 0 1 14 0v7a1.78 1.78 0 0 1 -3.1 1.4a1.65 1.65 0 0 0 -2.6 0a1.65 1.65 0 0 1 -2.6 0a1.65 1.65 0 0 0 -2.6 0a1.78 1.78 0 0 1 -3.1 -1.4v-7" />
          <path d="M10 10l.01 0" />
          <path d="M14 10l.01 0" />
          <path d="M10 14a3.5 3.5 0 0 0 4 0" />
        </svg>
      </div>
      <h2 style={styles.text}>¡Próximamente :)!</h2>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
  },
  icon: {
    marginBottom: '20px',
  },
  text: {
    color: '#2864ec',
    fontSize: '24px',
  },
};

export default ComingSoon;
