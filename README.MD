<br>

> [!WARNING]
> This project is not affiliated with, endorsed by, or sponsored by **Letterboxd** or **The Movie Database (TMDB)**. All movie data, metadata, and related content are the property of their respective owners.
> 
> - **Letterboxd** is a trademark of Letterboxd Limited.
> - **TMDB** data is provided under their [Terms of Use](https://www.themoviedb.org/terms-of-use).
> 
> This tool is provided for educational and personal use only. Please respect the terms of service of both platforms when using this API.

<div align="center">
<br>

  # TMDB2BOXD
  
  A Cloudflare Worker to get the Letterboxd ID of a movie from its TMDB ID

  ![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
  ![License](https://img.shields.io/badge/License-MIT-orange)
</div>

## API Usage 🚀

### Endpoint

```
GET /tmdb/:id
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | The TMDB movie ID |

### Response

**Success (200)**
```json
{
  "letterboxdId": "2a1m",
  "title": "The Matrix (1999)",
  "description": "Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.",
  "url": "https://letterboxd.com/film/the-matrix/",
  "tmdbId": "603"
}
```

**Not Found (404)**
```json
{
  "error": "Movie not found on Letterboxd",
  "tmdbId": "123456789"
}
```

### Example

```bash
curl https://boxd.notri1.fr/tmdb/603
```

## Setup 🛠️

### Prerequisites

- [Bun](https://bun.sh/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- Cloudflare account

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Paylicier/tmdb2boxd.git
   cd tmdb2boxd
   ```

2. Install dependencies
   ```bash
   bun install
   ```

3. Run locally
   ```bash
   bun run dev
   ```

4. Deploy to Cloudflare
   ```bash
   bun run deploy
   ```

## Contributing 🤝

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📄

This project is available under **MIT**

Please the license carefully before using this software. If you have any questions about licensing, please open an issue.

---

<div align="center">
  Built with ❤️ and 🧑‍🍳 by Paul
</div>
