export type QuacksSchema = {
    app: {
        title: string;
        subtitle: string;
        footer: string;
        icon: string;
    };
    header: {
        rulesReference: string;
    };
    overview: {
        rounds: string;
        turns: string;
        simultaneous: string;
        goal: string;
        mostVictoryPoints: string;
    };
    setup: {
        title: string;
        tableSetup: {
            header: string;
            shuffleFortuneTellerDeck: string;
            flameMarkerPlacement: string;
            chooseIngredientBooks: string;
            sortIngredientTokens: string;
        };
        perPlayerSetup: {
            header: string;
            eachPlayerReceives: string;
            oneCauldronBoard: string;
            oneScoringMarker: string;
            onePlayerMarker: string;
            oneBag: string;
            oneRuby: string;
            oneFlask: string;
            oneDropletMarker: string;
            oneRatMarker: string;
            startingBagContents: {
                header: string;
                token: string;
                qty: string;
                white1Bloomberry: string;
                white2Bloomberry: string;
                white3Bloomberry: string;
                orange1Pumpkin: string;
                green1Spider: string;
            };
        };
        scoringNote: string;
    };
    roundStructure: {
        title: string;
    };
    endOfRound: {
        title: string;
    };
    finalRound: {
        title: string;
    };
};
