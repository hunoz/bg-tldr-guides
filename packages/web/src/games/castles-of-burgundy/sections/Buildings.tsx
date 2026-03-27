import { useTranslation } from 'react-i18next';

export default function BuildingsSection() {
    const { t } = useTranslation('castles-of-burgundy');
    const columns = t('buildings.columns', { returnObjects: true });
    const items = t('buildings.items', { returnObjects: true });
    return (
        <section id='buildings'>
            <h2>
                <span className='icon'>🏗️</span> {t('buildings.heading')}{' '}
                <small style={{ fontSize: '.7em', color: '#8a7a60' }}>
                    {t('buildings.subtitle')}
                </small>
            </h2>
            <p>{t('buildings.intro')}</p>
            <table className='tile-table'>
                <thead>
                    <tr>
                        {columns.map(col => (
                            <th key={col}>{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {items.map(b => (
                        <tr key={b.name}>
                            <td>
                                {b.icon} {b.name}
                            </td>
                            <td>{b.effect}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}
