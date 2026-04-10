import { useEffect } from 'react';
import { Platform } from 'react-native';
import { CoBScreen } from '../games/castles-of-burgundy/CoBScreen';

export default function CastlesOfBurgundyRoute() {
  useEffect(() => {
    if (Platform.OS === 'web') {
      document.title = 'Castles of Burgundy Play Guide';
    }
  }, []);
  return <CoBScreen />;
}
