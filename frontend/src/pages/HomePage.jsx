import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../styles/pages/HomePage.scss';

const showcaseCards = [
  {
    title: 'Editorial Craft',
    text: 'Shape long-form stories with elegant typography and immersive reading rhythm.',
    icon: '✍️',
    image:
      'https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?auto=compress&cs=tinysrgb&w=1200',
    fallback:
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Creator Workflow',
    text: 'Draft, edit, and publish with a focused studio built for consistent output.',
    icon: '🎨',
    image:
      'https://images.pexels.com/photos/3747468/pexels-photo-3747468.jpeg?auto=compress&cs=tinysrgb&w=1200',
    fallback:
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Audience Growth',
    text: 'Understand what resonates and turn loyal readers into a lasting community.',
    icon: '📈',
    image:
      'https://images.pexels.com/photos/3183171/pexels-photo-3183171.jpeg?auto=compress&cs=tinysrgb&w=1200',
    fallback:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
  },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Travel Blogger',
    text: 'Blogify transformed how I publish. The interface is intuitive and my readers love the clean design.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=60',
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'Tech Writer',
    text: 'Finally found a platform that respects my work and my readers. The performance is incredible.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=60',
    rating: 5,
  },
  {
    name: 'Emma Williams',
    role: 'Lifestyle Creator',
    text: 'The customization options let me express my brand perfectly. My engagement has doubled!',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=60',
    rating: 5,
  },
  {
    name: 'David Park',
    role: 'Business Analyst',
    text: 'Professional, reliable, and beautiful. This is how blog platforms should be built.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=60',
    rating: 5,
  },
];

const howItWorks = [
  {
    step: '01',
    title: 'Create Your Account',
    description: 'Sign up in seconds and get started with a beautiful template ready to customize.',
    icon: '🚀',
  },
  {
    step: '02',
    title: 'Customize Your Site',
    description: 'Choose your colors, fonts, and layout to match your unique brand identity.',
    icon: '🎯',
  },
  {
    step: '03',
    title: 'Write & Publish',
    description: 'Use our powerful editor to create engaging content and publish instantly.',
    icon: '📝',
  },
  {
    step: '04',
    title: 'Grow Your Audience',
    description: 'Share your work and connect with readers who love what you create.',
    icon: '👥',
  },
];

const HomePage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleImageFallback = (event) => {
    const target = event.currentTarget;
    const fallback = target.dataset.fallback;

    if (fallback && target.src !== fallback) {
      target.src = fallback;
      return;
    }

    target.style.visibility = 'hidden';
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
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
              <Link to="/feed" className="btn btn-secondary">
                Explore Posts
              </Link>
            </div>

            <div className="hero-metrics">
              <div>
                <strong>99.9%</strong>
                <span>Publishing reliability</span>
              </div>
              <div>
                <strong>⚡ Fast</strong>
                <span>Reader-first performance</span>
              </div>
              <div>
                <strong>🎨 Flexible</strong>
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

      {/* Features Showcase */}
      <section className="showcase-grid container">
        {showcaseCards.map((card) => (
          <article key={card.title} className="showcase-card">
            <div className="showcase-icon">{card.icon}</div>
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

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Get your blog up and running in 4 simple steps</p>
          </div>
          <div className="steps-grid">
            {howItWorks.map((item) => (
              <div key={item.step} className="step-card">
                <div className="step-number">{item.step}</div>
                <div className="step-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials / Reviews */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <h2>Loved by Creators Everywhere</h2>
            <p>Join thousands of writers building their audience with Blogify</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="stars">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>
                <p className="testimonial-text">{testimonial.text}</p>
                <div className="testimonial-author">
                  <img src={testimonial.avatar} alt={testimonial.name} />
                  <div>
                    <strong>{testimonial.name}</strong>
                    <span>{testimonial.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <h3>500K+</h3>
              <p>Active Writers</p>
            </div>
            <div className="stat-item">
              <h3>10M+</h3>
              <p>Monthly Readers</p>
            </div>
            <div className="stat-item">
              <h3>100+</h3>
              <p>Countries</p>
            </div>
            <div className="stat-item">
              <h3>50M+</h3>
              <p>Articles Published</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner container">
        <div className="cta-content">
          <h2>Launch your writer brand in minutes.</h2>
          <p>
            Sign up, customize your site identity, and ship your first story with an interface that
            looks and feels professional.
          </p>
          <div className="hero-actions">
            <Link to={isAuthenticated ? '/dashboard/settings' : '/signup'} className="btn btn-primary">
              {isAuthenticated ? 'Customize Your Site' : 'Get Started for Free'}
            </Link>
            <Link to="/feed" className="btn btn-secondary">
              Browse Stories
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
