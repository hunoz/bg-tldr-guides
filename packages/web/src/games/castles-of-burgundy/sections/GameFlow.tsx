import { Trans, useTranslation } from 'react-i18next';

export default function GameFlowSection() {
    const { t } = useTranslation('castles-of-burgundy');
    const gameFlow = t('gameFlow', { returnObjects: true });
    return (
        <section id='game-flow'>
            <h2>
                <span className='icon'>🔄</span> {t('gameFlow.heading')}
            </h2>
            <p>
                <Trans
                    ns='castles-of-burgundy'
                    i18nKey='gameFlow.intro'
                    components={{ strong: <strong /> }}
                />
            </p>
            <div className='phase-flow'>
                {gameFlow.phases.map((letter, i) => (
                    <div className='phase-pip' key={letter}>
                        {letter}
                        <small>
                            {gameFlow.roundsLabel} {i * 5 + 1}–{i * 5 + 5}
                        </small>
                    </div>
                ))}
            </div>
            <h3>{gameFlow.startHeading}</h3>
            <ul>
                {gameFlow.startSteps.map((step, i) => (
                    <li key={i}>{step}</li>
                ))}
            </ul>
            <h3>{gameFlow.endHeading}</h3>
            <ul>
                {gameFlow.endSteps.map((step, i) => (
                    <li key={i}>{step}</li>
                ))}
            </ul>
            <h3>{gameFlow.roundHeading}</h3>
            <p>{gameFlow.roundDesc}</p>
        </section>
    );
}
