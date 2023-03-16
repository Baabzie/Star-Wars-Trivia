//Class so we can generate characters.
class Character {
    constructor(name, gender, height, mass, hairColor, skinColor, eyeColor, movies, homeworld, starships, vehicles) {
        this.name = firstLetterUpperCase(name);
        this.gender = firstLetterUpperCase(gender);
        this.height = height;
        this.mass = mass;
        this.hairColor = firstLetterUpperCase(hairColor);
        this.skinColor = firstLetterUpperCase(skinColor);
        this.eyeColor = firstLetterUpperCase(eyeColor);;
        this.movies = movies;
        this.homeworld = homeworld;
        this.starships = starships;
        this.vehicles = vehicles;
        this.pictureURL = `assets/charPic/${name}.png`;
    }
    showFirstApperanceData = async () => {
        let firstMovieData = await getData(this.movies[0]);
        return `${this.name} first appeared ${firstMovieData.release_date} in ${firstMovieData.title}.`;
    }
    showMostExpensiveVehicle = async () => {
        let allVehicleArray = [];
        for (const starship of this.starships) {
            let starshipData = await getData(starship);
            allVehicleArray.push(starshipData);
        }
        for (const vehicle of this.vehicles) {
            let vehicleData = await getData(vehicle);
            allVehicleArray.push(vehicleData);
        }
        let allVehicleNamePriceArray = [];
        allVehicleArray.forEach((vehicle) => {
            let vehicleName = vehicle.name;
            let vehiclePrice = vehicle.cost_in_credits;
            if (vehiclePrice === "unknown") {
                vehiclePrice = 0;
            }
            else {
                vehiclePrice = Number(vehiclePrice);
            }
            let vehicleObj = {
                name: vehicleName,
                price: vehiclePrice,
            };
            allVehicleNamePriceArray.push(vehicleObj);
        })
        allVehicleNamePriceArray.sort((a, b) => b.price - a.price);
        if (allVehicleNamePriceArray.length === 0) {
            return `${this.name} has never been seen pilot a starship or drive a vehicle.`
        }
        else if (allVehicleArray.length === 1) {
            return `${this.name} has only been seen using one vehicle or starship and that is the ${allVehicleNamePriceArray[0].name}.`
        }
        else if (allVehicleArray[0].price === 0 ){
            return `${this.name} has only been seen using vehicles or starships that we don't know the price of.`
        }
        else {
            return `The most expensive vehicle or starship we seen ${this.name} use is the ${allVehicleNamePriceArray[0].name}.`
        }
    }
    showCommonMovies = async (comparedChar) => {
        let charMoviesArray = [];
        let comparedCharMoviesArray = [];
        for (const movie of this.movies) {
            let movieData = await getData(movie);
            charMoviesArray.push(movieData.title);
        }
        for (const movie of comparedChar.movies) {
            let movieData = await getData(movie);
            comparedCharMoviesArray.push(movieData.title);
        }
        let sameMoviesArray = charMoviesArray.filter(title => comparedCharMoviesArray.includes(title));
        if (sameMoviesArray.length === 0) {
            return `${this.name} and ${comparedChar.name} do not appear in the same movies.`;
        }
        else if (sameMoviesArray.length === 1) {
            return `${this.name} and ${comparedChar.name} only both appear in the movie ${sameMoviesArray}.`
        }
        else {
            let sameMovieStringArray = [];
            sameMoviesArray.forEach((title, i) => {
                if (i+1 < (sameMoviesArray.length - 1)){
                    sameMovieStringArray.push(`${title},`);
                }
                else if(i+1 < (sameMoviesArray.length)) {
                    sameMovieStringArray.push(`${title}`);
                }
                else {
                    sameMovieStringArray.push(`and ${title}`)
                }
            })
            return `${this.name} and ${comparedChar.name} do both appear in the movies: ${sameMovieStringArray.join(" ")}.`
        }
    }
    showCommonHomeworld = async (comparedChar) => {
        let charHomeworldData = await getData(this.homeworld);
        let charHomeworldTitle = charHomeworldData.name;
        let comparedCharHomeworldData = await getData(comparedChar.homeworld);
        let comparedCharHomeworldTitle = comparedCharHomeworldData.name;
        if (charHomeworldTitle === comparedCharHomeworldTitle) {
            if (charHomeworldTitle === "unknown") {
                return `Both ${this.name} and ${comparedChar.name} are from unknown planets.`
            }
            else {
                return `${this.name} and ${comparedChar.name} are both from the planet ${charHomeworldTitle}.`
            }
        }
        else {
            if (charHomeworldTitle === "unknown") {
                return `${this.name} is from an unknown planet and ${comparedChar.name} is from the planet ${comparedCharHomeworldTitle}.`
            }
            else if (comparedCharHomeworldTitle === "unknown") {
                return `${this.name} is from the planet ${charHomeworldTitle} and ${comparedChar.name} is from an unknown planet.`
            }
            else{
                return `${this.name} is from the planet ${charHomeworldTitle} and ${comparedChar.name} is from the planet ${comparedCharHomeworldTitle}.`
            }
        }
    }
}

//Function to randomly play audio (TIE fighter sound).
const tieSound = () => {
    let randomNumber = Math.floor(Math.random() * 6);
    console.log(randomNumber);
    let sound = document.getElementById("t" + randomNumber);
     sound.volume = 0.1;
     sound.play();
}

// Function to get uppcase in beginning of string.
const firstLetterUpperCase = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

//Selecting the "Compare characters"-button from "index.html".
const compareBtn = document.getElementById("compareBtn");

//"Main"-function that runs when you press the "Compare characters"-button.
compareBtn.addEventListener("click", async () => {
    tieSound();
    let goodCharacter = document.getElementById("characterSelectGood");
    let evilCharacter = document.getElementById("characterSelectEvil");
    let goodCharData = await getData(`https://swapi.dev/api/people/${goodCharacter.value}`);
    let evilCharData = await getData(`https://swapi.dev/api/people/${evilCharacter.value}`);
    document.getElementById("listDiv").innerHTML = "";
    document.getElementById("compareListDiv").innerHTML = "";
    document.getElementById("extraFunctionDiv").innerHTML = "";
    let goodChar = createCharacter(goodCharData);
    let evilChar = createCharacter(evilCharData);
    console.log(goodChar);
    console.log(evilChar);
    createCharacterList(goodChar);
    createCharacterList(evilChar);
    createCompareCharacterList(goodChar, evilChar);
    createExtraFunction(goodChar, evilChar);
})

//Function to get data from URL.
async function getData(url) {
    let response = await fetch(url);
    let json = await response.json();
    return json;
}

//Function to create characters with our class "Character".
const createCharacter = (charData) => {
    let { name, gender, height, mass, hair_color: hairColor, skin_color: skinColor, eye_color: eyeColor, films: movies, homeworld, starships, vehicles, } = charData;
    
    let char = new Character(name, gender, height, mass, hairColor, skinColor, eyeColor, movies, homeworld, starships, vehicles)
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
        <li>Hair Color: ${char.hairColor}</li>
        <li>Skin Color: ${char.skinColor}</li>
        <li>Eye Color: ${char.eyeColor}</li>
        <li>Height: ${char.height}cm</li>
        <li>Weight: ${char.mass}kg</li>
        <li>Sex: ${char.gender}</li>
        <li>${char.name} has been in ${char.movies.length} movies.</li>
    `;
    listDiv.append(charDiv);
    charDiv.append(charName, charPic, characterlist);
}

//Function for comparing a number from each character and returning the name of the character with the highest number. If the numbers are the same it returns the string "Same".
const compareCharactersNumbers = (goodName, goodNum, evilName, evilNum) => {
    if ((goodNum === "unknown") || (evilNum === "unknown")){
        return "error";
    }
    else if (Number(goodNum) > Number(evilNum)){
        return goodName;
    }
    else if (Number(goodNum) < Number(evilNum)) {
        return evilName;
    }
    else {
        return "Same"
    }
}

//Function for comparing a string from each character and returning true if the strings are the same and false if they are not the same. 
const compareCharactersStrings = (goodString, evilString) => {
    if (goodString === evilString) {
        return true;
    }
    else {
        return false;
    }
}

//Function for comparing the two characters and creating a list with the comparisons.
const createCompareCharacterList = (goodChar, evilChar) => {
    let compareListDiv = document.getElementById("compareListDiv");
    let comparisonHeader = document.createElement("h2");
    comparisonHeader.innerText = "Comparison";
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
    else if (heaviestChar === "error") {
        heaviestString = `At least one character is of unknown weight.`;
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
    compareListDiv.append(comparisonHeader, comparelist);
}

// Function that adds a message box and buttons to interact with it.
const createExtraFunction = (goodChar, evilChar) => {
    let extraFunctionDiv = document.getElementById("extraFunctionDiv");
    let messageDiv = document.createElement("div");
    messageDiv.classList.add("message-div");

    let btnDiv = document.createElement("div");
    btnDiv.classList.add("btn-div");

    let compareBtnDiv = document.createElement("div");
    let sameMoviesBtn = document.createElement("button");
    sameMoviesBtn.innerText = `In which movies did both ${goodChar.name} and ${evilChar.name} appear?`
    sameMoviesBtn.addEventListener("click", async () => {
        tieSound();
        messageDiv.innerHTML = "";
        let message = document.createElement("p");
        message.innerText = `${await goodChar.showCommonMovies(evilChar)}`;
        messageDiv.append(message);
    });

    let homeworldBtn = document.createElement("button");
    homeworldBtn.innerText = `What is the homeworlds of ${goodChar.name} and ${evilChar.name}?`
    homeworldBtn.addEventListener("click", async () => {
        tieSound();
        messageDiv.innerHTML = "";
        let message = document.createElement("p");
        message.innerText = `${await goodChar.showCommonHomeworld(evilChar)}`;
        messageDiv.append(message);
    });

    compareBtnDiv.append(sameMoviesBtn,homeworldBtn);

    let goodCharBtnDiv = document.createElement("div");
    let goodCharfirstMovieBtn = document.createElement("button");
    goodCharfirstMovieBtn.innerText = `In what movie did ${goodChar.name} first appear?`
    goodCharfirstMovieBtn.addEventListener("click", async () => {
        tieSound();
        messageDiv.innerHTML = "";
        let message = document.createElement("p");
        message.innerText = `${await goodChar.showFirstApperanceData()}`;
        messageDiv.append(message);
    });

    let goodCharExpensiveVehicleBtn = document.createElement("button");
    goodCharExpensiveVehicleBtn.innerText = `What is ${goodChar.name}'s most expensive vehicle?`
    goodCharExpensiveVehicleBtn.addEventListener("click", async () => {
        tieSound();
        messageDiv.innerHTML = "";
        let message = document.createElement("p");
        message.innerText = `${await goodChar.showMostExpensiveVehicle()}`;
        messageDiv.append(message);
    });

    goodCharBtnDiv.append(goodCharfirstMovieBtn, goodCharExpensiveVehicleBtn);


    let evilCharBtnDiv = document.createElement("div");
    let evilCharfirstMovieBtn = document.createElement("button");
    evilCharfirstMovieBtn.innerText = `In what movie did ${evilChar.name} first appear?`
    evilCharfirstMovieBtn.addEventListener("click", async () => {
        tieSound();
        messageDiv.innerHTML = "";
        let message = document.createElement("p");
        message.innerText = `${await evilChar.showFirstApperanceData()}`;
        messageDiv.append(message);
    });

    let evilCharExpensiveVehicleBtn = document.createElement("button");
    evilCharExpensiveVehicleBtn.innerText = `What is ${evilChar.name}'s most expensive vehicle?`
    evilCharExpensiveVehicleBtn.addEventListener("click", async () => {
        tieSound();
        messageDiv.innerHTML = "";
        let message = document.createElement("p");
        message.innerText = `${await evilChar.showMostExpensiveVehicle()}`;
        messageDiv.append(message);
    });

    evilCharBtnDiv.append(evilCharfirstMovieBtn, evilCharExpensiveVehicleBtn);

    btnDiv.append(goodCharBtnDiv,compareBtnDiv,evilCharBtnDiv)
    extraFunctionDiv.append(messageDiv,btnDiv);
}

// Function for adding annoying music as soon as the user clicks anywhere on the site (yes I know it's bad UX design.)
window.addEventListener("click", () => {
    const cantina = document.getElementById("cantina");
     cantina.volume = 0.06;
     cantina.play();
 });