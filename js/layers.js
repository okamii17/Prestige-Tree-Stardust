addLayer("s", {
        name: "stardust", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {
            unlocked: true,
            points: new Decimal(0),
            best: new Decimal(0),
        }},
        color: color_s,
        requires: new Decimal(10), // Can be a function that takes requirement increases into account
        resource: "stardust", // Name of prestige currency
        baseResource: "points", // Name of resource prestige is based on
        baseAmount() {return player.points}, // Get the current amount of baseResource
        type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        exponent: 0.5, // Prestige currency exponent
        gainMult() { // Calculate the multiplier for main currency from bonuses
            mult = new Decimal(1)
            if(hasUpgrade(this.layer, 14)) mult = mult.times(3)
            if(hasUpgrade(this.layer, 22)) mult = mult.times(upgradeEffect("s",22))
            if(player.so.unlocked) mult = mult.times(layers["so"].effect())
            if(hasUpgrade("so",13)) mult = mult.times(upgradeEffect("so",13))
            if(player.n.buyables[13].gt(0)) mult = mult.times(buyableEffect("n",13)["second"])
            return mult
        },
        gainExp() { // Calculate the exponent on main currency from bonuses
            return new Decimal(1)
        },
        upgrades: {
            rows: 3,
            cols: 4,
            11: {
                title:() => "Start.",
                description:() => "Gain 1 Energy every second.",
                cost:() => new Decimal(1),
                unlocked() { return true }, // The upgrade is only visible when this is true
                style() {
                    if (hasUpgrade(this.layer, this.id)) return {
                    'border-color': color_e 
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
                description:() => "Add 2 to the energy generation base.",
                cost:() => new Decimal(2),
                unlocked() { return (hasUpgrade(this.layer, 11) || hasUpgrade(this.layer,11) && (player.so.unlocked || player.n.unlocked))},
                style() {
                    if (hasUpgrade(this.layer, this.id)) return {
                    'border-color': color_e 
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
                description:() => "Multiply energy generation based on unspent stardust.",
                cost:() => new Decimal(2),
                unlocked() { return (hasUpgrade(this.layer, 12) || hasUpgrade(this.layer,11) && (player.so.unlocked || player.n.unlocked))},
                effect() {
                  return player[this.layer].points.add(9).pow(1/3)
                },
                style() {
                    if (hasUpgrade(this.layer, this.id)) return {
                    'border-color': color_e 
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
                unlocked() { return (hasUpgrade(this.layer, 13) || hasUpgrade(this.layer,11) && (player.so.unlocked || player.n.unlocked)) },
                style() {
                    if (hasUpgrade(this.layer, this.id)) return {
                    'border-color': color_s 
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
                description:() => "Double energy gain.",
                cost:() => new Decimal(25),
                unlocked() { return (hasUpgrade(this.layer, 14) || hasUpgrade(this.layer,11) && (player.so.unlocked || player.n.unlocked)) },
                style() {
                    if (hasUpgrade(this.layer, this.id)) return {
                    'border-color': color_e 
                    }
                    else if (!canAffordUpgrade(this.layer, this.id)) {
                        return {
                            'background-color': '#808080' 
                        }
                    }
                },
            },
            22: {
                title:() => "Energize.",
                description:() => "Energy further increases stardust gain.",
                cost:() => new Decimal(50),
                unlocked() { return (hasUpgrade(this.layer, 21) || hasUpgrade(this.layer,11) && (player.so.unlocked || player.n.unlocked)) },
                effect() {
                    return player.points.add(1).log(10).add(1)
                },
                style() {
                    if (hasUpgrade(this.layer, this.id)) return {
                    'border-color': color_s 
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
                unlocked() { return (hasUpgrade(this.layer, 22) || hasUpgrade(this.layer,11) && (player.so.unlocked || player.n.unlocked)) },
                effect() {
                     if(!player["s"].best) {
                         return new Decimal(1)
                     }
                     return player["s"].best.add(1).pow(1/5)
                },
                style() {
                    if (hasUpgrade(this.layer, this.id)) return {
                    'border-color': color_e 
                    }
                    else if (!canAffordUpgrade(this.layer, this.id)) {
                        return {
                            'background-color': '#808080' 
                        }
                    } // Otherwise use the default
                },
            },
            24: {
                title:() => "Aggrandize.",
                description:() => "Unlock more upgrades in the Sol and Nebulae layers.",
                cost:() => new Decimal(1e16),
                unlocked() { return (hasUpgrade(this.layer, 23) || hasUpgrade(this.layer,11) && (player.so.unlocked || player.n.unlocked)) },
                style() {
                    if (hasUpgrade(this.layer, this.id)) return {
                    'border-color': '#F08080' 
                    }
                    else if (!canAffordUpgrade(this.layer, this.id)) {
                        return {
                            'background-color': '#808080' 
                        }
                    } // Otherwise use the default
                },
                onPurchase() { // This function triggers when the upgrade is purchased
                    player["n"].s24 = true
                    player["so"].s24 = true
                },
            },
            31: {
                title:() => "Stellar Key.",
                description:() => "",
                cost:() => new Decimal(1e20),
                currencyDisplayName: "stars",
                currencyInternalName: "points",
                currencyLayer: "s",
                unlocked() { return ( hasUpgrade("so",23) && !player.c.unlocked) },
                  style() {
                    if (hasUpgrade(this.layer, this.id)) return {
                    'border-color': "black" 
                    }
                    else {
                        return {
                            'background-color': color_so 
                        }
                    } // Otherwise use the default
                },
            },
            32: {
                title:() => "Galvanize.",
                description:() => "DON'T HOLD BACK.",
                cost:() => new Decimal(1e45),
                unlocked() { return hasUpgrade("s",31) && hasUpgrade("s",33) && !player.c.unlocked  },
                style() {
                    if (hasUpgrade(this.layer, this.id)) return {
                    'border-color': '#F08080' 
                    }
                    else {
                        return {
                            'background-color': "white"
                        }
                    } // Otherwise use the default
                },
            },
            33: {
                title:() => "Nebulaic Key.",
                description:() => "",
                cost:() => new Decimal(1e20),
                unlocked() { return ( hasUpgrade("n",23) && !player.c.unlocked) },
                currencyDisplayName: "nebulae",
                currencyInternalName: "points",
                currencyLayer: "n",
                  style() {
                    if (hasUpgrade(this.layer, this.id)) return {
                    'border-color': "black" 
                    }
                    else {
                        return {
                            'background-color': color_n 
                        }
                    } // Otherwise use the default
                },
            },
        },
        row: 0, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
            {key: "s", description: "s: Collect stardust", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        doReset(resettingLayer){ // Triggers when this layer is being reset, along with the layer doing the resetting. Not triggered by lower layers resetting, but is by layers on the same row.
            if(layers[resettingLayer].row > this.row) {
            layerDataReset(this.layer)
            if(hasUpgrade("so",14)) player.s.upgrades.push("11", "12", "13", "14", "21", "22", "23")
            if(player["so"].s24 || player["so"].s24) player.s.upgrades.push("24")
            }
        },
        resetDescription: "Use your energy to collect ",
        layerShown(){return true},
        style() {return {
            'background-color': '#101018' 
         }},
})
addLayer("so", {
    name: "stars", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "SO", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        total: new Decimal(0),
        s24: false,
    }},
    effect() {
        eff = player[this.layer].points.add(1).sqrt()
        if(hasUpgrade("so",12)) eff = eff.times(upgradeEffect("so",12))
        if (player.so.buyables[12].gt(0)) eff = eff.times(buyableEffect("so",12)["first"])
        return eff
        },
    effectDescription() {
        eff = this.effect();
        return "which are boosting stardust gain by "+format(eff)+"."
    },
    color:() => color_so,
    requires() {return new Decimal(200)}, 
    resource: "stars", 
    baseResource: "points", 
    baseAmount() {return player.points},
    type: "normal",
    exponent: 0.5,
    gainMult() {
        gain = new Decimal(1)
        if (player.n.buyables[13].gte(1)) gain = gain.div(buyableEffect("n",13)["first"])
        if(!gain.gt(0)) gain = new Decimal(1)
        if(hasUpgrade("n",12)) gain = gain.times(2)
        if(hasUpgrade("so",21)) gain = gain.times(upgradeEffect("so",21))
        if(player.c.buyables[11].eq(1)) gain = gain.times(buyableEffect("c",11))
        return gain
    },
    gainExp() {
        return new Decimal(1)
    },
  buyables: {
            rows: 1,
            cols: 2,
            showRespec: false,
            11: {
                title:() => "Constellation 1", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2, x.pow(1.4))
                    if(player.c.buyables[21].eq(1)) cost = Decimal.pow(2, x.pow(1.2))
                    if(hasUpgrade("so",23)) cost = cost.div(upgradeEffect("so",23))
                    return cost.floor()
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
                    let eff = {}
                    if (x.gte(0)) {
                        eff.first = Decimal.pow(3, x.pow(0.9))
                        if(player.n.buyables[14].gte(1)) eff.first = eff.first.times(layers["n"].buyables[14].effect()["first"])
                    }
                    return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Cost: " + format(data.cost) + " stars\n\
                    Amount: " + player[this.layer].buyables[this.id] + "\n\
                    Adds + " + format(data.effect.first) + " to the energy generation base"
                },
                unlocked() { return player[this.layer].unlocked }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player[this.layer].points = player[this.layer].points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
                },
            },
            12: {
                title:() => "Constellation 2", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2, x.pow(1.4)).times(1e6)
                    if(player.c.buyables[21].eq(1)) cost = Decimal.pow(2, x.pow(1.2)).times(1e6)
                    if(hasUpgrade("so",23)) cost = cost.div(upgradeEffect("so",23))
                    return cost.floor()
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
                    let eff = {}
                    if (x.gte(0)) {
                        eff.first = Decimal.pow(2, x.pow(0.8))
                        if(player.n.buyables[14].gte(1)) eff.first = eff.first.times(layers["n"].buyables[14].effect()["first"])
                    }
                    return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Cost: " + format(data.cost) + " stars\n\
                    Amount: " + player[this.layer].buyables[this.id] + "\n\
                    Multiplying the star effect by " + format(data.effect.first) + "x"
                },
                unlocked() { return hasUpgrade("so",22) }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player[this.layer].points = player[this.layer].points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
                },
            },
        },
        upgrades: {
            rows: 2,
            cols: 4,
            11: {
                title:() => "Radiate.",
                description:() => "Stars also buff energy gain at a reduced rate.",
                cost:() => new Decimal(5),
                unlocked() { return player[this.layer].unlocked }, 
                effect() {
                    eff = player[this.layer].points.add(1).pow(1/4).add(1)
                    return eff
                  },
                  style() {
                    if (hasUpgrade(this.layer, this.id)) return {
                    'border-color': color_e 
                    }
                    else if (!canAffordUpgrade(this.layer, this.id)) {
                        return {
                            'background-color': '#808080' 
                        }
                    } // Otherwise use the default
                },
            },
            12: {
                title:() => "Glow.",
                description:() => "Total stars multiplies star effect.",
                cost:() => new Decimal(20),
                unlocked() { return (hasUpgrade(this.layer, 11))},
                effect() {
                    eff = player[this.layer].total.add(1).log(4).add(1)
                    return eff
                  },
                  style() {
                    if (hasUpgrade(this.layer, this.id)) return {
                    'border-color': color_so 
                    }
                    else if (!canAffordUpgrade(this.layer, this.id)) {
                        return {
                            'background-color': '#808080' 
                        }
                    } // Otherwise use the default
                },
            },
            13: {
                title:() => "Accrete.",
                description:() => "Further increase stardust generation based on unspent stars.",
                cost:() => new Decimal(100),
                unlocked() { return (hasUpgrade(this.layer, 11))},
                effect() {
                  return player[this.layer].points.add(1).pow(1/3)
                },
                style() {
                    if (hasUpgrade(this.layer, this.id)) return {
                    'border-color': color_s
                    }
                    else if (!canAffordUpgrade(this.layer, this.id)) {
                        return {
                            'background-color': '#808080' 
                        }
                    } // Otherwise use the default
                },
            },
            14: {
                title:() => "Simplify.",
                description:() => "Keep the first seven stardust upgrades on a row 2 reset.",
                cost:() => new Decimal(1000000),
                unlocked() { return (hasUpgrade(this.layer, 11) || player.c.unlocked)},
                style() {
                    if (hasUpgrade(this.layer, this.id)) return {
                    'border-color': color_s 
                    }
                    else if (!canAffordUpgrade(this.layer, this.id)) {
                        return {
                            'background-color': '#808080' 
                        }
                    } // Otherwise use the default
                },
            },
            21: {
                title:() => "Placeholder title.",
                description:() => "Stardust boosts star gain.",
                cost:() => new Decimal(1e7),
                unlocked() { return ( player.so.s24) },
                effect() {
                    eff = player.s.points.add(100).log(7).div(2).add(1)
                    return eff
                  },
                  style() {
                    if (hasUpgrade(this.layer, this.id)) return {
                    'border-color': color_so 
                    }
                    else if (!canAffordUpgrade(this.layer, this.id)) {
                        return {
                            'background-color': '#808080' 
                        }
                    } // Otherwise use the default
                },
            },
            22: {
                title:() => "Discover.",
                description:() => "Unlock another constellation.",
                cost:() => new Decimal(5e8),
                unlocked() { return ( player.so.s24) },
                  style() {
                    if (hasUpgrade(this.layer, this.id)) return {
                    'border-color': color_so 
                    }
                    else if (!canAffordUpgrade(this.layer, this.id)) {
                        return {
                            'background-color': '#808080' 
                        }
                    } // Otherwise use the default
                },
            },
            23: {
                title:() => "Innervate.",
                description:() => "Energy divides constellation costs.",
                cost:() => new Decimal(1e12),
                unlocked() { return ( player.so.s24) },
                effect() {
                    eff = player.points.pow(0.25).add(1)
                    return eff
                  },
                  style() {
                    if (hasUpgrade(this.layer, this.id)) return {
                    'border-color': color_so 
                    }
                    else if (!canAffordUpgrade(this.layer, this.id)) {
                        return {
                            'background-color': '#808080' 
                        }
                    } // Otherwise use the default
                },
            },
            
        },
        hotkeys: [
            {key: "S", 
            description: "Shift-s: reset your stardust for stars",
            onPress(){if (player.so.unlocked) doReset("so")}},
        ],
    row: 1,
    layerShown() {return true},  // Each pair corresponds to a line added to the tree when this node is unlocked. The letter is the other end of the line, and the number affects the color, 1 is default
    branches: [["s", 5]],
    resetDescription: "Use your stardust to form ",
    style() {return {
        'background-color': '#181810' 
     }},
}, )
addLayer("n", {
    name: "nebulae", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "N", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        s24: false,
    }},
    effect() {
        eff = player[this.layer].points.add(1).sqrt()
        if(hasUpgrade("n",22)) eff = eff.times(upgradeEffect("n",22))
        return eff
        },
    effectDescription() {
        eff = this.effect();
        return "which are boosting energy gain by "+format(eff)+"."
    },
    color:() => color_n,
    requires() {return new Decimal(100)}, 
    resource: "nebulae", 
    baseResource: "stardust", 
    baseAmount() {return player.s.points},
    type: "normal",
    exponent: 0.5, 
    gainMult() {
        gain = new Decimal(1)
        if(player.n.buyables[12].gte(1)) gain = gain.div(buyableEffect("n",12)["first"])
        if(!gain.gt(0)) gain = new Decimal(1)
        if(hasUpgrade("n",12)) gain = gain.times(2)
        if(player.c.buyables[13].eq(1)) gain = gain.times(buyableEffect("c",13))
        return gain
    },
    gainExp() {
        return new Decimal(1)
    },
    buyables: {
            rows: 1,
            cols: 4,
            respec() { // Optional, reset things and give back your currency. Having this function makes a respec button appear
                player[this.layer].points = player[this.layer].points.add(player[this.layer].spentOnBuyables) // A built-in thing to keep track of this but only keeps a single value
                resetBuyables(this.layer)
                doReset(this.layer, true) // Force a reset
            },
            respecText:() => "Sell all Nebulae", // Text on Respec button, optional
            11: {
                title:() => "Emission Nebulae", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2, x.pow(1.4))
                    if(hasUpgrade("n",21)) cost = cost.div(upgradeEffect("n",21))
                    return cost.floor()
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
                    let eff = {}
                    eff.first = new Decimal(1)
                    if (x.gte(0)) eff.first = Decimal.pow(2, x.pow(0.6))
                    if(!eff.first) eff.first = new Decimal(1)
                    if(hasUpgrade("n",23)) eff.first = eff.first.times(upgradeEffect("n",23))
                    return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Cost: " + format(data.cost) + " nebulae\n\
                    Amount: " + player[this.layer].buyables[this.id] + "\n\
                    Further multiply energy gain by " + format(data.effect.first) + "x"
                },
                unlocked() { return player[this.layer].unlocked }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player[this.layer].points = player[this.layer].points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
                },
                sellOne() {
                    let amount = getBuyableAmount(this.layer, this.id)
                    if (amount.lte(0)) return // Only sell one if there is at least one
                    setBuyableAmount(this.layer, this.id, amount.sub(1))
                    player[this.layer].points = player[this.layer].points.add(this.cost())
                    doReset(this.layer, true)
                },
            },
      12: {
                title:() => "Reflection Nebulae", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2, x.pow(2))
                    if(hasUpgrade("n",21)) cost = cost.div(upgradeEffect("n",21))
                    return cost.floor()
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
                    let eff = {}
                    eff.first = new Decimal(1)
                    if (x.gte(0)) {
                        eff.first = Decimal.pow(2, x.pow(2))
                        if(hasUpgrade("n",13) && eff.first.gt(1)) eff.first = eff.first.div(layers["n"].upgrades[13].effect())
                        eff.first = eff.first.max(1)
                        if(!eff.first) eff.first = new Decimal(1)
                    }
                    if (x.gte(0)) {
                        eff.second = Decimal.pow(3, x.pow(0.5))
                        if(hasUpgrade("n",23)) eff.second = eff.second.times(upgradeEffect("n",23))
                    }
                    return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Cost: " + format(data.cost) + " nebulae\n\
                    Amount: " + player[this.layer].buyables[this.id] + "\n\
                    Divides nebula gain by " + format(data.effect.first) + "x and multiplies energy gain by " + format(data.effect.second) + "x"
                },
                unlocked() { return player[this.layer].unlocked }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player[this.layer].points = player[this.layer].points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
                },
                sellOne() {
                    let amount = getBuyableAmount(this.layer, this.id)
                    if (amount.lte(0)) return // Only sell one if there is at least one
                    setBuyableAmount(this.layer, this.id, amount.sub(1))
                    player[this.layer].points = player[this.layer].points.add(this.cost())
                    doReset(this.layer, true)
                },
            },
      13: {
                title:() => "Dark Nebulae", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2, x.pow(1.8))
                    if(hasUpgrade("n",21)) cost = cost.div(upgradeEffect("n",21))
                    return cost.floor()
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
                    let eff = {}
                    if (x.gte(0)) {
                        eff.first = new Decimal(1)
                        eff.first = Decimal.pow(2, x.pow(2))
                        if(hasUpgrade("n",13) && eff.first.gt(1)) eff.first = eff.first.div(layers["n"].upgrades[13].effect())
                        eff.first = eff.first.max(1)
                        if(!eff.first) eff.first = new Decimal(1)
                    }
                    eff.second = Decimal.pow(3, x.pow(0.5))
                    if(hasUpgrade("n",23)) eff.second = eff.second.times(upgradeEffect("n",23))
                    return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Cost: " + format(data.cost) + " nebulae\n\
                    Amount: " + player[this.layer].buyables[this.id] + "\n\
                    Divides star gain by " + format(data.effect.first) + "x and multiplies stardust gain by " + format(data.effect.second) + "x"
                },
                unlocked() { return player[this.layer].unlocked }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player[this.layer].points = player[this.layer].points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
                },
                sellOne() {
                    let amount = getBuyableAmount(this.layer, this.id)
                    if (amount.lte(0)) return // Only sell one if there is at least one
                    setBuyableAmount(this.layer, this.id, amount.sub(1))
                    player[this.layer].points = player[this.layer].points.add(this.cost())
                    doReset(this.layer, true)
                },
            },
      14: {
                title:() => "Planetary Nebulae", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2, x.pow(1.7))
                    if(hasUpgrade("n",21)) cost = cost.div(upgradeEffect("n",21))
                    return cost.floor()
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
                    let eff = {}
                    eff.first = new Decimal(1)
                    if (x.gte(0)) eff.first = Decimal.pow(1.3, x)
                    if(hasUpgrade("n",23)) eff.first = eff.first.times(upgradeEffect("n",23))
                    return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Cost: " + format(data.cost) + " nebulae\n\
                    Amount: " + player[this.layer].buyables[this.id] + "\n\
                    Multiplies contellation effects by " + format(data.effect.first) + "x"
                },
                unlocked() { return player[this.layer].unlocked }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player[this.layer].points = player[this.layer].points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
                },
                sellOne() {
                    let amount = getBuyableAmount(this.layer, this.id)
                    if (amount.lte(0)) return // Only sell one if there is at least one
                    setBuyableAmount(this.layer, this.id, amount.sub(1))
                    player[this.layer].points = player[this.layer].points.add(this.cost())
                    doReset(this.layer, true)
                },
            },
        },
        upgrades: {
            rows: 2,
            cols: 4,
            11: {
                title:() => "Empower.",
                description:() => "Unspent nebulae buff stardust at a reduced rate.",
                cost:() => new Decimal(5),
                unlocked() { return player[this.layer].unlocked }, 
                effect() {
                    eff = player[this.layer].points.add(8).pow(1/3)
                    return eff
                  },
                  style() {
                    if (hasUpgrade(this.layer, this.id)) return {
                    'border-color': color_s 
                    }
                    else if (!canAffordUpgrade(this.layer, this.id)) {
                        return {
                            'background-color': '#808080' 
                        }
                    } // Otherwise use the default
                },
            },
            12: {
                title:() => "Duplicate.",
                description:() => "Double nebulae and star gain.",
                cost:() => new Decimal(10),
                unlocked() { return (hasUpgrade(this.layer, 11))},
                style() {
                    if (hasUpgrade(this.layer, this.id)) return {
                    'border-color': color_n 
                    }
                    else if (!canAffordUpgrade(this.layer, this.id)) {
                        return {
                            'background-color': '#808080' 
                        }
                    } // Otherwise use the default
                },
            },
            
            13: {
                title:() => "Abate.",
                description:() => "Nebulae nerfs are reduced by unspent nebulae, hardcapped at /1.",
                cost:() => new Decimal(400),
                unlocked() { return (hasUpgrade(this.layer, 12))},
                effect() {
                  return player[this.layer].points.add(5).log(700).add(1)
                },
                style() {
                    if (hasUpgrade(this.layer, this.id)) return {
                    'border-color': color_n
                    }
                    else if (!canAffordUpgrade(this.layer, this.id)) {
                        return {
                            'background-color': '#808080' 
                        }
                    } // Otherwise use the default
                },
            },
            14: {
                title:() => "Spawn.",
                description:() => "Gain 10% of stardust gain per second.",
                cost:() => new Decimal(1000000),
                unlocked() { return (hasUpgrade(this.layer, 13) || player.c.unlocked)},
                style() {
                    if (hasUpgrade(this.layer, this.id)) return {
                    'border-color': color_s 
                    }
                    else if (!canAffordUpgrade(this.layer, this.id)) {
                        return {
                            'background-color': '#808080' 
                        }
                    } // Otherwise use the default
                },
            },
            21: {
                title:() => "Diminish.",
                description:() => "Total nebulae divides the cost of nebulae buyables.",
                cost:() => new Decimal(1.5e7),
                unlocked() { return player[this.layer].s24 }, 
                effect() {
                    eff = player[this.layer].total.add(8).pow(1/4)
                    return eff
                  },
                  style() {
                    if (hasUpgrade(this.layer, this.id)) return {
                    'border-color': color_n
                    }
                    else if (!canAffordUpgrade(this.layer, this.id)) {
                        return {
                            'background-color': '#808080' 
                        }
                    } // Otherwise use the default
                },
            },
            22: {
                title:() => "Invigorate.",
                description:() => "Amount of bought nebulae buyables multiplies the nebula effect.",
                cost:() => new Decimal(2.5e9),
                unlocked() { return player[this.layer].s24},
                effect() {
                    eff = player.n.buyables[11].add(player.n.buyables[12]).add(player.n.buyables[13]).add(player.n.buyables[14])
                    eff = eff.pow(0.75).add(1)
                    return eff
                },
                style() {
                    if (hasUpgrade(this.layer, this.id)) return {
                    'border-color': '#6040C0' 
                    }
                    else if (!canAffordUpgrade(this.layer, this.id)) {
                        return {
                            'background-color': '#808080' 
                        }
                    } // Otherwise use the default
                },
            },
            23: {
                title:() => "Augment.",
                description:() => "Total nebulae buffs nebulae buyable positive effects.",
                cost:() => new Decimal(1e12),
                unlocked() { return player[this.layer].s24},
                effect() {
                    eff = player.n.total.log(1e3).add(1)
                    return eff
                },
                style() {
                    if (hasUpgrade(this.layer, this.id)) return {
                    'border-color': '#6040C0' 
                    }
                    else if (!canAffordUpgrade(this.layer, this.id)) {
                        return {
                            'background-color': '#808080' 
                        }
                    } // Otherwise use the default
                },
            },
        },
        update(diff) {
            if (hasUpgrade("n",14)) generatePoints("s", diff / 10)
          },
        hotkeys: [
            {key: "n", 
            description: "n: reset your stardust for nebulas",
            onPress(){if (player.n.unlocked) doReset("n")}},
        ],
    row: 1,
    layerShown() {return true},  // Each pair corresponds to a line added to the tree when this node is unlocked. The letter is the other end of the line, and the number affects the color, 1 is default
    branches: [["s", 6]],
    style() {return {
        'background-color': '#181028' 
     }},
     resetDescription: "Coalesce your stardust into ",
},)
addLayer("c", {
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
    }},
    midsection: [
        ["display-text", function() {return "Your crystals are giving you "+format(layers["c"].getShards(),0)+" shards."}],
        ["display-text", function() {return "You have "+format(layers["c"].getShards().minus(player.c.spentOnBuyables),0)+" left."}],
    ],
    getShards() {
        let shards = player.c.points.pow(1.25).floor().times(5)
        return shards
    },
    color:() => color_c,
    requires() {return new Decimal("1e45")}, 
    resource: "crystals", 
    baseResource: "stardust", 
    baseAmount() {return player.s.points},
    type: "static", 
    base: 10,
    exponent: 3,
    gainMult() {
        return new Decimal(1)
    },
    gainExp() {
        return new Decimal(1)
    },
    buyables: {
        rows: 9,
        cols: 9,
        showRespec: true,
        respec() { // Optional, reset things and give back your currency. Having this function makes a respec button appear
            resetBuyables(this.layer)
            doReset(this.layer, true) // Force a reset
        },
        respecText: "Respec Upgrades", // Text on Respec button, optional
        11: {
            title: "Stars I", // Optional, displayed at the top in a larger font
            cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                if (x.eq(0)) cost = 1
                else cost = Infinity
                return cost
            },
            effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
                eff = Decimal.pow(5, x)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                first = "Multiplies star gain by 5."
                player[this.layer].buyables[this.id].eq(0) ? last = "\n 1 shard" : last = "\n ✓"
                return first + last
            },
            unlocked() { return player[this.layer].unlocked }, 
            canAfford() {
                return layers["c"].getShards().sub(player[this.layer].spentOnBuyables).gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
            },
            style() {
                if(player[this.layer].buyables[this.id].eq(1)) return {
                    'background-color': color_upg,
                    'border-color': color_so,
                    'height': '100px',
                    'width': '100px'
                    }
                    return {
                    'border-color': color_so,
                    'height': '100px',
                    'width': '100px'
                    }
            },
        },
        21: {
            title: "Stellate", // Optional, displayed at the top in a larger font
            cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                if (x.eq(0)) cost = 15
                else cost = Infinity
                return cost
            },
            effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
                eff = Decimal.pow(0.2, x)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                first = "Constellation cost scaling is reduced."
                player[this.layer].buyables[this.id].eq(0) ? last = "\n 15 shards" : last = "\n ✓"
                return first + last
            },
            unlocked() { return player[this.layer].unlocked }, 
            canAfford() {
                return layers["c"].getShards().sub(player[this.layer].spentOnBuyables).gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
            },
            style() {
                if(player[this.layer].buyables[this.id].eq(1)) return {
                    'background-color': color_upg,
                    'border-color': color_so,
                    'height': '125px',
                    'width': '125px'
                    }
                    return {
                    'border-color': color_so,
                    'height': '125px',
                    'width': '125px'
                    }
            },
        },
        31: {
            title: "Form", // Optional, displayed at the top in a larger font
            cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                if (x.eq(0)) cost = 10
                else cost = Infinity
                return cost
            },
            effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
                eff = Decimal.pow(1, x)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                first = "Constellations are bought automatically."
                player[this.layer].buyables[this.id].eq(0) ? last = "\n 10 shards" : last = "\n ✓"
                return first + last
            },
            unlocked() { return player[this.layer].unlocked }, 
            canAfford() {
                return layers["c"].getShards().sub(player[this.layer].spentOnBuyables).gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
            },
            style() {
                if(player[this.layer].buyables[this.id].eq(1)) return {
                    'background-color': color_upg,
                    'border-color': color_so,
                    'height': '100px',
                    'width': '100px'
                    }
                    return {
                    'border-color': color_so,
                    'height': '100px',
                    'width': '100px'
                    }
            },
        },
        12: {
            title: "Energy I", // Optional, displayed at the top in a larger font
            cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                if (x.eq(0)) cost = 1
                else cost = Infinity
                return cost
            },
            effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
                eff = Decimal.pow(100, x)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                first = "Multiplies energy gain by 100."
                player[this.layer].buyables[this.id].eq(0) ? last = "\n 1 shard" : last = "\n ✓"
                return first + last
            },
            unlocked() { return player[this.layer].unlocked }, 
            canAfford() {
                return layers["c"].getShards().sub(player[this.layer].spentOnBuyables).gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
            },
            style() {
                if(player[this.layer].buyables[this.id].eq(1)) return {
                'background-color': color_upg,
                'border-color': color_e,
                'height': '100px',
                'width': '100px'
                }
                return {
                'border-color': color_e,
                'height': '100px',
                'width': '100px'
                }
            },
        },
        22: {
            title: "Headstart I", // Optional, displayed at the top in a larger font
            cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                if (x.eq(0)) cost = 2
                else cost = Infinity
                return cost
            },
            effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
                eff = Decimal.pow(5, x)
                if(!hasUpgrade("so",14) && x.eq(1)) player.so.upgrades.push("14")
                if(!hasUpgrade("n",14) && x.eq(1)) player.n.upgrades.push("14")
                if(!hasUpgrade("s",23) && x.eq(1)) player.s.upgrades.push("11","12","13","14","21","22","23")
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                first = "Keep the fourth upgrade in both sols and nebulae layers, energy gain is x5 while under 1e16 energy."
                player[this.layer].buyables[this.id].eq(0) ? last = "\n 2 shards" : last = "\n ✓"
                return first + last
            },
            unlocked() { return player[this.layer].unlocked }, 
            canAfford() {
                return layers["c"].getShards().sub(player[this.layer].spentOnBuyables).gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
            },
            style() {
                if(player[this.layer].buyables[this.id].eq(1)) return {
                    'background-color': color_upg,
                    'border-color': color_e,
                    'height': '125px',
                    'width': '125px'
                    }
                    return {
                    'border-color': color_e,
                    'height': '125px',
                    'width': '125px'
                    }
            },
        },
        32: {
            title: "Spawn II", // Optional, displayed at the top in a larger font
            cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                if (x.eq(0)) cost = 5
                else cost = Infinity
                return cost
            },
            effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
                eff = Decimal.pow(1, x)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                first = "Gain 10% of sol and nebula gain per second."
                player[this.layer].buyables[this.id].eq(0) ? last = "\n 5 shards" : last = "\n ✓"
                return first + last
            },
            unlocked() { return player[this.layer].unlocked }, 
            canAfford() {
                return layers["c"].getShards().sub(player[this.layer].spentOnBuyables).gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
            },
            style() {
                if(player[this.layer].buyables[this.id].eq(1)) return {
                    'background-color': color_upg,
                    'border-color': color_so,
                    'height': '100px',
                    'width': '100px'
                    }
                    return {
                    'border-color': color_so,
                    'height': '100px',
                    'width': '100px'
                    }
            },
        },
        13: {
            title: "Nebulae I", // Optional, displayed at the top in a larger font
            cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                if (x.eq(0)) cost = 1
                else cost = Infinity
                return cost
            },
            effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
                eff = Decimal.pow(5, x)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                first = "Multiplies nebulae gain by 5."
                player[this.layer].buyables[this.id].eq(0) ? last = "\n 1 shard" : last = "\n ✓"
                return first + last
            },
            unlocked() { return player[this.layer].unlocked }, 
            canAfford() {
                return layers["c"].getShards().sub(player[this.layer].spentOnBuyables).gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
            },
            style() {
                if(player[this.layer].buyables[this.id].eq(1)) return {
                    'background-color': color_upg,
                    'border-color': color_n,
                    'height': '100px',
                    'width': '100px'
                    }
                    return {
                    'border-color': color_n,
                    'height': '100px',
                    'width': '100px'
                    }
            },
        },
    },
    update(diff) {
        if (player.c.buyables[32].eq(1)) {
            generatePoints("so", diff / 10)
            generatePoints("n", diff / 10)
        }
        if (player.c.buyables[31].eq(1)) {
            if(layers["so"].buyables[11].canAfford()) layers["so"].buyables[11].buy()
            if(layers["so"].buyables[12].canAfford()) layers["so"].buyables[12].buy()
        }
      },
    row: 2,
    position: 1,
    layerShown() {return hasUpgrade("s",32) || player.c.unlocked},
    branches: [["s", 4]],
    canBuyMax() {
        return false
    },
    hotkeys: [
        {key: "c", description: "c: compress stardust into crystals", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    style() {return {
        'background-color': '#101018' 
     }},
     resetDescription: "Compress your stardust into ",
}, 
)
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
            buttonStyle() {return  {'color': color_e}},
            content:
            ["main-display",
                ["display-text",
                    function() {return 'You have ' + format(player.points) + ' energy.'},
                    {"color": color_e, "font-size": "20px",}],
                ["display-text",
                    function() {return 'You are getting ' + format(getPointGen()) + ' energy per second.'},
                    {"color": color_e, "font-size": "16px",}],
                ["blank", "15px"],
                ["display-text",
                    function() {return 'Your energy generation base is ' + format(getPointBase()) + '.'},
                    {"color": color_e, "font-size": "16px",}],
                ["display-text",
                    function() {return hasUpgrade("s",11) ? "1.00 from Stardust upgrade 11." : ""},
                    {"color": color_s, "font-size": "12px",}],
                ["display-text",
                    function() {return hasUpgrade("s",12) ? "+2.00 from Stardust upgrade 12." : ""},
                    {"color": color_s, "font-size": "12px",}],
                ["display-text",
                    function() {return hasUpgrade("s",23) ? "+" + format(upgradeEffect("s",23)) + ' from Stardust upgrade 23.' : ""},
                    {"color": color_s, "font-size": "12px",}],
                ["display-text",
                    function() {return player.so.unlocked ? "+" + format(buyableEffect("so",11)["first"]) + ' from Constellation 1.' : ""},
                    {"color": color_so, "font-size": "12px",}],
                ["blank", "15px"],
                ["display-text",
                    function() {return 'Your energy generation multiplier is ' + format(getPointMult()) + '.'},
                    {"color": color_e, "font-size": "16px",}],
                ["display-text",
                    function() {return hasUpgrade("s",13) ? "*" + format(upgradeEffect("s",13)) + ' from Stardust upgrade 13.' : ""},
                    {"color": color_s, "font-size": "12px",}],
                ["display-text",
                    function() {return hasUpgrade("s",21) ? "*2.00 from Stardust upgrade 21." : ""},
                    {"color": color_s, "font-size": "12px",}],
                ["display-text",
                    function() {return player.n.unlocked ? "*" + format(layers["n"].effect()) + " from the Nebulae effect." : ""},
                    {"color": color_n, "font-size": "12px",}],
                ["display-text",
                    function() {return player.n.buyables[11].gt(0) ? "*" + format(buyableEffect("n",11)["first"]) + " from your Emission Nebulae." : ""},
                    {"color": color_n, "font-size": "12px",}],
                ["display-text",
                    function() {return player.n.buyables[12].gt(0) ? "*" + format(buyableEffect("n",12)["second"]) + " from your Reflection Nebulae." : ""},
                    {"color": color_n, "font-size": "12px",}],
                ["display-text",
                    function() {return player.c.buyables[12].eq(1) ? "*" + format(buyableEffect("c", 12)) + " from Crystal upgrade 12." : ""},
                    {"color": color_c, "font-size": "12px",}],
                ["display-text",
                    function() {return player.c.buyables[22].eq(1) && player.points.lt(1e16) ? "*" + format(buyableEffect("c", 22)) + " from Crystal upgrade 22." : ""},
                    {"color": color_c, "font-size": "12px",}],
        ]
        },
        Stardust: {
            buttonStyle() {return  {'color': color_s}},
            content:
            ["main-display",
                ["display-text",
                    function() {return 'You have ' + format(player.s.points) + ' stardust.'},
                    {"color": color_s, "font-size": "20px",}],
                ["blank", "15px"],
                ["display-text",
                    function() {return 'Your stardust gain multiplier is ' + format(layers.s.gainMult()) + '.'},
                    {"color": color_s, "font-size": "16px",}],
                ["display-text",
                    function() {return hasUpgrade("s",14) ? "*3.00 from Stardust upgrade 14." : ""},
                    {"color": color_s, "font-size": "12px",}],
                ["display-text",
                    function() {return hasUpgrade("s",22) ? "*" + format(upgradeEffect("s",22)) + ' from Stardust upgrade 22.' : ""},
                    {"color": color_s, "font-size": "12px",}],
                ["display-text",
                    function() {return player.so.unlocked ? "*" + format(layers["so"].effect()) + ' from the Star effect.' : ""},
                    {"color": color_so, "font-size": "12px",}],
                ["display-text",
                    function() {return hasUpgrade("so",13) ? "*" + format(upgradeEffect("so",13)) + ' from Star upgrade 13.' : ""},
                    {"color": color_so, "font-size": "12px",}],
                ["display-text",
                    function() {return player.n.buyables[13].gt(0) ? "*" + format(buyableEffect("n",13)["second"]) + " from your Dark Nebulae." : ""},
                    {"color": color_n, "font-size": "12px",}],
        ]
        },
        Stars: {
            buttonStyle() {return  {'color': color_so}},
            content:
            ["main-display",
                ["display-text",
                    function() {return 'You have ' + format(player.so.points) + ' stars.'},
                    {"color": color_so, "font-size": "20px",}],
                ["blank", "15px"],
                ["display-text",
                    function() {return 'Your star gain multiplier is ' + format(layers.so.gainMult()) + '.'},
                    {"color": color_so, "font-size": "16px",}],
                ["display-text",
                    function() {return hasUpgrade("n",12) ? "*2.00 from Nebula upgrade 12." : ""},
                    {"color": color_n, "font-size": "12px",}],
                ["display-text",
                    function() {return player.n.buyables[13].gt(0) ? "/" + format(buyableEffect("n",13)["first"]) + " from your Dark Nebulae." : ""},
                    {"color": color_n, "font-size": "12px",}],
                ["display-text",
                    function() {return hasUpgrade("so",21) ? "*" + format(upgradeEffect("so",21)) + " from Star upgrade 21." : ""},
                    {"color": color_so, "font-size": "12px",}],
                ["display-text",
                    function() {return player.c.buyables[11].eq(1) ? "*" + format(buyableEffect("c", 11)) + " from Crystal upgrade 11." : ""},
                    {"color": color_c, "font-size": "12px",}],
                ["blank", "15px"],
                ["display-text",
                    function() {return 'Your star effect is ' + format(layers.so.effect()) + '.'},
                    {"color": color_so, "font-size": "16px",}],
                ["display-text",
                    function() {return player.so.unlocked ? "*" + format(player["so"].points.add(1).sqrt()) + ' from unspent stars.' : ""},
                    {"color": color_so, "font-size": "12px",}],
                ["display-text",
                    function() {return hasUpgrade("so",12) ? "*" + format(upgradeEffect("so",12)) + ' from Star upgrade 12.' : ""},
                    {"color": color_so, "font-size": "12px",}],
                ["display-text",
                    function() {return player.so.buyables[12].gt(0) ? "*" + format(buyableEffect("so",12)["first"]) + ' from Constellation 2.' : ""},
                    {"color": color_so, "font-size": "12px",}],
                ["blank", "15px"],
        ],
        unlocked() {return player.so.unlocked}
        },
        Nebulae: {
            buttonStyle() {return  {'color': color_n}},
            content:
            ["main-display",
                ["display-text",
                    function() {return 'You have ' + format(player.n.points) + ' nebulae.'},
                    {"color": color_n, "font-size": "20px",}],
                ["blank", "15px"],
                ["display-text",
                    function() {return 'Your nebulae gain multiplier is ' + format(layers.n.gainMult()) + '.'},
                    {"color": color_n, "font-size": "16px",}],
                ["display-text",
                    function() {return hasUpgrade("n",12) ? "*2.00 from Nebula upgrade 12." : ""},
                    {"color": color_n, "font-size": "12px",}],
                ["display-text",
                    function() {return player.n.buyables[12].gt(0) ? "/" + format(buyableEffect("n",12)["first"]) + " from your Reflection Nebulae." : ""},
                    {"color": color_n, "font-size": "12px",}],
                ["blank", "15px"],
                ["display-text",
                    function() {return 'Your nebula effect is ' + format(layers.n.effect()) + '.'},
                    {"color": color_n, "font-size": "16px",}],
                ["display-text",
                    function() {return player.n.unlocked ? "*" + format(player["n"].points.add(1).sqrt()) + ' from unspent nebulae.' : ""},
                    {"color": color_n, "font-size": "12px",}],
                ["display-text",
                    function() {return hasUpgrade("n",22) ? "*" + format(upgradeEffect("n",22)) + ' from Nebulae upgrade 22.' : ""},
                    {"color": color_n, "font-size": "12px",}],
                ["display-text",
                    function() {return player.c.buyables[13].eq(1) ? "*" + format(buyableEffect("c", 13)) + " from Crystal upgrade 13." : ""},
                    {"color": color_c, "font-size": "12px",}],
        ],
        unlocked() {return player.n.unlocked}
        },
        Crystals: {
            buttonStyle() {return  {'color': color_c}},
            content:
            ["main-display",
                ["display-text",
                    function() {return 'You have ' + format(player.c.points) + ' crystals.'},
                    {"color": color_c, "font-size": "20px",}],
                ["blank", "15px"],
                ["display-text",
                    function() {return 'You have ' + format(layers.c.getShards()) + ' shards.'},
                    {"color": color_c, "font-size": "16px",}],
                ["display-text",
                    function() {return "(Crystals ^ 1.25, floored, * 5)"},
                    {"color": color_c, "font-size": "12px",}],
        ],
        unlocked() {return player.c.unlocked}
        },
    },
    layerShown() {return true}, 
}, 
)