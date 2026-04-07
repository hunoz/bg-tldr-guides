export default function FinalRound() {
    return (
        <>
            <h2>🏆 Final Round (Round 9)</h2>
            <div className='qk-card'>
                <p>Played normally with these exceptions:</p>
                <h4>No Shopping</h4>
                <p>Instead, convert resources to victory points:</p>
                <table>
                    <thead>
                        <tr>
                            <th>Cost</th>
                            <th>Reward</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>5 money</td>
                            <td>1 victory point</td>
                        </tr>
                        <tr>
                            <td>2 rubies</td>
                            <td>1 victory point</td>
                        </tr>
                    </tbody>
                </table>

                <h4>Final Scoring</h4>
                <p>Highest victory point total wins.</p>

                <h4>Tiebreaker</h4>
                <ol>
                    <li>Farthest final space in the last round.</li>
                    <li>Still tied → shared victory.</li>
                </ol>
            </div>
        </>
    );
}
