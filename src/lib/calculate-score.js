
export default function calculateScore(difficulty, timeCount, errors) {
    let difficultyMultiplier = 1;
    if (difficulty === 2) {
        difficultyMultiplier = 0.65;
    } else if (difficulty === 1) {
        difficultyMultiplier = 0.45;
    }

    const baseScore = 120000;
    const errorPenalty = errors * 20;

    let score = Math.max(0, (baseScore * difficultyMultiplier) - errorPenalty - timeCount);

    const minimumScore = 5;

    if (score < minimumScore) {
        score = minimumScore;
    }

    return score;
};