import TransWithHtml from '@/components/TransWithHtml';
import { Trans, useTranslation } from 'react-i18next';

export default function ScoringSection() {
    const { t } = useTranslation('castles-of-burgundy');
    const scoring = t('scoring', { returnObjects: true });
    return (
        <section id='scoring'>
            <h2>
                <span className='icon'>⭐</span> {scoring.heading}
            </h2>
            <div className='scoring-box'>
                <h3>{scoring.areasHeading}</h3>
                <p>{scoring.areasDesc}</p>
                <ul>
                    {scoring.areasCriteria.map((_, i) => (
                        <li key={i}>
                            <TransWithHtml
                                ns='castles-of-burgundy'
                                i18nKey={`scoring.areasCriteria.${i}` as never}
                            />
                        </li>
                    ))}
                </ul>
            </div>
            <div className='scoring-box' style={{ marginTop: 12 }}>
                <h3>{scoring.colorHeading}</h3>
                <p>{scoring.colorDesc}</p>
            </div>
            <h3>{scoring.bridgeHeading}</h3>
            <p>{scoring.bridgeDesc}</p>
        </section>
    );
}
