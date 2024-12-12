import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, path }) => {
  const baseUrl = 'https://hoangcongtho-portfolio.vercel.app';
  
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={`${baseUrl}${path}`} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={`${baseUrl}${path}`} />
    </Helmet>
  );
};

export default SEO;