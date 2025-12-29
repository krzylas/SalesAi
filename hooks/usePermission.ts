import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';

export const usePermission = () => {
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const requestPermission = async () => {
    const { status } = await Audio.requestPermissionsAsync();
    setHasPermission(status === 'granted');
    return status === 'granted';
  };

  return { hasPermission, requestPermission };
};
