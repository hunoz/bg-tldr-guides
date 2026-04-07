export default function EndOfRound() {
    return (
        <>
            <h2>📜 End of Round Checklist</h2>

            <h3>a) Bonus Die</h3>
            <div className='qk-card'>
                <p>
                    The player who reached the farthest final space <em>without exploding</em> rolls
                    the bonus die. Ties: all tied players roll.
                </p>
                <p>Your "final space" is the space immediately after your last placed token.</p>
                <h4>Possible Rewards</h4>
                <div className='qk-rewards'>
                    <div className='qk-reward'>+1 Victory Point</div>
                    <div className='qk-reward'>+2 Victory Points</div>
                    <div className='qk-reward'>+1 Ruby</div>
                    <div className='qk-reward'>Advance Droplet 1 Space</div>
                    <div className='qk-reward'>
                        <span className='qk-token qk-token-orange'></span> Orange 1 Token
                    </div>
                </div>
            </div>

            <h3>b) Post-Draw Ingredient Effects</h3>
            <div className='qk-card'>
                Resolve <span className='qk-token qk-token-green'></span> Green →{' '}
                <span className='qk-token qk-token-purple'></span> Purple →{' '}
                <span className='qk-token qk-token-black'></span> Black effects now.
            </div>

            <h3>c) Bonus Rubies</h3>
            <div className='qk-card'>If your final space shows a ruby icon, take 1 ruby.</div>

            <h3>d) Scoring</h3>
            <div className='qk-card'>
                <table>
                    <thead>
                        <tr>
                            <th>Outcome</th>
                            <th>Reward</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Didn't explode</td>
                            <td>
                                Score victory points <strong>and</strong> shop
                            </td>
                        </tr>
                        <tr>
                            <td>Exploded</td>
                            <td>
                                Choose <strong>one</strong>: score victory points{' '}
                                <strong>or</strong> shop
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p>
                    Victory points earned = the number shown in the small square on your final
                    space.
                </p>
            </div>

            <h3>e) Shopping</h3>
            <div className='qk-card qk-parchment'>
                <p>
                    Starting player goes first, then clockwise. Spend the money value shown on your
                    final space.
                </p>
                <ul>
                    <li>
                        Buy <strong>1 or 2 tokens</strong> — if 2, they must be{' '}
                        <strong>different colors</strong>.
                    </li>
                    <li>Costs are listed on the ingredient books.</li>
                    <li>Token supply is limited — once gone, they're gone!</li>
                    <li>Unspent money is lost.</li>
                </ul>
                <div className='qk-callout'>
                    <strong>Availability:</strong>{' '}
                    <span className='qk-token qk-token-yellow'></span> Yellow mandrakes from Round 2
                    · <span className='qk-token qk-token-purple'></span> Purple ghosts from Round 3
                </div>
                <p>After shopping, return all cauldron tokens + new purchases to your bag.</p>
            </div>

            <h3>f) Spend Rubies (Optional)</h3>
            <div className='qk-card'>
                <p>
                    Spend <strong>2 rubies</strong> per action, as many times as you can afford:
                </p>
                <table>
                    <thead>
                        <tr>
                            <th>Action</th>
                            <th>Effect</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Refill Flask</td>
                            <td>Flip back to full side</td>
                        </tr>
                        <tr>
                            <td>Advance Droplet</td>
                            <td>Move 1 space forward (permanent)</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3>g) Rats — Catch-Up Mechanism 🐀</h3>
            <div className='qk-card'>
                <p>
                    Every player <em>except</em> the scoring leader:
                </p>
                <ol className='qk-steps'>
                    <li>Place your rat marker on your droplet.</li>
                    <li>Count the rat tails on the scoreboard between you and the leader.</li>
                    <li>
                        Advance your rat marker that many spaces — this is your starting position
                        next round.
                    </li>
                </ol>
                <div className='qk-callout'>
                    <strong>Note:</strong> The rat marker resets each round. If you're closer to the
                    leader next round, it moves back. If further away, it moves even further
                    forward. The rats never help the lead player. Skip this step in the final round.
                </div>
            </div>

            <h3>h) Advance to Next Round</h3>
            <div className='qk-card'>
                <ul>
                    <li>Move the flame marker forward one space.</li>
                    <li>Pass the fortune deck clockwise to the new starting player.</li>
                    <li>All tokens should be back in your bag.</li>
                </ul>
                <div className='qk-callout'>
                    <strong>Round 6 special:</strong> Every player adds 1 extra{' '}
                    <span className='qk-token qk-token-white'></span> White 1 Bloomberry to their
                    bag.
                </div>
            </div>
        </>
    );
}
