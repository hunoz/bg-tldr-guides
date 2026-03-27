export type CoBSchema = {
    app: {
        title: string;
        subtitle: string;
        footer: string;
        icon: string;
    };
    overview: {
        heading: string;
        body: string;
        sidenav: string;
    };
    setup: {
        sidenav: string;
        heading: string;
        intro: string;
        playerGetsHeading: string;
        playerGets: string[];
        sharedBoardHeading: string;
        sharedBoard: string[];
        firstPlayerHeading: string;
        firstPlayerRoll: string;
        bridgeNote: string;
    };
    gameFlow: {
        sidenav: string;
        heading: string;
        intro: string;
        phases: string[];
        roundsLabel: string;
        startHeading: string;
        startSteps: string[];
        endHeading: string;
        endSteps: string[];
        roundHeading: string;
        roundDesc: string;
    };
    yourTurn: {
        sidenav: string;
        heading: string;
        intro: string;
        actions: { icon: string; title: string; desc: string }[];
        buyCenter: string;
        workerTip: string;
    };
    scoring: {
        sidenav: string;
        heading: string;
        areasHeading: string;
        areasDesc: string;
        areasCriteria: string[];
        colorHeading: string;
        colorDesc: string;
        bridgeHeading: string;
        bridgeDesc: string;
    };
    tileTypes: {
        sidenav: string;
        heading: string;
        columns: string[];
        tiles: { color: string; dotClass: string; type: string; desc: string }[];
    };
    buildings: {
        sidenav: string;
        heading: string;
        subtitle: string;
        intro: string;
        columns: string[];
        items: { icon: string; name: string; effect: string }[];
    };
    monasteries: {
        sidenav: string;
        heading: string;
        subtitle: string;
        intro: string;
        ongoingHeading: string;
        ongoing: { num: string; text: string }[];
        endGameHeading: string;
        endGame: { num: string; text: string }[];
    };
    endOfGame: {
        sidenav: string;
        heading: string;
        intro: string;
        bonusHeading: string;
        bonuses: string[];
        winner: string;
    };
};
