import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App: React.FC = () => {
  const [semaphoreColor, setSemaphoreColor] = useState<'red' | 'yellow' | 'green'>('red');

  useEffect(() => {
    fetchSemaphoreColor();
    const interval = setInterval(fetchSemaphoreColor, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchSemaphoreColor = async () => {
    try {
      const response = await axios.get('http://192.168.0.105:3002/consultaStatus', {
        params: {
          uuid: "123456",
        }
      });

      const status = response.data;

      if (status === 'Atencao') {
        setSemaphoreColor('yellow');
      } else if (status === 'Manutencao') {
        setSemaphoreColor('red');
      } else if (status === 'Ativo') {
        setSemaphoreColor('green');
      }

    } catch (error) {
      console.log(error);
    }
  };


  const changeSemaphoreColor = async () => {
    setSemaphoreColor('yellow');

    try {
      await axios.post('http://192.168.0.105:3002/changeStatusMaquina', {
        codigo: "123456",
        status: "Atencao"
      });

    } catch (error) {
      console.log(error);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      border: '1px solid gray',
      padding: '20px',
      marginTop: '20px',
      marginBottom: '20px',
    },
    semaphore: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '10px',
      border: '1px solid black',
      borderRadius: '10px',
      padding: '10px',
    },
    circle: {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      backgroundColor: 'gray',
      cursor: 'pointer',
    },
    active: {
      border: '2px solid black',
    },
    button: {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      backgroundColor: 'gray',
      border: 'none',
      cursor: 'pointer',
      marginTop: '10px',
    },
    yellow: {
      backgroundColor: 'orange',
    },
  };
  

  return (
    <div style={styles.container}>
      <div style={styles.semaphore}>
        <div
          style={{
            ...styles.circle,
            ...semaphoreColor === 'red' ? styles.active : {},
            backgroundColor: semaphoreColor === 'red' ? 'red' : 'gray',
          }}
        ></div>
        <div
          style={{
            ...styles.circle,
            ...semaphoreColor === 'yellow' ? styles.active : {},
            backgroundColor: semaphoreColor === 'yellow' ? 'orange' : 'gray',
          }}
        ></div>
        <div
          style={{
            ...styles.circle,
            ...semaphoreColor === 'green' ? styles.active : {},
            backgroundColor: semaphoreColor === 'green' ? 'green' : 'gray',
          }}
        ></div>
      </div>
      <button style={{ ...styles.button, ...styles.yellow }} onClick={changeSemaphoreColor}>
        Atenção
      </button>
    </div>
  );
};

export default App;
