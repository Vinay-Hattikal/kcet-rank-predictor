import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import { blogPosts } from '../data/blogPosts';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import AdPlacement from '../components/AdPlacement';

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    // Scroll to top on load
    window.scrollTo(0, 0);
    const foundPost = blogPosts.find(p => p.slug === slug);
    setPost(foundPost);
  }, [slug]);

  if (!post) {
    return (
      <div className="container fade-in" style={{ padding: '8rem 2rem', textAlign: 'center', minHeight: '60vh' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Article Not Found</h1>
        <p style={{ color: 'var(--text-muted)' }}>We couldn't find the article you're looking for.</p>
        <Link to="/blog" className="btn btn-primary" style={{ marginTop: '2rem' }}>Back to Blog</Link>
      </div>
    );
  }

  return (
    <article className="blog-post fade-in" style={{ paddingBottom: '6rem' }}>
      <SEO 
        title={`${post.title} | KCET 2026`}
        description={post.excerpt}
      />
      
      {/* Hero Section */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border-color)', paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontWeight: 600, textDecoration: 'none', marginBottom: '2rem' }}>
            <ArrowLeft size={16} /> Back to all articles
          </Link>
          
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, lineHeight: 1.2, marginBottom: '1.5rem', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
            {post.title}
          </h1>
          
          <div style={{ display: 'flex', gap: '2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.95rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={16} /> By {post.author}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={16} /> {post.date}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container" style={{ maxWidth: '800px', paddingTop: '3rem' }}>
        <AdPlacement type="horizontal" id="blog-content-top" />
        
        <div 
          className="blog-content card glass-card" 
          style={{ padding: 'clamp(2rem, 5vw, 4rem)', border: 'none', marginTop: '2rem', fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--text-main)' }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        <AdPlacement type="horizontal" id="blog-content-bottom" />
        
        <div style={{ textAlign: 'center', marginTop: '5rem' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>Ready to find your college?</div>
          <Link to="/" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
            Try the College Predictor Now
          </Link>
        </div>
      </div>

      <style>{`
        .blog-content h2 { font-size: 2rem; font-weight: 800; margin: 2.5rem 0 1rem; color: var(--primary); letter-spacing: -0.02em; }
        .blog-content h3 { font-size: 1.5rem; font-weight: 700; margin: 2rem 0 1rem; color: var(--text-main); }
        .blog-content p { margin-bottom: 1.5rem; opacity: 0.9; }
        .blog-content ul { margin-bottom: 2rem; padding-left: 1.5rem; }
        .blog-content li { margin-bottom: 0.5rem; opacity: 0.9; }
        .blog-content a { color: var(--secondary-dark); font-weight: 700; text-decoration: underline; }
      `}</style>
    </article>
  );
};

export default BlogPost;
