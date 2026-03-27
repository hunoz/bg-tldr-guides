import { useTranslation } from 'react-i18next';

export default function OverviewSection() {
    const { t } = useTranslation('castles-of-burgundy');
    const overview = t('overview', { returnObjects: true });
    return (
        <section id='overview'>
            <h2>
                <span className='icon'>🎯</span> {overview.heading}
            </h2>
            <div className='intro-box'>{overview.body}</div>
        </section>
    );
}
