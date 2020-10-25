let modInfo = {
	name: "The Stardust Tree",
	id: "stardust",
	author: "okamii",
	pointsName: "energy",
	discordName: "",
	discordLink: "",
	changelogLink: "https://github.com/Acamaeda/The-Modding-Tree/blob/master/changelog.md",
    offlineLimit: 1,  // In hours
    initialStartPoints: new Decimal (10) // Used for hard resets and new players
}

// Set your version in num and name
let VERSION = {
	num: "0.0.1",
	name: "Renewal, or \"i am dying slowly\"",
}

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return hasUpgrade("s", 11)
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)
	let gain = new Decimal(1)
	gain = gain.add(getPointBase())
	gain = gain.times(getPointMult())
	return gain
}
function getPointBase(){
	let gain = new Decimal(0)
	if (hasUpgrade("s", 12)) gain = gain.add(2)
	if (hasUpgrade("s", 23)) gain = gain.add(layers["s"].upgrades[23].effect())
	return gain
}
function getPointMult(){
	let gain = new Decimal(1)
	if (hasUpgrade("s", 21)) gain = gain.times(2)
	if (hasUpgrade("s", 13)) gain = gain.times(layers["s"].upgrades[13].effect())
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600000) // Default is 1 hour which is just arbitrarily large
}