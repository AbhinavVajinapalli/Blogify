import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../styles/pages/HomePage.scss';

const showcaseCards = [
  {
    title: 'Editorial Craft',
    text: 'Shape long-form stories with elegant typography and immersive reading rhythm.',
    image:
      'https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?auto=compress&cs=tinysrgb&w=1200',
    fallback:
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Creator Workflow',
    text: 'Draft, edit, and publish with a focused studio built for consistent output.',
    image:
      'https://images.pexels.com/photos/3747468/pexels-photo-3747468.jpeg?auto=compress&cs=tinysrgb&w=1200',
    fallback:
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Audience Growth',
    text: 'Understand what resonates and turn loyal readers into a lasting community.',
    image:
      'https://images.pexels.com/photos/3183171/pexels-photo-3183171.jpeg?auto=compress&cs=tinysrgb&w=1200',
    fallback:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
  },
];

const handleImageFallback = (event) => {
  const target = event.currentTarget;
  const fallback = target.dataset.fallback;

  if (fallback && target.src !== fallback) {
    target.src = fallback;
    return;
  }

  target.style.visibility = 'hidden';
};

const HomePage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="home-page">
      <section className="hero-full">
        <div className="hero-inner container">
          <div className="hero-copy">
            <span className="hero-chip">Creator-first publishing</span>
            <h1>Build a site that looks distinct and feels premium.</h1>
            <p>
              Launch your writing brand with a polished visual system, smooth publishing flow, and
              modern storytelling layouts crafted for growth.
            </p>
            <div className="hero-actions">
              {isAuthenticated ? (
                <Link to="/dashboard/create" className="btn btn-primary">
                  Create Blog
                </Link>
              ) : (
                <Link to="/signup" className="btn btn-primary">
                  Get Started
                </Link>
              )}
            </div>

            <div className="hero-metrics">
              <div>
                <strong>99.9%</strong>
                <span>Publishing reliability</span>
              </div>
              <div>
                <strong>Fast</strong>
                <span>Reader-first performance</span>
              </div>
              <div>
                <strong>Flexible</strong>
                <span>Custom identity and style</span>
              </div>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <img
              src="https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=1600"
              data-fallback="https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=1600&q=80"
              alt=""
              onError={handleImageFallback}
              referrerPolicy="no-referrer"
            />
            <div className="hero-floating-card">
              <h3>The Art of Writing</h3>
              <p>Design-forward publishing with creator control.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="showcase-grid container">
        {showcaseCards.map((card) => (
          <article key={card.title} className="showcase-card">
            <img
              src={card.image}
              data-fallback={card.fallback}
              alt=""
              onError={handleImageFallback}
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <div className="showcase-content">
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="cta-banner container">
        <h2>Launch your writer brand in minutes.</h2>
        <p>
          Sign up, customize your site identity, and ship your first story with an interface that
          looks and feels professional.
        </p>
        <div className="hero-actions">
          <Link to={isAuthenticated ? '/dashboard/settings' : '/signup'} className="btn btn-primary">
            {isAuthenticated ? 'Customize Your Site' : 'Get Started'}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
