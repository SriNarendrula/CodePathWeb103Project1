import express from 'express';
import gamesData from './data.js'; // Note: You MUST explicitly include '.js' here!

const app = express();
const PORT = 3000;

// Serve static assets out of the public directory
app.use(express.static('public'));

// Common wrapper function to inject Pico.css layout
function wrapHTML(title, content) {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css">
        </head>
        <body>
            <main class="container">
                ${content}
            </main>
        </body>
        </html>
    `;
}

// 1. Homepage Route - Displays the list of arcade games
app.get('/', (req, res) => {
    let listContent = `
        <header>
            <h1>🕹️ Retro Arcade Cabinet Database</h1>
            <p>Explore legendary historical cabinets from the golden age of arcades.</p>
        </header>
        <hr />
        <div class="grid">
    `;

    Object.values(gamesData).forEach(game => {
        listContent += `
            <article>
                <img src="${game.image}" alt="${game.title}" style="width:100%; height:180px; object-fit:cover; border-radius:4px;">
                <h3>${game.title}</h3>
                <p><strong>Genre:</strong> ${game.genre}<br><strong>Year:</strong> ${game.year}</p>
                <a href="/games/${game.id}" role="button">View Details</a>
            </article>
        `;
    });

    listContent += `</div>`;
    res.send(wrapHTML('Arcade Database', listContent));
});

// 2. Individual Detail Route
app.get('/games/:id', (req, res) => {
    const game = gamesData[req.params.id];

    if (!game) {
        return res.status(404).send(wrapHTML('404 Not Found', `
            <h1>404 - Cabinet Not Found</h1>
            <p>Sorry, that classic game isn't in our database records.</p>
            <a href="/" role="button" class="secondary">Back to Database</a>
        `));
    }

    const detailContent = `
        <header>
            <nav aria-label="breadcrumb">
                <ul>
                    <li><a href="/">Database Home</a></li>
                    <li><strong>${game.title}</strong></li>
                </ul>
            </nav>
            <h1>${game.title}</h1>
        </header>
        
        <article>
            <div class="grid">
                <div>
                    <img src="${game.image}" alt="${game.title}" style="width:100%; border-radius:8px;">
                </div>
                <div>
                    <h3>Cabinet Specifications</h3>
                    <ul>
                        <li><strong>Release Year:</strong> ${game.year}</li>
                        <li><strong>Manufacturer:</strong> ${game.manufacturer}</li>
                        <li><strong>Genre:</strong> ${game.genre}</li>
                        <li><strong>All-Time High Score Record:</strong> ${game.highScore}</li>
                    </ul>
                    <p><strong>Description:</strong> ${game.desc}</p>
                    <a href="/" role="button" class="secondary">← Back to Cabinet List</a>
                </div>
            </div>
        </article>
    `;

    res.send(wrapHTML(`${game.title} - Arcade Details`, detailContent));
});

app.listen(PORT, () => {
    console.log(`Server running successfully! Open: http://localhost:${PORT}`);
});