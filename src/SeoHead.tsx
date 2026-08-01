import React, { useEffect } from 'react';
import { Tool, ActiveView } from '../types';

interface SeoHeadProps {
  selectedTool?: Tool | null;
  activeView: ActiveView;
}

export const SeoHead: React.FC<SeoHeadProps> = ({ selectedTool, activeView }) => {
  useEffect(() => {
    let title = 'SmartToolsHub - Free AI & Online Tools for Everyone';
    let description =
      'Access 20+ free AI tools, PDF converters, image editors, text utilities, financial calculators, and developer generators — fast, secure, and mobile friendly.';

    if (selectedTool) {
      title = `${selectedTool.name} - Free Online Tool | SmartToolsHub`;
      description = `${selectedTool.description} Free, fast, and secure online utility.`;
    } else if (activeView === 'blog') {
      title = 'Blog & Tech Guides | SmartToolsHub';
      description = 'Explore 20+ free tutorials, guides, and tips on PDF compression, AI resume building, image optimization, and financial calculators.';
    } else if (activeView === 'blog-post') {
      title = 'Tech & Utility Guide | SmartToolsHub Blog';
      description = 'Read expert guides on online tools, document conversion, image resizers, and productivity hacks.';
    } else if (activeView === 'about') {
      title = 'About SmartToolsHub - Free AI & Productivity Suite';
      description = 'Learn more about SmartToolsHub mission: delivering zero-paywall, privacy-first web utilities for students, developers, and creators.';
    } else if (activeView === 'contact') {
      title = 'Contact & Feedback | SmartToolsHub';
      description = 'Have a suggestion or need help? Get in touch with SmartToolsHub support team or request a new online tool.';
    } else if (activeView === 'privacy') {
      title = 'Privacy Policy | SmartToolsHub';
      description = 'Read our strict privacy policy: 100% client-side data processing and zero personal data retention.';
    } else if (activeView === 'terms') {
      title = 'Terms & Conditions | SmartToolsHub';
      description = 'SmartToolsHub terms of service, usage guidelines, and free license rules.';
    } else if (activeView === 'disclaimer') {
      title = 'Disclaimer & Legal Notice | SmartToolsHub';
      description = 'Important legal notices regarding calculator accuracy and general information disclaimers.';
    } else if (activeView === 'sitemap') {
      title = 'Sitemap.xml - Index of All Tools | SmartToolsHub';
      description = 'Full directory index of all free online AI, PDF, text, image, and developer tools.';
    } else if (activeView === 'robots') {
      title = 'Robots.txt Directive | SmartToolsHub';
      description = 'Search engine crawler instructions and sitemap directives for SmartToolsHub.';
    } else if (activeView === 'dashboard') {
      title = 'User Dashboard | SmartToolsHub';
      description = 'Manage your favorite saved tools, view recent tool usage history, and customize your profile.';
    } else if (activeView === '404') {
      title = '404 Page Not Found | SmartToolsHub';
      description = 'The requested tool or page could not be found.';
    }

    document.title = title;

    // Determine current path URL
    const currentPath = selectedTool
      ? `${window.location.origin}/#tool-${selectedTool.id}`
      : activeView !== 'home'
      ? `${window.location.origin}/#${activeView}`
      : window.location.origin;

    // Helper function for meta properties
    const setMetaProperty = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    const setMetaName = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    // Update Meta Description & Social Tags
    setMetaName('description', description);

    // Open Graph Tags
    setMetaProperty('og:title', title);
    setMetaProperty('og:description', description);
    setMetaProperty('og:type', 'website');
    setMetaProperty('og:site_name', 'SmartToolsHub');
    setMetaProperty('og:url', currentPath);

    // Twitter Card Tags
    setMetaName('twitter:card', 'summary_large_image');
    setMetaName('twitter:title', title);
    setMetaName('twitter:description', description);

    // Update Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentPath);

    // Embed Multi-Schema JSON-LD Structured Data
    const schemas = [
      // 1. WebSite Schema with SearchAction
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'SmartToolsHub',
        url: window.location.origin,
        description: 'Free online AI tools, PDF converters, image tools, financial calculators, and developer utilities.',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${window.location.origin}/#search={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      // 2. Organization Schema for AdSense Trust
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'SmartToolsHub',
        url: window.location.origin,
        logo: `${window.location.origin}/logo.png`,
        sameAs: ['https://twitter.com/SmartToolsHub', 'https://github.com/SmartToolsHub'],
      },
      // 3. BreadcrumbList Schema
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: window.location.origin,
          },
          ...(selectedTool
            ? [
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: selectedTool.categoryName,
                  item: `${window.location.origin}/#category-${selectedTool.category}`,
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: selectedTool.name,
                  item: currentPath,
                },
              ]
            : activeView !== 'home'
            ? [
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: activeView.charAt(0).toUpperCase() + activeView.slice(1),
                  item: currentPath,
                },
              ]
            : []),
        ],
      },
      // 4. WebApplication Schema
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: selectedTool ? selectedTool.name : 'SmartToolsHub',
        url: currentPath,
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'All',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        description: description,
      },
    ];

    let scriptTag = document.getElementById('json-ld-schema');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'json-ld-schema';
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(schemas);
  }, [selectedTool, activeView]);

  return null;
};
