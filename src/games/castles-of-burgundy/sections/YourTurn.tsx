import { Trans, useTranslation } from 'react-i18next';

export default function YourTurnSection() {
    const { t } = useTranslation('castles-of-burgundy');
    const yourTurn = t('yourTurn', { returnObjects: true });
    return (
        <section id='your-turn'>
            <h2>
                <span className='icon'>🎲</span> {yourTurn.heading}
            </h2>
            <p>
                <Trans
                    ns='castles-of-burgundy'
                    i18nKey='yourTurn.intro'
                    components={{ strong: <strong /> }}
                />
            </p>
            <div className='action-grid'>
                {yourTurn.actions.map((action, i) => (
                    <div className='action-card' key={i}>
                        <div className='num'>{i + 1}</div>
                        <h4>
                            {action.icon} {action.title}
                        </h4>
                        <p>{action.desc}</p>
                    </div>
                ))}
            </div>
            <p style={{ marginTop: 8 }}>
                <Trans
                    ns='castles-of-burgundy'
                    i18nKey='yourTurn.buyCenter'
                    components={{ strong: <strong />, em: <em /> }}
                />
            </p>
            <div className='worker-tip'>
                <span className='tip-icon'>⚙️</span>
                <div>
                    <Trans
                        ns='castles-of-burgundy'
                        i18nKey='yourTurn.workerTip'
                        components={{ strong: <strong /> }}
                    />
                </div>
            </div>
        </section>
    );
}
