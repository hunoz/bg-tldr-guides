import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { games } from '@/utils/constants';
import type { GameId } from '@/types/id';
import '@/home.css';

export default function HomePage() {
    const { t } = useTranslation('common');
    const navigate = useNavigate();

    const handleSelect = (id: GameId) => navigate({ to: `/${id}` });

    return (
        <div className='home'>
            <div className='home-hero'>
                <span className='home-hero-icon' aria-hidden='true'>
                    🎲
                </span>
                <h1>{t('title')}</h1>
                <p className='home-hero-subtitle'>{t('home-subtitle')}</p>
            </div>

            <div className='home-disclaimer'>
                <span className='home-disclaimer-icon' aria-hidden='true'>
                    📖
                </span>
                <p>{t('home-disclaimer')}</p>
            </div>

            <div className='home-features'>
                <div className='home-feature-card'>
                    <div className='home-feature-icon' aria-hidden='true'>
                        ⚡
                    </div>
                    <h3>{t('home-feature-setup')}</h3>
                    <p>{t('home-feature-setup-desc')}</p>
                </div>
                <div className='home-feature-card'>
                    <div className='home-feature-icon' aria-hidden='true'>
                        📋
                    </div>
                    <h3>{t('home-feature-play')}</h3>
                    <p>{t('home-feature-play-desc')}</p>
                </div>
                <div className='home-feature-card'>
                    <div className='home-feature-icon' aria-hidden='true'>
                        🏆
                    </div>
                    <h3>{t('home-feature-scoring')}</h3>
                    <p>{t('home-feature-scoring-desc')}</p>
                </div>
            </div>

            <div className='home-games'>
                <h2>{t('available-guides')}</h2>
                <ul className='home-game-list'>
                    {games.map(game => (
                        <li
                            key={game.id}
                            className='home-game-item'
                            role='button'
                            tabIndex={0}
                            onClick={() => handleSelect(game.id)}
                            onKeyDown={e => {
                                if (e.key === 'Enter' || e.key === ' ') handleSelect(game.id);
                            }}
                        >
                            <span className='home-game-icon' aria-hidden='true'>
                                {game.icon}
                            </span>
                            <span className='home-game-label'>{game.label}</span>
                            <span className='home-game-arrow' aria-hidden='true'>
                                →
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            <p className='home-cta'>{t('home-cta')}</p>
        </div>
    );
}
