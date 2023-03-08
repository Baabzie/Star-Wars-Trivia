//Class so we can generate characters.
class Character {
    constructor(name, gender, height, mass, hairColor, skinColor, eyeColor, movies) {
        this.name = name;
        this.gender = gender;
        this.height = height;
        this.mass = mass;
        this.hairColor = hairColor;
        this.skinColor = skinColor;
        this.eyeColor = eyeColor;
        this.movies = movies;
        this.pictureURL = `assets/charPic/${name}.png`;
    }
}

//Selecting the "Compare characters"-button from "index.html".
const compareBtn = document.getElementById("compareBtn");

//"Main"-function that runs when you press the "Compare characters"-button.
compareBtn.addEventListener("click", async () => {
    document.getElementById("listDiv").innerHTML = "";
    let goodCharacter = document.getElementById("characterSelectGood");
    let evilCharacter = document.getElementById("characterSelectEvil");
    let goodCharData = await getData(`https://swapi.dev/api/people/${goodCharacter.value}`);
    let evilCharData = await getData(`https://swapi.dev/api/people/${evilCharacter.value}`)
    let goodChar = createCharacter(goodCharData);
    let evilChar = createCharacter(evilCharData);
    console.log(goodChar);
    console.log(evilChar);
    createCharacterList(goodChar);
    createCharacterList(evilChar);
})

//Function to get data from URL.
const getData = async (url) => {
    let response = await fetch(url);
    let json = await response.json();
    return json;
  };

//Function to create characters with our class "Character".
const createCharacter = (charData) => {
    let { name, gender, height, mass, hair_color: hairColor, skin_color: skinColor, eye_color: eyeColor, films: movies, } = charData;
    
    let char = new Character(name, gender, height, mass, hairColor, skinColor, eyeColor, movies)
    return char;
}

//Function to create a list for a character.
const createCharacterList = (char) => {
    let listDiv = document.getElementById("listDiv");
    let charDiv = document.createElement("div");
    let charPic = document.createElement("img");
    charPic.src = char.pictureURL;
    charPic.alt = `Picture of ${char.name}.`;
    let characterlist = document.createElement("ul");
    characterlist.innerHTML = `
        <li>Hair color: ${char.hairColor}</li>
        <li>Skin color: ${char.skinColor}</li>
        <li>Eye color: ${char.eyeColor}</li>
        <li>Height: ${char.height}</li>
        <li>Weight: ${char.mass}kg</li>
        <li>Sex: ${char.gender}</li>
        <li>${char.name} as been in ${char.movies.length} movies.</li>
    `;
    listDiv.append(charDiv);
    charDiv.append(charPic, characterlist);
}