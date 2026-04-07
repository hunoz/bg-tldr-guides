import TransWithHtml from '@/components/TransWithHtml';
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
                <TransWithHtml
                    ns='castles-of-burgundy'
                    i18nKey='yourTurn.intro'
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
                <TransWithHtml
                    ns='castles-of-burgundy'
                    i18nKey='yourTurn.buyCenter'
                />
            </p>
            <div className='worker-tip'>
                <span className='tip-icon'>⚙️</span>
                <div>
                    <TransWithHtml
                        ns='castles-of-burgundy'
                        i18nKey='yourTurn.workerTip'
                    />
                </div>
            </div>
        </section>
    );
}
