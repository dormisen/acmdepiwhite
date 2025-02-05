
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>404</h1>
      <p style={styles.message}>Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" style={styles.link}>
        Go back to Home
      </Link>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    textAlign: 'center',
    padding: '50px',
  },
  heading: {
    fontSize: '100px',
    margin: '0',
  },
  message: {
    fontSize: '20px',
    margin: '20px 0',
  },
  link: {
    fontSize: '18px',
    textDecoration: 'none',
    color: '#007bff',
  },
};

export default NotFound;
