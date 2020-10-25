addLayer("s", {
        name: "stardust", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {
            unlocked: true,
            points: new Decimal(0),
            best: new Decimal(0),
        }},
        color: "#404060",
        requires: new Decimal(10), // Can be a function that takes requirement increases into account
        resource: "stardust", // Name of prestige currency
        baseResource: "points", // Name of resource prestige is based on
        baseAmount() {return player.points}, // Get the current amount of baseResource
        type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        exponent: 0.5, // Prestige currency exponent
        gainMult() { // Calculate the multiplier for main currency from bonuses
            mult = new Decimal(1)
            if(hasUpgrade(this.layer, 14)) mult = mult.times(3)
            if(hasUpgrade(this.layer, 22)) mult = mult.times(layers["s"].upgrades[22].effect())
            return mult
        },
        gainExp() { // Calculate the exponent on main currency from bonuses
            return new Decimal(1)
        },
        upgrades: {
            rows: 2,
            cols: 4,
            11: {
                title:() => "Start.",
                description:() => "Gain 1 Point every second.",
                cost:() => new Decimal(1),
                unlocked() { return true }, // The upgrade is only visible when this is true
                style() {
                    if (hasUpgrade(this.layer, this.id)) return {
                    'background-color': '#8080D0' 
                    }
                    else if (!canAffordUpgrade(this.layer, this.id)) {
                        return {
                            'background-color': '#808080' 
                        }
                    } // Otherwise use the default
                },
            },
            12: {
                title:() => "Amplify.",
                description:() => "Add 2 to the point generation base.",
                cost:() => new Decimal(2),
                unlocked() { return (hasUpgrade(this.layer, 11))},
                style() {
                    if (hasUpgrade(this.layer, this.id)) return {
                    'background-color': '#8080D0' 
                    }
                    else if (!canAffordUpgrade(this.layer, this.id)) {
                        return {
                            'background-color': '#808080' 
                        }
                    } // Otherwise use the default
                },
            },
            13: {
                title:() => "Expand space.",
                description:() => "Multiply point generation based on unspent stardust.",
                cost:() => new Decimal(2),
                unlocked() { return (hasUpgrade(this.layer, 12))},
                effect() {
                  return player[this.layer].points.add(9).pow(1/3)
                },
                style() {
                    if (hasUpgrade(this.layer, this.id)) return {
                    'background-color': '#8080D0' 
                    }
                    else if (!canAffordUpgrade(this.layer, this.id)) {
                        return {
                            'background-color': '#808080' 
                        }
                    } 
                },
            },
            14: {
                title:() => "Extend reach.",
                description:() => "Stardust gain is tripled.",
                cost:() => new Decimal(5),
                unlocked() { return (hasUpgrade(this.layer, 13)) },
                style() {
                    if (hasUpgrade(this.layer, this.id)) return {
                    'background-color': '#8080D0' 
                    }
                    else if (!canAffordUpgrade(this.layer, this.id)) {
                        return {
                            'background-color': '#808080' 
                        }
                    }
                },
            },
            21: {
                title:() => "Magnify.",
                description:() => "Double the point generation base.",
                cost:() => new Decimal(25),
                unlocked() { return (hasUpgrade(this.layer, 14)) },
                style() {
                    if (hasUpgrade(this.layer, this.id)) return {
                    'background-color': '#8080D0' 
                    }
                    else if (!canAffordUpgrade(this.layer, this.id)) {
                        return {
                            'background-color': '#808080' 
                        }
                    }
                },
            },
            22: {
                title:() => "Placeholder title.",
                description:() => "Points further increase stardust gain.",
                cost:() => new Decimal(50),
                unlocked() { return (hasUpgrade(this.layer, 21)) },
                effect() {
                    return player.points.add(1).log(10).add(1)
                },
                style() {
                    if (hasUpgrade(this.layer, this.id)) return {
                    'background-color': '#8080D0' 
                    }
                    else if (!canAffordUpgrade(this.layer, this.id)) {
                        return {
                            'background-color': '#808080' 
                        }
                    } // Otherwise use the default
                },
            },
            23: {
                title:() => "Draw in.",
                description:() => "Best stardust adds to the point generation base.",
                cost:() => new Decimal(100),
                unlocked() { return (hasUpgrade(this.layer, 22)) },
                effect() {
                    return player[this.layer].best.add(1).pow(1/2)
                },
                style() {
                    if (hasUpgrade(this.layer, this.id)) return {
                    'background-color': '#8080D0' 
                    }
                    else if (!canAffordUpgrade(this.layer, this.id)) {
                        return {
                            'background-color': '#808080' 
                        }
                    } // Otherwise use the default
                },
            },
            24: {
                title:() => "Placeholder title.",
                description:() => "its a secret? i think??",
                cost:() => new Decimal(1e12),
                unlocked() { return (hasUpgrade(this.layer, 23)) },
                style() {
                    if (hasUpgrade(this.layer, this.id)) return {
                    'background-color': '#8080D0' 
                    }
                    else if (!canAffordUpgrade(this.layer, this.id)) {
                        return {
                            'background-color': '#808080' 
                        }
                    } // Otherwise use the default
                },
            },
        },
        row: 0, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
            {key: "s", description: "S: Collect stardust", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        resetDescription: "Use your energy to collect ",
        layerShown(){return true},
        style() {return {
            'background-color': '#101018' 
         }},
})
addLayer("stats", {
    startData() { return {
        unlocked: true,
    }},
    symbol: "",
    tooltip() { // Optional, tooltip displays when the layer is locked
        return ("Statistics")
    },
    color: "FFFFFF",
    resource: "", 
    type: "none",
    row: "side",
    tabFormat: {
        Energy: {
            buttonStyle() {return  {'color': '#8080D0'}},
            content:
            ["main-display",
                ["display-text",
                    function() {return 'You have ' + format(player.points) + ' energy.'},
                    {"font-size": "20px",}],
                ["blank", "15px"],
                ["display-text",
                    function() {return 'You are getting ' + format(getPointGen()) + ' energy per second.'},
                    {"font-size": "16px",}],
                ["display-text",
                    function() {return 'Your energy generation base is ' + format(getPointBase()) + '.'},
                    {"font-size": "16px",}],
                
                ["display-text",
                    function() {return "+1.00 from Stardust upgrade 12."},
                    {"font-size": "12px",}],
                ["display-text",
                    function() {return "+" + format(layers["s"].upgrades[23].effect()) + ' from Stardust upgrade 23.'},
                    {"font-size": "12px",}],
                ["blank", "15px"],
                ["display-text",
                    function() {return 'Your energy generation multiplier is ' + format(getPointMult()) + '.'},
                    {"font-size": "16px",}],
                ["display-text",
                    function() {return "*" + format(layers["s"].upgrades[13].effect()) + ' from Stardust upgrade 13.'},
                    {"font-size": "12px",}],
                ["display-text",
                    function() {return "*2.00 from Stardust upgrade 21."},
                    {"font-size": "12px",}],
        ]
        },
        Stardust: {
            buttonStyle() {return  {'color': '#404060'}},
            content:
            ["main-display",
                ["display-text",
                    function() {return 'You have ' + format(player.s.points) + ' stardust.'},
                    {"font-size": "20px",}],
                ["blank", "5px"],
                ["display-text",
                    function() {return 'Your stardust generation multiplier is ' + format(layers.s.gainMult()) + '.'},
                    {"font-size": "16px",}],
        ]
        },
    },
    layerShown() {return true}, 
}, 
)