import { Link, Outlet, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { blogService } from '../../services/blogService';
import Logo from '../common/Logo';
import '../../styles/PublicSiteLayout.scss';

const PublicSiteLayout = () => {
  const { siteSlug } = useParams();
  const [site, setSite] = useState(null);

  useEffect(() => {
    const fetchSite = async () => {
      try {
        if (!siteSlug) {
          return;
        }
        const data = await blogService.getSiteProfile(siteSlug);
        setSite(data);
      } catch (error) {
        setSite(null);
      }
    };

    fetchSite();
  }, [siteSlug]);

  const postsPath = `/site/${siteSlug}`;

  return (
    <div className="public-site-layout">
      <header className="public-site-header">
        <div className="container header-inner">
          <Link to={postsPath} className="site-brand">
            <Logo text={site?.siteName || 'Blogify Public'} light />
          </Link>
          <nav className="site-nav">
            <Link to={postsPath}>All Posts</Link>
            <Link to="/login">Login</Link>
          </nav>
        </div>
      </header>
      <main className="public-site-main">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicSiteLayout;
