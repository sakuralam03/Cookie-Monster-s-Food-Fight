export const ScoreBadge = ({ score }: { score: 'red' | 'yellow' | 'green' }) => (
  <div className="score-container">
    <p>Sensitivity Score: <span>{score.toUpperCase()}</span></p>
    <div id="score-indicator" className={`score-${score}`} />
  </div>
);
