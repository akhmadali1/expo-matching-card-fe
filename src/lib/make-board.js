export default function generateInitialBoard(difficulty){
    let cardListDifficulty = cardListHard;
    let difficultyGameRows = 4
    let difficultyGameColumns = 5
    if (difficulty === 1) {
        cardListDifficulty = cardList;
        difficultyGameRows = 3
        difficultyGameColumns = 4
    } else if (difficulty === 2) {
        cardListDifficulty = cardListMedium;
        difficultyGameRows = 4
        difficultyGameColumns = 4
    }

    const cards = cardListDifficulty.concat(cardListDifficulty);
    const shuffledCards = cards.sort(() => Math.random() - 0.5);
    const initialBoard = [];

    let cardIndex = 0;

    for (let i = 0; i < difficultyGameRows; i++) {
        const row = [];
        for (let j = 0; j < difficultyGameColumns; j++) {
            let card = shuffledCards[cardIndex];

            row.push({
                id: `${i}-${j}`,
                card,
                flipped: false,
                matched: false,
                clickable: true
            });
            cardIndex++;
        }
        initialBoard.push(row);
    }
    return initialBoard;
};