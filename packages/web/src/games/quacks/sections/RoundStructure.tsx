export default function RoundStructure() {
    return (
        <>
            <h2>🔮 Round Structure</h2>

            <h3>1. Rotate Starting Player</h3>
            <div className='qk-card'>Pass clockwise each round.</div>

            <h3>2. Draw a Fortune</h3>
            <div className='qk-card'>
                <p>The starting player draws from the fortune teller deck.</p>
                <ul>
                    <li>
                        <span className='qk-fortune-purple'>Purple cards</span> — resolve
                        immediately, then discard.
                    </li>
                    <li>
                        <span className='qk-fortune-blue'>Blue cards</span> — remain in effect until
                        end of round; keep visible.
                    </li>
                </ul>
                <div className='qk-callout'>
                    <strong>Note:</strong> If a card references{' '}
                    <span className='qk-token qk-token-yellow'></span> yellow mandrakes or{' '}
                    <span className='qk-token qk-token-purple'></span> purple ghosts and those
                    aren't in the game yet, ignore that part.
                </div>
            </div>

            <h3>3. Draw Ingredients (Simultaneous)</h3>
            <div className='qk-card'>
                <p>
                    All players draw tokens one at a time from their bags and place them in their
                    cauldrons.
                </p>

                <h4>Placement</h4>
                <p>
                    Each token advances you forward by its printed value, measured from your last
                    placed token (or your starting position for the first draw).
                </p>

                <h4>Stopping</h4>
                <p>
                    You may stop voluntarily at any time. If you reach the last cauldron space,
                    place the token there and stop.
                </p>

                <h4>Exploding 💥</h4>
                <div className='qk-callout qk-callout-warn'>
                    <strong>
                        If the total value of all <span className='qk-token qk-token-white'></span>{' '}
                        white bloomberries in your cauldron exceeds 7, you explode!
                    </strong>{' '}
                    Place the token that caused it, then stop immediately.
                </div>

                <h4>Rules</h4>
                <ul>
                    <li>
                        You may <strong>never</strong> look inside your bag.
                    </li>
                    <li>
                        <strong>Flask:</strong> After drawing a bloomberry that does <em>not</em>{' '}
                        cause you to explode, you may return it to your bag and flip your flask to
                        its empty side. You cannot use the flask on a token that would cause an
                        explosion.
                    </li>
                </ul>
            </div>

            <h3>4. Ingredient Effects</h3>
            <div className='qk-card'>
                <table>
                    <thead>
                        <tr>
                            <th>Timing</th>
                            <th>Ingredients</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <strong>Immediate</strong> (on draw)
                            </td>
                            <td>
                                <span className='qk-token qk-token-blue'></span> Blue (Skull) ·{' '}
                                <span className='qk-token qk-token-red'></span> Red (Toadstool) ·{' '}
                                <span className='qk-token qk-token-yellow'></span> Yellow (Mandrake)
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <strong>After drawing ends</strong>
                            </td>
                            <td>
                                <span className='qk-token qk-token-green'></span> Green (Spider) ·{' '}
                                <span className='qk-token qk-token-purple'></span> Purple (Ghost) ·{' '}
                                <span className='qk-token qk-token-black'></span> Black (Moth)
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className='qk-callout'>
                    <strong>Resolution order:</strong> Green → Purple → Black
                </div>
            </div>
        </>
    );
}
