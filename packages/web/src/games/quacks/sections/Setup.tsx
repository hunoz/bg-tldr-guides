export default function Setup() {
    return (
        <>
            <h2>🧪 Setup</h2>

            <h3>Table Setup</h3>
            <div className='qk-card'>
                <ol className='qk-steps'>
                    <li>Shuffle the fortune teller deck face down in a pile.</li>
                    <li>
                        Place the flame marker on space <strong>1</strong> of the round track.
                    </li>
                    <li>
                        Choose a set of ingredient books (numbered 1–4 by bookmark count). Pick one{' '}
                        <span className='qk-token qk-token-orange'></span> orange (pumpkin) book and
                        one <span class='qk-token qk-token-black'></span> black (moth) book. Flip
                        each to the side matching your player count (shown by cauldron icons in the
                        bottom-left corner).
                    </li>
                    <li>
                        Sort ingredient tokens into piles by value: <strong>1s</strong>,{' '}
                        <strong>2s</strong>, and <strong>3+</strong>. Colors will be mixed within
                        piles — this is intentional.
                    </li>
                </ol>
            </div>

            <h3>Per-Player Setup</h3>
            <div className='qk-card qk-parchment'>
                <p>Each player receives:</p>
                <ul>
                    <li>
                        <strong>1 cauldron board</strong> — book side up (not test tubes)
                    </li>
                    <li>
                        <strong>1 scoring marker</strong> (matching color) → place next to space 1
                        on the scoring track
                    </li>
                    <li>
                        <strong>1 player marker</strong> → place on space 0 (zero side up)
                    </li>
                    <li>
                        <strong>1 bag</strong>
                    </li>
                    <li>
                        <strong>1 ruby</strong> → place to the left of your cauldron
                    </li>
                    <li>
                        <strong>1 flask</strong> → place full-side up on the silver tray
                    </li>
                    <li>
                        <strong>1 droplet marker</strong> → place on the first center space of your
                        cauldron
                    </li>
                    <li>
                        <strong>1 rat marker</strong> → place in the bowl
                    </li>
                </ul>

                <h4>Starting Bag Contents (9 tokens)</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Token</th>
                            <th>Qty</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <span className='qk-token qk-token-white'></span> White 1 —
                                Bloomberry
                            </td>
                            <td>4</td>
                        </tr>
                        <tr>
                            <td>
                                <span className='qk-token qk-token-white'></span> White 2 —
                                Bloomberry
                            </td>
                            <td>2</td>
                        </tr>
                        <tr>
                            <td>
                                <span className='qk-token qk-token-white'></span> White 3 —
                                Bloomberry
                            </td>
                            <td>1</td>
                        </tr>
                        <tr>
                            <td>
                                <span className='qk-token qk-token-orange'></span> Orange 1 —
                                Pumpkin
                            </td>
                            <td>1</td>
                        </tr>
                        <tr>
                            <td>
                                <span className='qk-token qk-token-green'></span> Green 1 — Spider
                            </td>
                            <td>1</td>
                        </tr>
                    </tbody>
                </table>

                <div className='qk-callout'>
                    <strong>Scoring note:</strong> If a player crosses 50 points, flip the scoring
                    marker to its "50" side and continue from the beginning of the track.
                </div>
            </div>
        </>
    );
}
