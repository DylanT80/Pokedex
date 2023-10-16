const pokedex = document.querySelector("#pokedex");
nextURL = null;
prevURL = null;

// Fills the pokedex w/ pagination
// @params
//      id: unique identifier
const fillPokedex = async (id) => {
    try {       
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);    // Get pagination data
        pokedex.innerHTML = "";                                                         // Clear the UL
        
        // Get individual pokemon data in order
        const promises = [];
        response.data.results.forEach(pokemon => {
            promises.push(getPokemon(pokemon.name));                                    
        });
        Promise.all(promises).then((pokemons) => {                                         // Promise.all gurantees in order
            pokemons.forEach((pokemon) => addPokemon(pokemon));
        });
        
        // Set the nav endpoints
        nextURL = response.data.next ? "?" + (response.data.next).split("?")[1] : null;
        prevURL = response.data.previous ? "?" + (response.data.previous).split("?")[1] : null;
    } catch (error) {
        console.error(error);
    }
}

// Add pokemon to pokedex UL
// @param
//      pokemon: data of the pokemon
const addPokemon = (pokemon) => {
    const li = document.createElement("li");
    pokemon.name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
    const pokemonHTMLString = `
    <div class="container">
        <div class="bg-img">
            <img src=${pokemon.sprites.other["official-artwork"].front_default} />
        </div>
        <h2>${pokemon.name}</h2>
    </div>
    `;
    li.innerHTML = pokemonHTMLString;
    pokedex.appendChild(li);
}

// Get individual pokemon info
// @params
//      id: unique identifier for pokemon
// @return
//      json: a pokemon's data
const getPokemon = async (id) => {
    try {       
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// Nav buttons
const prev = () => {
    if (prevURL) {
        fillPokedex(prevURL);
    }
}
const next = () => {
    if (nextURL) {
        fillPokedex(nextURL);
    }
}

// Initial pokedex load
fillPokedex("?limit=24");