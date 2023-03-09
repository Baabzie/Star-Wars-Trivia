//Class so we can generate characters.
class Character {
    constructor(name, gender, height, mass, hairColor, skinColor, eyeColor, movies) {
        this.name = firstLetterUpperCase(name);
        this.gender = firstLetterUpperCase(gender);
        this.height = height;
        this.mass = mass;
        this.hairColor = firstLetterUpperCase(hairColor);
        this.skinColor = firstLetterUpperCase(skinColor);
        this.eyeColor = firstLetterUpperCase(eyeColor);;
        this.movies = movies;
        this.pictureURL = `assets/charPic/${name}.png`;
    }
}

// Function to get uppcase in beginning of string.
const firstLetterUpperCase = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

//Selecting the "Compare characters"-button from "index.html".
const compareBtn = document.getElementById("compareBtn");

//"Main"-function that runs when you press the "Compare characters"-button.
compareBtn.addEventListener("click", async () => {
    document.getElementById("listDiv").innerHTML = "";
    document.getElementById("compareListDiv").innerHTML = "";
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
    createCompareCharacterList(goodChar, evilChar);
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
    charDiv.classList.add("char-div")
    let charName = document.createElement("h2");
    charName.innerText = char.name;
    let charPic = document.createElement("img");
    charPic.src = char.pictureURL;
    charPic.alt = `Picture of ${char.name}.`;
    charPic.classList.add("char-pic");
    let characterlist = document.createElement("ul");
    characterlist.innerHTML = `
        <li>Hair color: ${char.hairColor}</li>
        <li>Skin color: ${char.skinColor}</li>
        <li>Eye color: ${char.eyeColor}</li>
        <li>Height: ${char.height}cm</li>
        <li>Weight: ${char.mass}kg</li>
        <li>Sex: ${char.gender}</li>
        <li>${char.name} as been in ${char.movies.length} movies.</li>
    `;
    listDiv.append(charDiv);
    charDiv.append(charName, charPic, characterlist);
}

const compareCharactersNumbers = (goodName, goodNum, evilName, evilNum) => {
    if (Number(goodNum) > Number(evilNum)){
        return goodName;
    }
    else if (Number(goodNum) < Number(evilNum)) {
        return evilName;
    }
    else {
        return "Same"
    }
}

const compareCharactersStrings = (goodString, evilString) => {
    if (goodString === evilString) {
        return true;
    }
    else {
        return false;
    }
}

const createCompareCharacterList = (goodChar, evilChar) => {
    let compareListDiv = document.getElementById("compareListDiv");
    let comparelist = document.createElement("ul");

    //Make a string of who is tallest.
    let tallestChar = compareCharactersNumbers(goodChar.name, goodChar.height, evilChar.name, evilChar.height);
    let tallestString = `The tallest of the two characters is ${tallestChar}.`;
    if (tallestChar === "Same") {
        tallestString = `The two characters are the same height.`;
    }

    //Make a string of who is heaviest.
    let heaviestChar = compareCharactersNumbers(goodChar.name, goodChar.mass, evilChar.name, evilChar.mass);
    let heaviestString = `The heaviest of the two characters is ${heaviestChar}.`;
    if (heaviestChar === "Same") {
        heaviestString = `The two characters weight the same.`;
    }

    //Make a string of who appeard in most movies.
    let mostMoviesChar = compareCharactersNumbers(goodChar.name, goodChar.movies.length, evilChar.name, evilChar.movies.length);
    let mostMoviesString = `Of these two characters ${mostMoviesChar} appeared in most movies.`;
    if (mostMoviesChar === "Same") {
        mostMoviesString = `The two characters appeared in the same amount of movies.`;
    }

    //Make a string that tells us if the characters have the same sex or not.
    let sameSex = compareCharactersStrings(goodChar.gender, evilChar.gender);
    let sameSexString = `The two characters are of the same sex.`;
    if (!sameSex) {
        sameSexString = `The two characters are not of the same sex.`
    }

    //Make a string that tells us if the characters have the same hair color.
    let sameHairColor = compareCharactersStrings(goodChar.hairColor, evilChar.hairColor);
    let sameHairColorString = `The two characters have the same hair color.`;
    if (!sameHairColor) {
        sameHairColorString = `The two characters do not have the same hair color.`
    }

    //Make a string that tells us if the characters have the same skin color.
    let sameSkinColor = compareCharactersStrings(goodChar.skinColor, evilChar.skinColor);
    let sameSkinColorString = `The two characters have the same skin color.`;
    if (!sameSkinColor) {
        sameSkinColorString = `The two characters do not have the same skin color.`
    }

    comparelist.innerHTML = `
        <li>${tallestString}</li>
        <li>${heaviestString}</li>
        <li>${mostMoviesString}</li>
        <li>${sameSexString}</li>
        <li>${sameHairColorString}</li>
        <li>${sameSkinColorString}</li>
    `;
    compareListDiv.append(comparelist);
}








// window.addEventListener("click", event => {
//     const audio = document.querySelector("audio");
//     audio.volume = 0.2;
//     audio.play();
// });