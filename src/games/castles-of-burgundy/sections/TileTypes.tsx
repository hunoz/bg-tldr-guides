import { useTranslation } from 'react-i18next';

export default function TileTypesSection() {
    const { t } = useTranslation('castles-of-burgundy');
    const tileTypes = t('tileTypes', { returnObjects: true });
    return (
        <section id='tile-types'>
            <h2>
                <span className='icon'>🔷</span> {tileTypes.heading}
            </h2>
            <table className='tile-table'>
                <thead>
                    <tr>
                        {tileTypes.columns.map(col => (
                            <th key={col}>{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {tileTypes.tiles.map(tile => (
                        <tr key={tile.color}>
                            <td>
                                <span className={`tile-dot ${tile.dotClass}`} />
                                {tile.color}
                            </td>
                            <td>{tile.type}</td>
                            <td>{tile.desc}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}
