import TransWithHtml from '@/components/TransWithHtml';
import { useTranslation } from 'react-i18next';

export default function Setup() {
    const { t } = useTranslation('quacks');

    return (
        <>
            <h2>🧪 {t('setup.title')}</h2>

            <h3>{t('setup.tableSetup.header')}</h3>
            <div className='qk-card'>
                <ol className='qk-steps'>
                    <li>{t('setup.tableSetup.shuffleFortuneTellerDeck')}</li>
                    <li>
                        <TransWithHtml
                            ns='quacks'
                            i18nKey='setup.tableSetup.flameMarkerPlacement'
                        />
                    </li>
                    <li>
                        <TransWithHtml
                            ns='quacks'
                            i18nKey='setup.tableSetup.chooseIngredientBooks'
                        />
                    </li>
                    <li>
                        <TransWithHtml
                            ns='quacks'
                            i18nKey='setup.tableSetup.sortIngredientTokens'
                        />
                    </li>
                </ol>
            </div>

            <h3>{t('setup.perPlayerSetup.header')}</h3>
            <div className='qk-card qk-parchment'>
                <p>{t('setup.perPlayerSetup.eachPlayerReceives')}:</p>
                <ul>
                    <li>
                        <TransWithHtml
                            ns='quacks'
                            i18nKey='setup.perPlayerSetup.oneCauldronBoard'
                        />
                    </li>
                    <li>
                        <TransWithHtml
                            ns='quacks'
                            i18nKey='setup.perPlayerSetup.oneScoringMarker'
                        />
                    </li>
                    <li>
                        <TransWithHtml ns='quacks' i18nKey='setup.perPlayerSetup.onePlayerMarker' />
                    </li>
                    <li>
                        <TransWithHtml ns='quacks' i18nKey='setup.perPlayerSetup.oneBag' />
                    </li>
                    <li>
                        <TransWithHtml ns='quacks' i18nKey='setup.perPlayerSetup.oneRuby' />
                    </li>
                    <li>
                        <TransWithHtml ns='quacks' i18nKey='setup.perPlayerSetup.oneFlask' />
                    </li>
                    <li>
                        <TransWithHtml
                            ns='quacks'
                            i18nKey='setup.perPlayerSetup.oneDropletMarker'
                        />
                    </li>
                    <li>
                        <TransWithHtml ns='quacks' i18nKey='setup.perPlayerSetup.oneRatMarker' />
                    </li>
                </ul>

                <h4>{t('setup.perPlayerSetup.startingBagContents.header')}</h4>
                <table>
                    <thead>
                        <tr>
                            <th>{t('setup.perPlayerSetup.startingBagContents.token')}</th>
                            <th>{t('setup.perPlayerSetup.startingBagContents.qty')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <TransWithHtml
                                    ns='quacks'
                                    i18nKey='setup.perPlayerSetup.startingBagContents.white1Bloomberry'
                                />
                            </td>
                            <td>4</td>
                        </tr>
                        <tr>
                            <td>
                                <TransWithHtml
                                    ns='quacks'
                                    i18nKey='setup.perPlayerSetup.startingBagContents.white2Bloomberry'
                                />
                            </td>
                            <td>2</td>
                        </tr>
                        <tr>
                            <td>
                                <TransWithHtml
                                    ns='quacks'
                                    i18nKey='setup.perPlayerSetup.startingBagContents.white3Bloomberry'
                                />
                            </td>
                            <td>1</td>
                        </tr>
                        <tr>
                            <td>
                                <TransWithHtml
                                    ns='quacks'
                                    i18nKey='setup.perPlayerSetup.startingBagContents.orange1Pumpkin'
                                />
                            </td>
                            <td>1</td>
                        </tr>
                        <tr>
                            <td>
                                <TransWithHtml
                                    ns='quacks'
                                    i18nKey='setup.perPlayerSetup.startingBagContents.green1Spider'
                                />
                            </td>
                            <td>1</td>
                        </tr>
                    </tbody>
                </table>

                <div className='qk-callout'>
                    <TransWithHtml ns='quacks' i18nKey='setup.scoringNote' />
                </div>
            </div>
        </>
    );
}
