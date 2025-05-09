/**
 * Update page title and meta tags
 * @param {Object} options - SEO options
 * @param {string} options.title - Page title
 * @param {string} options.description - Page description
 * @param {string} options.keywords - Page keywords
 * @param {string} options.ogImage - Open Graph image URL
 * @param {string} options.ogUrl - Open Graph URL
 */
export const updateSEO = ({
  title,
  description,
  keywords,
  ogImage,
  ogUrl
}) => {
  // Update page title
  document.title = title ? `${title} | Medicare` : 'Medicare - Doctor Appointment Booking';

  // Get existing meta tags
  const metaTags = {
    description: document.querySelector('meta[name="description"]'),
    keywords: document.querySelector('meta[name="keywords"]'),
    ogTitle: document.querySelector('meta[property="og:title"]'),
    ogDescription: document.querySelector('meta[property="og:description"]'),
    ogImage: document.querySelector('meta[property="og:image"]'),
    ogUrl: document.querySelector('meta[property="og:url"]')
  };

  // Update or create meta description
  if (description) {
    if (metaTags.description) {
      metaTags.description.setAttribute('content', description);
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      meta.setAttribute('content', description);
      document.head.appendChild(meta);
    }
  }

  // Update or create meta keywords
  if (keywords) {
    if (metaTags.keywords) {
      metaTags.keywords.setAttribute('content', keywords);
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute('name', 'keywords');
      meta.setAttribute('content', keywords);
      document.head.appendChild(meta);
    }
  }

  // Update or create Open Graph title
  if (title) {
    if (metaTags.ogTitle) {
      metaTags.ogTitle.setAttribute('content', `${title} | Medicare`);
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:title');
      meta.setAttribute('content', `${title} | Medicare`);
      document.head.appendChild(meta);
    }
  }

  // Update or create Open Graph description
  if (description) {
    if (metaTags.ogDescription) {
      metaTags.ogDescription.setAttribute('content', description);
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:description');
      meta.setAttribute('content', description);
      document.head.appendChild(meta);
    }
  }

  // Update or create Open Graph image
  if (ogImage) {
    if (metaTags.ogImage) {
      metaTags.ogImage.setAttribute('content', ogImage);
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:image');
      meta.setAttribute('content', ogImage);
      document.head.appendChild(meta);
    }
  }

  // Update or create Open Graph URL
  if (ogUrl) {
    if (metaTags.ogUrl) {
      metaTags.ogUrl.setAttribute('content', ogUrl);
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:url');
      meta.setAttribute('content', ogUrl);
      document.head.appendChild(meta);
    }
  }
};
