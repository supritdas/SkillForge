// components/dashboard/SkillRadar.jsx — Visual skill metric bars

const SkillRadar = ({ skillMetrics }) => {
  if (!skillMetrics || skillMetrics.length === 0) {
    return (
      <div className="text-center py-8 text-dark-400 text-sm">
        <p>Complete modules to build your skill profile!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {skillMetrics.map(({ skill, score }) => (
        <div key={skill}>
          <div className="flex justify-between items-center mb-1">
            <span className="font-mono text-xs text-dark-200">{skill}</span>
            <span className="font-mono text-xs text-forge-400 font-bold">{score}%</span>
          </div>
          <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-forge-gradient rounded-full transition-all duration-700"
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkillRadar;
