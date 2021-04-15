const botz = document.getElementById('botz');
const newBotForm = document.getElementById('new-bot-form');
const botURL = 'http://localhost:3000/bots';

const headers = {
  'Content-type': 'application/json',
  Accepts: 'application/json',
};

newBotForm.addEventListener('submit', createNewBot);

fetchBots();

function fetchBots() {
  fetch(botURL)
    .then((res) => res.json())
    .then(handleBots);
}

function handleBots(bots) {
  botz.innerHTML = '';
  bots.forEach(displayBot);
}

function displayBot(bot) {
  const botCard = document.createElement('div');
  botCard.innerHTML = `
    <h1>${bot.name} <a class="del">[X]</a></h1>
    <p><input name="rename"></input><button>rename</button></p>
    <img src="${bot.avatar_url}" />

  `;
  const deleteX = botCard.querySelector('a');
  deleteX.addEventListener('click', () => deleteBot(bot.id));

  const renameInput = botCard.querySelector('input');
  const renameButton = botCard.querySelector('button');
  renameButton.addEventListener('click', () =>
    updateBot(bot.id, renameInput.value)
  );

  botz.append(botCard);
}

function deleteBot(id) {
  fetch(`${botURL}/${id}`, {
    method: 'DELETE',
    headers,
  }).then(fetchBots());
}

function updateBot(id, name) {
  const data = { name };

  fetch(`${botURL}/${id}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(data),
  }).then(fetchBots());
}

function createNewBot(e) {
  e.preventDefault();
  const name = e.target.botname.value;

  const data = {
    name,
    avatar_url: `https://robohash.org/${name}.png?size=300x300&set=set1`,
  };

  fetch(botURL, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  })
    .then(fetchBots());

  e.target.botname.value = '';
}

// GET - read bots
// POST - create a new bot
// DELETE - destroy a bot
// PATCH - edit a bot / update a bot
