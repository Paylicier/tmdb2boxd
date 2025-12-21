function decodeHtml(text: string): string {
    return text
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&apos;/g, "'");
}

interface LetterboxdData {
    letterboxdId: string;
    title: string;
    description: string;
    url: string;
    tmdbId: string;
}

export interface Env {
    TMDB2BOXD_KV: KVNamespace;
}

async function fetchLetterboxdData(tmdbId: string): Promise<LetterboxdData | null> {
    const letterboxdUrl = `https://letterboxd.com/tmdb/${tmdbId}`;

    const response = await fetch(letterboxdUrl, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
        },
        redirect: 'follow',
    });

    if (!response.ok) {
        return null;
    }

    const html = await response.text();
    const finalUrl = response.url;

    const letterboxdIdMatch = html.match(/boxd\.it\/([a-zA-Z0-9]+)/); //boxd.it/XXXX
    const letterboxdId = letterboxdIdMatch ? letterboxdIdMatch[1] : null;

    const titleMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/);
    const title = titleMatch ? decodeHtml(titleMatch[1]) : null;

    const descriptionMatch = html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/);
    const description = descriptionMatch ? decodeHtml(descriptionMatch[1]) : null;

    const urlMatch = html.match(/<meta\s+property="og:url"\s+content="([^"]+)"/);
    const url = urlMatch ? urlMatch[1] : finalUrl;

    if (!letterboxdId || !title) {
        return null;
    }

    return {
        letterboxdId,
        title,
        description: description || '',
        url,
        tmdbId,
    };
}

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const url = new URL(request.url);
        const path = url.pathname;

        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        // CORS thing
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        if (request.method !== 'GET') {
            return new Response(JSON.stringify({ error: 'Method not allowed' }), {
                status: 405,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        const tmdbMatch = path.match(/^\/tmdb\/(\d+)$/);
        if (!tmdbMatch) {
            return new Response(
                JSON.stringify({
                    error: 'Not found',
                    usage: '/tmdb/:id where :id is a TMDB movie ID',
                }),
                {
                    status: 404,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                }
            );
        }

        const tmdbId = tmdbMatch[1];

        let data: LetterboxdData | null = await env.TMDB2BOXD_KV.get(`tmdb_${tmdbId}`, { type: 'json' });

        if (!data) {
            data = await fetchLetterboxdData(tmdbId);
            if (data) {
                await env.TMDB2BOXD_KV.put(`tmdb_${tmdbId}`, JSON.stringify(data), { expirationTtl: 604800 }); // 7 days
            }
        }
            
        if (!data) {
            return new Response(
                JSON.stringify({ error: 'Movie not found on Letterboxd', tmdbId }),
                {
                    status: 404,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                }
            );
        }

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
}