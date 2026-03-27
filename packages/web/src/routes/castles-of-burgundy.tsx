import CastlesOfBurgundy from '@/games/castles-of-burgundy';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/castles-of-burgundy')({
    component: CastlesOfBurgundy,
});
