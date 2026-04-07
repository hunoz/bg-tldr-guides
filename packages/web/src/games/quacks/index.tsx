import EndOfRound from './sections/EndOfRound';
import FinalRound from './sections/FinalRound';
import Overview from './sections/Overview';
import RoundStructure from './sections/RoundStructure';
import Setup from './sections/Setup';
import './index.css';

function Header() {
    return (
        <div className='qk-header'>
            <h1>The Quacks of Quedlinburg</h1>
            <div className='qk-subtitle'>Rules Reference</div>
        </div>
    );
}

export default function Quacks() {
    return (
        <div className='quacks-rules'>
            <Header />
            <Overview />
            <Setup />
            <RoundStructure />
            <EndOfRound />
            <FinalRound />
        </div>
    );
}
