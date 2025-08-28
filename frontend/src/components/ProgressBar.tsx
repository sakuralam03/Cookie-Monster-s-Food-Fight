

type ProgressBarProps = {
  progress: number; // value from 0 to 100
};

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="progress-container" style={{ width: '100%', backgroundColor: '#eee', borderRadius: '4px' }}>
      <div
        className="progress-fill"
        style={{
          width: `${progress}%`,
          height: '12px',
          backgroundColor: progress < 100 ? '#4caf50' : '#2196f3',
          borderRadius: '4px',
          transition: 'width 0.3s ease-in-out',
        }}
      />
    </div>
  );
}
