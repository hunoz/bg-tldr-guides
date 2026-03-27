import { useTranslation } from 'react-i18next';

export default function MonasteriesSection() {
    const { t } = useTranslation('castles-of-burgundy');
    const monasteries = t('monasteries', { returnObjects: true });
    return (
        <section id='monasteries'>
            <h2>
                <span className='icon'>🕯️</span> {monasteries.heading}{' '}
                <small style={{ fontSize: '.7em', color: '#8a7a60' }}>{monasteries.subtitle}</small>
            </h2>
            <p>{monasteries.intro}</p>
            <h3>{monasteries.ongoingHeading}</h3>
            <div className='monastery-grid'>
                {monasteries.ongoing.map(m => (
                    <div className='mon-card' key={m.num}>
                        <span className='mon-num'>{m.num}</span> {m.text}
                    </div>
                ))}
            </div>
            <h3>{monasteries.endGameHeading}</h3>
            <div className='monastery-grid'>
                {monasteries.endGame.map(m => (
                    <div className='mon-card' key={m.num}>
                        <span className='mon-num'>{m.num}</span> {m.text}
                    </div>
                ))}
            </div>
        </section>
    );
}
