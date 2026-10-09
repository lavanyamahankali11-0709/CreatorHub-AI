
import React, { useState } from "react";
import "./App.css";

function App() {
  const [creators, setCreators] = useState([
    {
      name: "Ananya Kapoor",
      category: "Fashion",
      followers: "245,000 followers",
      match: "98%",
      color: "#f8d7e8",
      initial: "AK",
    },
    {
      name: "Rahul Sharma",
      category: "Tech",
      followers: "180,000 followers",
      match: "96%",
      color: "#dcecff",
      initial: "RS",
    },
    {
      name: "Priya Singh",
      category: "Lifestyle",
      followers: "320,000 followers",
      match: "94%",
      color: "#dff5e8",
      initial: "PS",
    },
    {
      name: "Vikram Mehta",
      category: "Gaming",
      followers: "150,000 followers",
      match: "92%",
      color: "#fff0cf",
      initial: "VM",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const campaigns = [
    { month: "May", value: 42 },
    { month: "Jun", value: 58 },
    { month: "Jul", value: 51 },
    { month: "Aug", value: 72 },
    { month: "Sep", value: 63 },
    { month: "Oct", value: 88 },
  ];

  // AI CREATOR MATCHING
  const findAIMatches = async () => {
    if (loading) return;

    setLoading(true);
    setMessage("");
    setError(false);

    try {
      const response = await fetch(
        "http://localhost:5000/api/ai/match",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            niche: "Food",
            city: "Hyderabad",
            language: "Telugu",
            minFollowers: 20000,
            maxFollowers: 100000,
          }),
        }
      );

      const result = await response.json();

      console.log("AI Match API Response:", result);

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || `Request failed (${response.status})`
        );
      }

      // IMPORTANT:
      // Backend response contains matches inside result.data.matches.
      const matches = result.data?.matches;

      if (!Array.isArray(matches)) {
        throw new Error(
          "Unexpected backend response. Please check the API response."
        );
      }

      if (matches.length === 0) {
        setCreators([]);
        setMessage("No matching creators found. Try another niche.");
        return;
      }

      const colors = [
        "#f8d7e8",
        "#dcecff",
        "#dff5e8",
        "#fff0cf",
      ];

      const formattedCreators = matches.map((creator, index) => {
        const name = creator.name || "Unknown Creator";

        const initials = name
          .split(" ")
          .filter(Boolean)
          .map((word) => word[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();

        return {
          name,
          category: creator.niche || creator.category || "Creator",
          followers: `${Number(
            creator.followers || 0
          ).toLocaleString("en-IN")} followers`,
          match: `${Number(creator.matchScore || 0)}%`,
          color: colors[index % colors.length],
          initial: initials || "AI",
        };
      });

      setCreators(formattedCreators);
      setMessage(
        `AI matching completed! Found ${formattedCreators.length} creator(s).`
      );
    } catch (err) {
      console.error("AI matching error:", err);

      setError(true);

      if (err instanceof TypeError) {
        setMessage(
          "Cannot connect to the backend. Check that it is running on port 5000 and that CORS allows your frontend."
        );
      } else {
        setMessage(
          err.message || "Something went wrong while finding matches."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo">
          <span>✦</span> CreatorHub
        </div>

        <nav className="navigation">
          <div className="nav-item active">
            <span>▣</span>
            Dashboard
          </div>

          <div className="nav-item">
            <span>♟</span>
            Creators
          </div>

          <div className="nav-item">
            <span>▤</span>
            Campaigns
          </div>

          <div className="nav-item">
            <span>✦</span>
            AI Matching
          </div>

          <div className="nav-item">
            <span>●</span>
            Messages
          </div>

          <div className="nav-item">
            <span>♨</span>
            Payments
          </div>
        </nav>

        <div className="sidebar-bottom">
          <div className="nav-item">
            <span>⚙</span>
            Settings
          </div>

          <div className="nav-item">
            <span>?</span>
            Help
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main">
        {/* HEADER */}
        <header className="top-header">
          <div>
            <h1>Good morning, Pushpanjali 👋</h1>
            <p>
              Here's what's happening with your creator marketplace.
            </p>
          </div>

          <div className="profile-area">
            <button
              type="button"
              className="notification"
              aria-label="Notifications"
            >
              🔔
            </button>

            <div className="profile">
              <div className="profile-avatar">P</div>

              <div>
                <strong>Pushpanjali</strong>
                <small>Brand Manager</small>
              </div>
            </div>
          </div>
        </header>

        {/* HERO / AI MATCHING */}
        <section className="hero">
          <div className="hero-content">
            <span className="ai-badge">✦ AI POWERED</span>

            <h2>
              Find the perfect creator for your next campaign.
            </h2>

            <p>
              Let AI analyze creator skills, audience, engagement and
              content style to find your best matches.
            </p>

            <button
              type="button"
              className="match-button"
              onClick={findAIMatches}
              disabled={loading}
            >
              {loading
                ? "⏳ Finding AI Matches..."
                : "✦ Find AI Matches"}
            </button>

            {message && (
              <p
                role="status"
                style={{
                  marginTop: "12px",
                  fontWeight: "600",
                  color: error ? "#c62828" : "inherit",
                }}
              >
                {message}
              </p>
            )}
          </div>

          <div className="robot">🤖</div>
        </section>

        {/* STAT CARDS */}
        <section className="stats">
          <div className="stat-card">
            <div className="stat-icon purple">♟</div>

            <div>
              <span>Total Creators</span>
              <h3>12,480</h3>
              <small className="positive">↑ 12.5% this month</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue">📢</div>

            <div>
              <span>Active Campaigns</span>
              <h3>286</h3>
              <small className="positive">↑ 8.2% this month</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">♨</div>

            <div>
              <span>Total Revenue</span>
              <h3>₹8.42L</h3>
              <small className="positive">↑ 18.4% this month</small>
            </div>
          </div>

          <div className="stat-card highlighted">
            <div className="stat-icon yellow">ϟ</div>

            <div>
              <span>Match Success</span>
              <h3>94.8%</h3>
              <small className="positive">↑ 4.8% improvement</small>
            </div>
          </div>
        </section>

        {/* MIDDLE SECTION */}
        <section className="dashboard-grid">
          {/* CAMPAIGN PERFORMANCE */}
          <div className="panel campaign-panel">
            <div className="panel-header">
              <div>
                <h3>Campaign Performance</h3>
                <p>Revenue generated from campaigns</p>
              </div>

              <select defaultValue="6">
                <option value="6">Last 6 months</option>
                <option value="12">Last 12 months</option>
              </select>
            </div>

            <div className="chart">
              {campaigns.map((campaign) => (
                <div
                  className="bar-container"
                  key={campaign.month}
                >
                  <div
                    className="bar"
                    style={{ height: `${campaign.value}%` }}
                  />

                  <span>{campaign.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* TOP AI MATCHES */}
          <div className="panel matches-panel">
            <div className="panel-header">
              <div>
                <h3>Top AI Matches</h3>
                <p>Recommended creators</p>
              </div>

              <button
                type="button"
                className="view-all"
                onClick={findAIMatches}
                disabled={loading}
              >
                {loading ? "Loading..." : "Refresh"}
              </button>
            </div>

            <div className="creator-list">
              {creators.length > 0 ? (
                creators.map((creator) => (
                  <div className="creator" key={creator.name}>
                    <div
                      className="creator-avatar"
                      style={{ background: creator.color }}
                    >
                      {creator.initial}
                    </div>

                    <div className="creator-info">
                      <strong>{creator.name}</strong>

                      <span>
                        {creator.category} • {creator.followers}
                      </span>
                    </div>

                    <div className="match-score">{creator.match}</div>
                  </div>
                ))
              ) : (
                <p>No creators to display. Click Find AI Matches to try again.</p>
              )}
            </div>
          </div>
        </section>

        {/* BOTTOM SECTION */}
        <section className="bottom-grid">
          {/* TRENDING CREATORS */}
          <div className="panel trending-panel">
            <div className="panel-header">
              <div>
                <h3>Trending Creators 🔥</h3>
                <p>Creators gaining popularity</p>
              </div>

              <button type="button" className="view-all">
                Explore
              </button>
            </div>

            <div className="trending">
              <div className="trend-card">
                <div className="trend-icon">🎨</div>

                <div>
                  <strong>Creative Studio</strong>
                  <span>+42% engagement</span>
                </div>
              </div>

              <div className="trend-card">
                <div className="trend-icon">📸</div>

                <div>
                  <strong>Pixel Queen</strong>
                  <span>+36% engagement</span>
                </div>
              </div>

              <div className="trend-card">
                <div className="trend-icon">🎥</div>

                <div>
                  <strong>MediaX</strong>
                  <span>+31% engagement</span>
                </div>
              </div>
            </div>
          </div>

          {/* RECENT ACTIVITY */}
          <div className="panel activity-panel">
            <div className="panel-header">
              <div>
                <h3>Recent Activity</h3>
                <p>Latest marketplace activity</p>
              </div>
            </div>

            <div className="activity-list">
              <div className="activity">
                <span className="dot green" />

                <div>
                  <strong>New campaign created</strong>
                  <small>Fashion Brand Campaign</small>
                </div>

                <time>10m</time>
              </div>

              <div className="activity">
                <span className="dot purple-dot" />

                <div>
                  <strong>AI matched 24 creators</strong>
                  <small>Tech Campaign</small>
                </div>

                <time>32m</time>
              </div>

              <div className="activity">
                <span className="dot orange-dot" />

                <div>
                  <strong>Payment completed</strong>
                  <small>₹45,000 transferred</small>
                </div>

                <time>1h</time>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;

