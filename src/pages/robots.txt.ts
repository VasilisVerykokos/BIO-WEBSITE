import type { APIRoute } from 'astro';

/**
 * Generated rather than committed, so the sitemap URL follows SITE_URL instead
 * of hardcoding a host. Gate 1: one artifact, config supplies the environment.
 */
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site).href;

  return new Response(
    [
      '# Everything here is public and there is nothing worth hiding from a crawler.',
      'User-agent: *',
      'Allow: /',
      '',
      `Sitemap: ${sitemap}`,
      '',
    ].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
};
