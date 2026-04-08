import TransWithHtml from '@/components/TransWithHtml';
import { useTranslation } from 'react-i18next';

export default function SetupSection() {
    const { t } = useTranslation('castles-of-burgundy');
    const setup = t('setup', { returnObjects: true });
    return (
        <section id='setup'>
            <h2>
                <span className='icon'>📦</span> {setup.heading}
            </h2>
            <p>{setup.intro}</p>
            <h3>{setup.playerGetsHeading}</h3>
            <ul>
                <li>{setup.playerGets[0]}</li>
                <ul>
                    <li>{setup.playerGets[1]}</li>
                </ul>
                {setup.playerGets.slice(2).map((item, i) => (
                    <li key={i}>{item}</li>
                ))}
            </ul>
            <h3>{setup.sharedBoardHeading}</h3>
            <ol>
                {setup.sharedBoard.map((item, i) => (
                    <li key={i}>{item}</li>
                ))}
            </ol>
            <h3>{setup.firstPlayerHeading}</h3>
            <p>
                <TransWithHtml
                    ns='castles-of-burgundy'
                    i18nKey='setup.firstPlayerRoll'
                />
            </p>
            <p>
                <TransWithHtml
                    ns='castles-of-burgundy'
                    i18nKey='setup.bridgeNote'
                />
            </p>
        </section>
    );
}
