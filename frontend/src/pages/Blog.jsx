import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import { blogPosts } from '../data/blogPosts';
import { Calendar, User, ChevronRight } from 'lucide-react';
import AdPlacement from '../components/AdPlacement';

const Blog = () => {
  return (
    <div className="blog-page fade-in" style={{ paddingBottom: '5rem', minHeight: '80vh' }}>
      <SEO 
        title="KCET & COMEDK Blog | Exam Tips, Cutoffs & Updates 2026"
        description="Stay updated with the latest KCET & COMEDK 2026 news, counseling step-by-step guides, placement statistics, and rank cutoff trends."
      />
      
      <div className="container" style={{ maxWidth: '1100px', paddingTop: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            The Rank2College <span className="gradient-text">Blog</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            Expert admission strategies, cutoff analysis, and counseling guides to help you secure a seat in your dream college.
          </p>
        </div>

        <AdPlacement type="horizontal" id="blog-top" />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2.5rem', marginTop: '3rem' }}>
          {blogPosts.map((post, index) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card glass-card"
              style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', border: 'none' }}
            >
              {/* Note: In a real prod environment you'd have real images. Using placeholder colors locally if images fail to load */}
              <div style={{ height: '200px', background: 'var(--primary-light)', overflow: 'hidden', position: 'relative' }}>
                <img 
                  src={post.image} 
                  alt={post.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  className="blog-img"
                  loading="lazy"
                />
              </div>
              
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 600 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={14} /> {post.date}</span>
                </div>
                
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.3 }}>
                  <Link to={`/blog/${post.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {post.title}
                  </Link>
                </h2>
                
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem', flex: 1 }}>
                  {post.excerpt}
                </p>
                
                <Link to={`/blog/${post.slug}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 800, textDecoration: 'none', fontSize: '1.05rem', marginTop: 'auto' }}>
                  Read Article <ChevronRight size={18} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <style>{`
        .blog-img:hover { transform: scale(1.05); }
      `}</style>
    </div>
  );
};

export default Blog;
