import TransWithHtml from '@/components/TransWithHtml';
import { Trans, useTranslation } from 'react-i18next';

export default function EndOfGameSection() {
    const { t } = useTranslation('castles-of-burgundy');
    const endOfGame = t('endOfGame', { returnObjects: true });
    return (
        <section id='end-of-game'>
            <h2>
                <span className='icon'>🏆</span> {endOfGame.heading}
            </h2>
            <p>{endOfGame.intro}</p>
            <div className='endgame'>
                <h3>{endOfGame.bonusHeading}</h3>
                <ul>
                    {endOfGame.bonuses.map((bonus, i) => (
                        <li key={i} dangerouslySetInnerHTML={{ __html: bonus }} />
                    ))}
                </ul>
            </div>
            <div className='divider'>· · · · · · ·</div>
            <p style={{ textAlign: 'center' }}>
                <TransWithHtml
                    ns='castles-of-burgundy'
                    i18nKey='endOfGame.winner'
                />
            </p>
        </section>
    );
}
