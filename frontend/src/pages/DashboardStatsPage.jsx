import '../styles/pages/DashboardStatsPage.scss';

const stats = [
  { label: 'Total Posts', value: '24', delta: '+6 this month' },
  { label: 'Total Views', value: '18.4K', delta: '+22% vs last month' },
  { label: 'Comments', value: '312', delta: '+41 new replies' },
  { label: 'Followers', value: '1.8K', delta: '+160 new readers' },
];

const channels = [
  { label: 'Organic Search', value: '48%' },
  { label: 'Direct', value: '26%' },
  { label: 'Social', value: '18%' },
  { label: 'Referral', value: '8%' },
];

const DashboardStatsPage = () => {
  return (
    <div className="dashboard-stats-page">
      <div className="stats-head">
        <h2>Stats</h2>
        <p>Quick overview of your publishing performance.</p>
      </div>

      <div className="stats-grid">
        {stats.map((item) => (
          <article key={item.label} className="stat-card">
            <span className="stat-label">{item.label}</span>
            <strong className="stat-value">{item.value}</strong>
            <span className="stat-delta">{item.delta}</span>
          </article>
        ))}
      </div>

      <div className="stats-panel">
        <h3>Traffic Sources</h3>
        <div className="channel-list">
          {channels.map((channel) => (
            <div key={channel.label} className="channel-row">
              <span>{channel.label}</span>
              <strong>{channel.value}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardStatsPage;
