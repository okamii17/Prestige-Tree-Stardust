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
            rows: 2,
            cols: 4,
            11: {
                title:() => "Start.",
                description:() => "Gain 1 Energy every second.",
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
                description:() => "Add 2 to the energy generation base.",
                cost:() => new Decimal(2),
                unlocked() { return (hasUpgrade(this.layer, 11) || hasUpgrade(this.layer,11) && (player.so.unlocked || player.n.unlocked))},
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
                description:() => "Multiply energy generation based on unspent stardust.",
                cost:() => new Decimal(2),
                unlocked() { return (hasUpgrade(this.layer, 12) || hasUpgrade(this.layer,11) && (player.so.unlocked || player.n.unlocked))},
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
                unlocked() { return (hasUpgrade(this.layer, 13) || hasUpgrade(this.layer,11) && (player.so.unlocked || player.n.unlocked)) },
                style() {
                    if (hasUpgrade(this.layer, this.id)) return {
                    'background-color': '#606090' 
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
                title:() => "Energize.",
                description:() => "Energy further increases stardust gain.",
                cost:() => new Decimal(50),
                unlocked() { return (hasUpgrade(this.layer, 21) || hasUpgrade(this.layer,11) && (player.so.unlocked || player.n.unlocked)) },
                effect() {
                    return player.points.add(1).log(10).add(1)
                },
                style() {
                    if (hasUpgrade(this.layer, this.id)) return {
                    'background-color': '#606090' 
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
                description:() => "aaaaaaaaaa",
                cost:() => new Decimal(1e12),
                unlocked() { return (hasUpgrade(this.layer, 23) || hasUpgrade(this.layer,11) && (player.so.unlocked || player.n.unlocked)) },
                style() {
                    if (hasUpgrade(this.layer, this.id)) return {
                    'background-color': '#F08080' 
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
        doReset(resettingLayer){ // Triggers when this layer is being reset, along with the layer doing the resetting. Not triggered by lower layers resetting, but is by layers on the same row.
            if(layers[resettingLayer].row > this.row) {
            layerDataReset(this.layer)
            if(hasUpgrade("so",14)) player.s.upgrades.push("11", "12", "13", "14", "21", "22", "23")
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
    }},
    effect() {
        eff = player[this.layer].points.add(1).sqrt()
        if(hasUpgrade("so",12)) eff = eff.times(upgradeEffect("so",12))
        return eff
        },
    effectDescription() {
        eff = this.effect();
        return "which are boosting stardust gain by "+format(eff)+"."
    },
    color:() => "#fadb6b",
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
        return gain
    },
    gainExp() {
        return new Decimal(1)
    },
  buyables: {
            rows: 1,
            cols: 1,
            showRespec: false,
            11: {
                title:() => "Constellation 1", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2, x.pow(1.4))
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
        },
        upgrades: {
            rows: 1,
            cols: 4,
            11: {
                title:() => "Placeholder name.",
                description:() => "Stars also buff energy gain at a reduced rate.",
                cost:() => new Decimal(5),
                unlocked() { return player[this.layer].unlocked }, 
                effect() {
                    eff = player[this.layer].points.add(1).pow(1/4).add(1)
                    return eff
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
                    'background-color': '#fadb6b' 
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
                cost:() => new Decimal(60),
                unlocked() { return (hasUpgrade(this.layer, 11))},
                effect() {
                  return player[this.layer].points.add(1).pow(1/3)
                },
                style() {
                    if (hasUpgrade(this.layer, this.id)) return {
                    'background-color': '#606090' 
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
                cost:() => new Decimal(950),
                unlocked() { return (hasUpgrade(this.layer, 11))},
                style() {
                    if (hasUpgrade(this.layer, this.id)) return {
                    'background-color': '#606090' 
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
    }},
    effect() {
        eff = player[this.layer].points.add(1).sqrt()
        return eff
        },
    effectDescription() {
        eff = this.effect();
        return "which are boosting point gain by "+format(eff)+"."
    },
    color:() => "#6541d1",
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
                    let cost = Decimal.pow(2, x.pow(1.2))
                    return cost.floor()
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
                    let eff = {}
                    eff.first = new Decimal(1)
                    if (x.gte(0)) eff.first = Decimal.pow(1.77, x.pow(0.5))
                    if(!eff.first) eff.first = new Decimal(1)
                    return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Cost: " + format(data.cost) + " nebulae\n\
                    Amount: " + player[this.layer].buyables[this.id] + "\n\
                    Further multiply point gain by " + format(data.effect.first) + "x"
                },
                unl() { return player[this.layer].unl }, 
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
                },
            },
      12: {
                title:() => "Reflection Nebulae", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2, x.pow(1.5))
                    return cost.floor()
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
                    let eff = {}
                    eff.first = new Decimal(1)
                    if (x.gte(0)) {
                        eff.first = Decimal.pow(2, x.pow(0.9))
                        if(hasUpgrade("n",13) && eff.first.gt(1)) eff.first = eff.first.div(layers["n"].upgrades[13].effect())
                        eff.first = eff.first.max(1)
                        if(!eff.first) eff.first = new Decimal(1)
                    }
                    if (x.gte(0)) {
                        eff.second = Decimal.pow(3, x.pow(0.33))
                    }
                    return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Cost: " + format(data.cost) + " nebulae\n\
                    Amount: " + player[this.layer].buyables[this.id] + "\n\
                    Divides nebula gain by " + format(data.effect.first) + "x and multiplies point gain by " + format(data.effect.second) + "x"
                },
                unl() { return player[this.layer].unl }, 
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
                },
            },
      13: {
                title:() => "Dark Nebulae", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2, x.pow(1.6))
                    return cost.floor()
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
                    let eff = {}
                    if (x.gte(0)) {
                        eff.first = new Decimal(1)
                        eff.first = Decimal.pow(2, x.pow(0.8))
                        if(hasUpgrade("n",13) && eff.first.gt(1)) eff.first = eff.first.div(layers["n"].upgrades[13].effect())
                        eff.first = eff.first.max(1)
                        if(!eff.first) eff.first = new Decimal(1)
                    }
                    eff.second = Decimal.pow(3, x.pow(0.33))
                    return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Cost: " + format(data.cost) + " nebulae\n\
                    Amount: " + player[this.layer].buyables[this.id] + "\n\
                    Divides star gain by " + format(data.effect.first) + "x and multiplies stardust gain by " + format(data.effect.second) + "x"
                },
                unl() { return player[this.layer].unl }, 
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
                },
            },
      14: {
                title:() => "Planetary Nebulae", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2, x.pow(1.3))
                    return cost.floor()
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
                    let eff = {}
                    eff.first = new Decimal(1)
                    if (x.gte(0)) eff.first = Decimal.pow(2, x.pow(0.4))
                    return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Cost: " + format(data.cost) + " nebulae\n\
                    Amount: " + player[this.layer].buyables[this.id] + "\n\
                    Multiplies contellation effects by " + format(data.effect.first) + "x"
                },
                unl() { return player[this.layer].unl }, 
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
                },
            },
        },
        upgrades: {
            rows: 1,
            cols: 4,
            11: {
                title:() => "Placeholder name.",
                description:() => "Unspent nebulae buff stardust at a reduced rate.",
                cost:() => new Decimal(5),
                unl() { return player[this.layer].unl }, 
                effect() {
                    eff = player[this.layer].points.add(8).pow(1/3)
                    return eff
                  },
                  style() {
                    if (hasUpgrade(this.layer, this.id)) return {
                    'background-color': '#606090' 
                    }
                    else if (!canAffordUpgrade(this.layer, this.id)) {
                        return {
                            'background-color': '#808080' 
                        }
                    } // Otherwise use the default
                },
            },
            12: {
                title:() => "Placeholder name.",
                description:() => "Double nebulae and star gain.",
                cost:() => new Decimal(10),
                unl() { return (hasUpgrade(this.layer, 11))},
                style() {
                    if (hasUpgrade(this.layer, this.id)) return {
                    'background-color': '#808080' 
                    }
                    else if (!canAffordUpgrade(this.layer, this.id)) {
                        return {
                            'background-color': '#808080' 
                        }
                    } // Otherwise use the default
                },
            },
            
            13: {
                title:() => "Placeholder name.",
                description:() => "Nebulae nerfs are reduced by unspent nebulae, hardcapped at /1.",
                cost:() => new Decimal(400),
                unl() { return (hasUpgrade(this.layer, 12))},
                effect() {
                  return player[this.layer].points.add(5).log(7).add(1)
                },
                style() {
                    if (hasUpgrade(this.layer, this.id)) return {
                    'background-color': '#6040C0' 
                    }
                    else if (!canAffordUpgrade(this.layer, this.id)) {
                        return {
                            'background-color': '#808080' 
                        }
                    } // Otherwise use the default
                },
            },
            14: {
                title:() => "Placeholder name.",
                description:() => "Gain 10% of stardust gain per second.",
                cost:() => new Decimal(2000),
                unl() { return (hasUpgrade(this.layer, 13))},
                style() {
                    if (hasUpgrade(this.layer, this.id)) return {
                    'background-color': '#606090' 
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
            onPress(){if (player.n.unl) doReset("n")}},
        ],
    row: 1,
    layerShown() {return true},  // Each pair corresponds to a line added to the tree when this node is unlocked. The letter is the other end of the line, and the number affects the color, 1 is default
    branches: [["s", 6]],
    style() {return {
        'background-color': '#181028' 
     }},
},)
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
                    {"color": "#8080D0", "font-size": "20px",}],
                ["display-text",
                    function() {return 'You are getting ' + format(getPointGen()) + ' energy per second.'},
                    {"color": "#8080D0", "font-size": "16px",}],
                ["blank", "15px"],
                ["display-text",
                    function() {return 'Your energy generation base is ' + format(getPointBase()) + '.'},
                    {"color": "#8080D0", "font-size": "16px",}],
                ["display-text",
                    function() {return hasUpgrade("s",11) ? "1.00 from Stardust upgrade 11." : ""},
                    {"color": "#404060", "font-size": "12px",}],
                ["display-text",
                    function() {return hasUpgrade("s",12) ? "+2.00 from Stardust upgrade 12." : ""},
                    {"color": "#404060", "font-size": "12px",}],
                ["display-text",
                    function() {return hasUpgrade("s",23) ? "+" + format(upgradeEffect("s",23)) + ' from Stardust upgrade 23.' : ""},
                    {"color": "#404060", "font-size": "12px",}],
                ["display-text",
                    function() {return player.so.unlocked ? "+" + format(buyableEffect("so",11)["first"]) + ' from Constellation 1.' : ""},
                    {"color": "#fadb6b", "font-size": "12px",}],
                ["blank", "15px"],
                ["display-text",
                    function() {return 'Your energy generation multiplier is ' + format(getPointMult()) + '.'},
                    {"color": "#8080D0", "font-size": "16px",}],
                ["display-text",
                    function() {return hasUpgrade("s",13) ? "*" + format(upgradeEffect("s",13)) + ' from Stardust upgrade 13.' : ""},
                    {"color": "#404060", "font-size": "12px",}],
                ["display-text",
                    function() {return hasUpgrade("s",21) ? "*2.00 from Stardust upgrade 21." : ""},
                    {"color": "#404060", "font-size": "12px",}],
                ["display-text",
                    function() {return player.n.unlocked ? "*" + format(layers["n"].effect()) + " from the Nebulae effect." : ""},
                    {"color": "#6541d1", "font-size": "12px",}],
                ["display-text",
                    function() {return player.n.buyables[11].gt(0) ? "*" + format(buyableEffect("n",11)["first"]) + " from your Emission Nebulae." : ""},
                    {"color": "#6541d1", "font-size": "12px",}],
                ["display-text",
                    function() {return player.n.buyables[12].gt(0) ? "*" + format(buyableEffect("n",12)["second"]) + " from your Reflection Nebulae." : ""},
                    {"color": "#6541d1", "font-size": "12px",}],
        ]
        },
        Stardust: {
            buttonStyle() {return  {'color': '#404060'}},
            content:
            ["main-display",
                ["display-text",
                    function() {return 'You have ' + format(player.s.points) + ' stardust.'},
                    {"color": "#404060", "font-size": "20px",}],
                ["blank", "15px"],
                ["display-text",
                    function() {return 'Your stardust gain multiplier is ' + format(layers.s.gainMult()) + '.'},
                    {"color": "#404060", "font-size": "16px",}],
                ["display-text",
                    function() {return hasUpgrade("s",14) ? "*3.00 from Stardust upgrade 14." : ""},
                    {"color": "#404060", "font-size": "12px",}],
                ["display-text",
                    function() {return hasUpgrade("s",22) ? "*" + format(upgradeEffect("s",22)) + ' from Stardust upgrade 22.' : ""},
                    {"color": "#404060", "font-size": "12px",}],
                ["display-text",
                    function() {return player.so.unlocked ? "*" + format(layers["so"].effect()) + ' from the Star effect.' : ""},
                    {"color": "#fadb6b", "font-size": "12px",}],
                ["display-text",
                    function() {return hasUpgrade("so",13) ? "*" + format(upgradeEffect("so",13)) + ' from Star upgrade 13.' : ""},
                    {"color": "#fadb6b", "font-size": "12px",}],
                ["display-text",
                    function() {return player.n.buyables[13].gt(0) ? "*" + format(buyableEffect("n",13)["second"]) + " from your Dark Nebulae." : ""},
                    {"color": "#6541d1", "font-size": "12px",}],
        ]
        },
        Stars: {
            buttonStyle() {return  {'color': '#fadb6b'}},
            content:
            ["main-display",
                ["display-text",
                    function() {return 'You have ' + format(player.so.points) + ' stars.'},
                    {"color": "#fadb6b", "font-size": "20px",}],
                ["blank", "15px"],
                ["display-text",
                    function() {return 'Your star gain multiplier is ' + format(layers.so.gainMult()) + '.'},
                    {"color": "#fadb6b", "font-size": "16px",}],
                ["display-text",
                    function() {return hasUpgrade("n",12) ? "*2.00 from Nebula upgrade 12." : ""},
                    {"color": "#6541d1", "font-size": "12px",}],
                ["display-text",
                    function() {return player.n.buyables[13].gt(0) ? "/" + format(buyableEffect("n",13)["first"]) + " from your Dark Nebulae." : ""},
                    {"color": "#6541d1", "font-size": "12px",}],
                ["blank", "15px"],
                ["display-text",
                    function() {return 'Your star effect is ' + format(layers.so.effect()) + '.'},
                    {"color": "#fadb6b", "font-size": "16px",}],
                ["display-text",
                    function() {return player.so.unlocked ? "*" + format(player["so"].points.add(1).sqrt()) + ' from unspent stars.' : ""},
                    {"color": "#fadb6b", "font-size": "12px",}],
                ["display-text",
                    function() {return hasUpgrade("so",12) ? "*" + format(upgradeEffect("so",12)) + ' from Star upgrade 12.' : ""},
                    {"color": "#fadb6b", "font-size": "12px",}],
                ["blank", "15px"],
        ]
        },
        Nebulae: {
            buttonStyle() {return  {'color': '#6541d1'}},
            content:
            ["main-display",
                ["display-text",
                    function() {return 'You have ' + format(player.n.points) + ' nebulae.'},
                    {"color": "#6541d1", "font-size": "20px",}],
                ["blank", "15px"],
                ["display-text",
                    function() {return 'Your nebulae gain multiplier is ' + format(layers.n.gainMult()) + '.'},
                    {"color": "#6541d1", "font-size": "16px",}],
                ["display-text",
                    function() {return hasUpgrade("n",12) ? "*2.00 from Nebula upgrade 12." : ""},
                    {"color": "#6541d1", "font-size": "12px",}],
                ["display-text",
                    function() {return player.n.buyables[12].gt(0) ? "/" + format(buyableEffect("n",12)["first"]) + " from your Reflection Nebulae." : ""},
                    {"color": "#6541d1", "font-size": "12px",}],
                ["blank", "15px"],
                ["display-text",
                    function() {return 'Your nebula effect is ' + format(layers.n.effect()) + '.'},
                    {"color": "#6541d1", "font-size": "16px",}],
                ["display-text",
                    function() {return player.n.unlocked ? "*" + format(player["n"].points.add(1).sqrt()) + ' from unspent nebulae.' : ""},
                    {"color": "#6541d1", "font-size": "12px",}],
        ]
        },
    },
    layerShown() {return true}, 
}, 
)