import { useEffect } from 'react';
import { Platform } from 'react-native';
import { QuacksScreen } from '../games/quacks/QuacksScreen';

export default function QuacksRoute() {
  useEffect(() => {
    if (Platform.OS === 'web') {
      document.title = 'Quacks Play Guide';
    }
  }, []);
  return <QuacksScreen />;
}
