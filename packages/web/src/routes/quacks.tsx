import Quacks from '@/games/quacks';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/quacks')({
    component: Quacks,
});
