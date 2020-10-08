/* addLayer("c", {
        layer: "c", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it
        startData() { return {
            unl: true,
			points: new Decimal(0),
            best: new Decimal(0),
            total: new Decimal(0),
            buyables: {}, // You don't actually have to initialize this one
            beep: false,
        }},
        color:() => "#4BDC13",
        requires:() => new Decimal(10), // Can be a function that takes requirement increases into account
        resource: "lollipops", // Name of prestige currency
        baseResource: "candies", // Name of resource prestige is based on
        baseAmount() {return player.points}, // Get the current amount of baseResource
        type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        exponent: 0.5, // Prestige currency exponent
        base: 5, // Only needed for static layers, base of the formula (b^(x^exp))
        resCeil: false, // True if the cost needs to be rounded up (use when baseResource is static?)
        canBuyMax() {}, // Only needed for static layers with buy max
        gainMult() { // Calculate the multiplier for main currency from bonuses
            mult = new Decimal(1)
            if (hasUpg(this.layer, 166)) mult = mult.times(2) // These upgrades don't exist
			if (hasUpg(this.layer, 120)) mult = mult.times(this.upgrades[12].effect())
            return mult
        },
        gainExp() { // Calculate the exponent on main currency from bonuses
            return new Decimal(1)
        },
        row: 0, // Row the layer is in on the tree (0 is the first row)
        effect() {
            return { // Formulas for any boosts inherent to resources in the layer. Can return a single value instead of an object if there is just one effect
            waffleBoost: (true == false ? 0 : Decimal.pow(player[this.layer].points, 0.2)),
            icecreamCap: (player[this.layer].points * 10)
        }},
        effectDescription() { // Optional text to describe the effects
            eff = this.effect;
            return "which are boosting waffles by "+format(eff.waffleBoost)+" and increasing the Ice Cream cap by "+format(eff.icecreamCap)
        },
        milestones: {
            0: {requirementDesc:() => "3 Lollipops",
            done() {return player[this.layer].best.gte(3)}, // Used to determine when to give the milestone
            effectDesc:() => "Makes this green",
            },
            1: {requirementDesc:() => "4 Lollipops",
            done() {return player[this.layer].best.gte(4)},
            effectDesc:() => "You can toggle beep and boop (which do nothing)",
            toggles: [
                ["c", "beep"], // Each toggle is defined by a layer and the data toggled for that layer
                ["f", "boop"]],
            }
        },
        challs: {
            rows: 1,
    		cols: 1,
		    11: {
			    name:() => "Fun",
			    desc:() => "Makes the game 0% harder",
			    unl() { return player[this.layer].best.gt(0) },
                goal:() => new Decimal("20"),
                currencyDisplayName: "lollipops", // Use if using a nonstandard currency
                currencyInternalName: "points", // Use if using a nonstandard currency
                currencyLayer: this.layer, // Leave empty if not in a layer
                effect() {
                    let ret = player[this.layer].points.add(1).tetrate(0.02)
                    return ret;
                },
                effectDisplay(x) { return format(x)+"x" },
                countsAs: [12, 21], // Use this for if a challenge includes the effects of other challenges. Being in this challenge "counts as" being in these.
                reward:() => "Says hi",
                onComplete() {console.log("hiii")} // Called when you complete the challenge
            },
        }, 
        upgrades: {
            rows: 1,
            cols: 3,
            11: {
                title:() => "Generator of Genericness",
                desc:() => "Gain 1 Point every second.",
                cost:() => new Decimal(1),
                unl() { return player[this.layer].unl }, // The upgrade is only visible when this is true
            },
            12: {
                desc:() => "Candy generation is faster based on your unspent Lollipops.",
                cost:() => new Decimal(1),
                unl() { return (hasUpg(this.layer, 11))},
                effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                    let ret = player[this.layer].points.add(1).pow(player[this.layer].upgrades.includes(24)?1.1:(player[this.layer].upgrades.includes(14)?0.75:0.5)) 
                    if (ret.gte("1e20000000")) ret = ret.sqrt().times("1e10000000")
                    return ret;
                },
                effectDisplay(fx) { return format(fx)+"x" }, // Add formatting to the effect
            },
            13: {
                desc:() => "Make this layer act like you bought it first.",
                cost:() => new Decimal(69),
                currencyDisplayName: "candies", // Use if using a nonstandard currency
                currencyInternalName: "points", // Use if using a nonstandard currency
                currencyLayer: "", // Leave empty if not in a layer "e.g. points"
                unl() { return (hasUpg(this.layer, 12))},
                onPurchase() { // This function triggers when the upgrade is purchased
                    player[this.layer].order = 0
                }
            },
        },
        buyables: {
            rows: 1,
            cols: 1,
            respec() { // Optional, reset things and give back your currency. Having this function makes a respec button appear
                player[this.layer].points = player[this.layer].points.add(player[this.layer].spentOnBuyables) // A built-in thing to keep track of this but only keeps a single value
                resetBuyables(this.layer)
                doReset(this.layer, true) // Force a reset
            },
            respecText:() => "Respec Thingies", // Text on Respec button, optional
            11: {
                title:() => "Exhancers", // Optional, displayed at the top in a larger font
                cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    if (x.gte(25)) x = x.pow(2).div(25)
                    let cost = Decimal.pow(2, x.pow(1.5))
                    return cost.floor()
                },
                effect(x) { // Effects of owning x of the items, x is a decimal
                    let eff = {}
                    if (x.gte(0)) eff.first = Decimal.pow(25, x.pow(1.1))
                    else eff.first = Decimal.pow(1/25, x.times(-1).pow(1.1))
                
                    if (x.gte(0)) eff.second = x.pow(0.8)
                    else eff.second = x.times(-1).pow(0.8).times(-1)
                    return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp.buyables[this.layer][this.id]
                    return "Cost: " + format(data.cost) + " lollipops\n\
                    Amount: " + player[this.layer].buyables[this.id] + "\n\
                    Adds + " + format(data.effect.first) + " things and multiplies stuff by " + format(data.effect.second)
                },
                unl() { return player[this.layer].unl }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp.buyables[this.layer][this.id].cost)},
                buy() { 
                    cost = tmp.buyables[this.layer][this.id].cost
                    player[this.layer].points = player[this.layer].points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
                },
                buyMax() {}, // You'll have to handle this yourself if you want
            },
        },
        doReset(resettingLayer){ // Triggers when this layer is being reset, along with the layer doing the resetting. Not triggered by lower layers resetting, but is by layers on the same row.
            if(layers[resettingLayer].row > this.row) fullLayerReset(this.layer) // This is actually the default behavior
        },
        convertToDecimal() {
            // Convert any layer-specific Decimal values (besides points, total, and best) from String to Decimal (used when loading save)
        },
        layerShown() {return true}, // Condition for when layer appears on the tree
        update(diff) {
            if (player[this.layer].upgrades.includes(11)) player.points = player.points.add(tmp.pointGen.times(diff)).max(0)
        }, // Do any gameloop things (e.g. resource generation) inherent to this layer
        automate() {
        }, // Do any automation inherent to this layer if appropriate
        updateTemp() {
        }, // Do any necessary temp updating, not that important usually
        resetsNothing() {return false},
        onPrestige(gain) {
            return
        }, // Useful for if you gain secondary resources or have other interesting things happen to this layer when you reset it. You gain the currency after this function ends.

        hotkeys: [
            {key: "c", desc: "C: reset for lollipops or whatever", onPress(){if (player[this.layer].unl) doReset(this.layer)}},
            {key: "ctrl+c" + this.layer, desc: "Ctrl+c: respec things", onPress(){if (player[this.layer].unl) respecBuyables(this.layer)}},
        ],
        incr_order: [], // Array of layer names to have their order increased when this one is first unlocked

        // Optional, lets you format the tab yourself by listing components. You can create your own components in v.js.
        tabFormat: ["main-display",
                    ["prestige-button", function() {return "Melt your points into "}],
                    ["blank", "5px"], // Height
                    ["raw-html", function() {return "<button onclick='console.log(`yeet`)'>'HI'</button>"}],
                    ["display-text",
                        function() {return 'I have ' + format(player.points) + ' pointy points!'},
                        {"color": "red", "font-size": "32px", "font-family": "Comic Sans MS"}],
                    ["buyables", "150px"],
                    ["row", [
                        ["toggle", ["c", "beep"]], ["blank", ["30px", "10px"]], // Width, height
                        ["display-text", function() {return "Beep"}], "blank",
                        ["column", [
                            ["prestige-button", function() {return "Be redundant for "}, {'width': '150px', 'height': '30px'}],
                            ["prestige-button", function() {return "Be redundant for "}, {'width': '150px', 'height': '30px'}],
                        ]],
                    ]],
                    "milestones", "blank", "upgrades", "challs"],
        style() {return {
            'background-color': '#3325CC'
        }},
        shouldNotify() { // Optional, layer will be highlighted on the tree if true.
                         // Layer will automatically highlight if an upgrade is purchasable.
            return (player.c.buyables[11] == 1)
        }
}) */
addLayer("s", {
    startData() { return {
        unl: true,
              points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
    }},
    color:() => "#404060",
    requires() {return new Decimal(10)}, 
    resource: "stardust", 
    baseResource: "points", 
    baseAmount() {return player.points},
    type: "normal", 
    exponent: 0.5, 
    gainMult() {
        mult = new Decimal(1)
        if(hasUpg(this.layer, 14)) mult = mult.times(3)
        if(hasUpg(this.layer, 22)) mult = mult.times(layers["s"].upgrades[22].effect())
        if(hasUpg("n",11)) mult = mult.times(layers["n"].upgrades[11].effect())
        mult = mult.times(layers["so"].effect("stardustBoost"))
        mult = mult.times(buyableEffect("n",13)["second"])
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    upgrades: {
        rows: 2,
        cols: 4,
        11: {
            title:() => "Start.",
            desc:() => "Gain 1 Point every second.",
            cost:() => new Decimal(1),
            unl() { return true }, // The upgrade is only visible when this is true
        },
        12: {
            title:() => "Amplify.",
            desc:() => "Add 2 to the point generation base.",
            cost:() => new Decimal(2),
            unl() { return (hasUpg(this.layer, 11)) || player.so.unl || player.n.unl},
        },
        13: {
            title:() => "Expand space.",
            desc:() => "Increase point generation based on unspent stardust.",
            cost:() => new Decimal(2),
            unl() { return (hasUpg(this.layer, 12)) || player.so.unl || player.n.unl},
            effect() {
              return player[this.layer].points.add(9).pow(1/3)
            }
        },
        14: {
            title:() => "Extend reach.",
            desc:() => "Stardust gain is tripled.",
            cost:() => new Decimal(10),
            unl() { return (hasUpg(this.layer, 13)) || player.so.unl || player.n.unl},
        },
        21: {
            title:() => "Magnify.",
            desc:() => "Double the point generation base.",
            cost:() => new Decimal(25),
            unl() { return (hasUpg(this.layer, 14)) || player.so.unl || player.n.unl},
        },
        22: {
            title:() => "Placeholder title.",
            desc:() => "Points further increase stardust gain.",
            cost:() => new Decimal(50),
            unl() { return (hasUpg(this.layer, 21)) || player.so.unl || player.n.unl},
            effect() {
                return player.points.add(1).log(10).add(1)
            }
        },
        23: {
            title:() => "Placeholder title.",
            desc:() => "Point generation gains a temporary 10x boost until 500 points.",
            cost:() => new Decimal(100),
            unl() { return (hasUpg(this.layer, 22)) || player.so.unl || player.n.unl},
        },
        24: {
            title:() => "Placeholder title.",
            desc:() => "Unlock more upgrades in the sol and nebulae layers. (not implemented yet)",
            cost:() => new Decimal(1e12),
            unl() { return (hasUpg(this.layer, 23)) || player.so.unl || player.n.unl},
        },
    },
    doReset(resettingLayer){ // Triggers when this layer is being reset, along with the layer doing the resetting. Not triggered by lower layers resetting, but is by layers on the same row.
        if(layers[resettingLayer].row > this.row) {
        fullLayerReset(this.layer)
        if(hasUpg("so",14)) player.s.upgrades = [11,12,13,14,21,22,23]
        }
    },
    hotkeys: [
        {key: "s", // What the hotkey button is. Use uppercase if it's combined with shift, or "ctrl+x" if ctrl is.
        desc: "s: reset your points for stardust", // The description of the hotkey used in the How To Play
        onPress(){doReset("s")}}, // This function is called when the hotkey is pressed.
    ],
    update(diff) {
        if (player[this.layer].upgrades.includes(11)) player.points = player.points.add(tmp.pointGen.times(diff)).max(0)
    },
    row: 0,
    layerShown() {return true},  // Each pair corresponds to a line added to the tree when this node is unlocked. The letter is the other end of the line, and the number affects the color, 1 is default
}, 
)
addLayer("so", {
    startData() { return {
        unl: false,
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
    color:() => "#fadb6b",
    requires() {return new Decimal(200)}, 
    resource: "stars", 
    baseResource: "points", 
    baseAmount() {return player.points},
    type: "normal",
    exponent: 0.5,
    gainMult() {
        gain = new Decimal(1)
        gain = gain.div(buyableEffect("n",13)["first"])
        return gain
    },
    gainExp() {
        return new Decimal(1)
    },
  buyables: {
            rows: 1,
            cols: 1,
            respec() { // Optional, reset things and give back your currency. Having this function makes a respec button appear
                player[this.layer].points = player[this.layer].points.add(player[this.layer].spentOnBuyables) // A built-in thing to keep track of this but only keeps a single value
                resetBuyables(this.layer)
                doReset(this.layer, true) // Force a reset
            },
            respecText:() => "Respec Stars", // Text on Respec button, optional
            11: {
                title:() => "Constellation 1", // Optional, displayed at the top in a larger font
                cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2, x.pow(1.4))
                    return cost.floor()
                },
                effect(x) { // Effects of owning x of the items, x is a decimal
                    let eff = {}
                    if (x.gte(0)) {
                        eff.first = Decimal.pow(3, x.pow(0.3))
                        eff.first = eff.first.times(buyableEffect("n",14)["first"])
                    }
                    return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp.buyables[this.layer][this.id]
                    return "Cost: " + format(data.cost) + " stars\n\
                    Amount: " + player[this.layer].buyables[this.id] + "\n\
                    Adds + " + format(data.effect.first) + " to the point generation base"
                },
                unl() { return player[this.layer].unl }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp.buyables[this.layer][this.id].cost)},
                buy() { 
                    cost = tmp.buyables[this.layer][this.id].cost
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
                desc:() => "Stars also buff points at a reduced rate.",
                cost:() => new Decimal(3),
                unl() { return player[this.layer].unl }, 
                effect() {
                    eff = player[this.layer].points.add(8).pow(1/3)
                    return eff
                  }
            },
            12: {
                title:() => "Glow.",
                desc:() => "Dark nebulae nerf is slightly decreased.",
                cost:() => new Decimal(10),
                unl() { return (hasUpg(this.layer, 11))},
            },
            13: {
                title:() => "Accrete.",
                desc:() => "Increase stardust generation based on unspent stars.",
                cost:() => new Decimal(5),
                unl() { return (hasUpg(this.layer, 11))},
                effect() {
                  return player[this.layer].points.add(1).pow(1/3)
                }
            },
            14: {
                title:() => "Simplify.",
                desc:() => "Keep the first seven stardust upgrades on a row 2 reset.",
                cost:() => new Decimal(50),
                unl() { return (hasUpg(this.layer, 11))},
            },
        },
        hotkeys: [
            {key: "S", 
            desc: "Shift-s: reset your stardust for stars",
            onPress(){if (player.so.unl) doReset("so")}},
        ],
    row: 1,
    layerShown() {return true},  // Each pair corresponds to a line added to the tree when this node is unlocked. The letter is the other end of the line, and the number affects the color, 1 is default
    branches: [["s", 5]]
}, 
)
addLayer("c", {
    startData() { return {
        unl: false,
              points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
    }},
    color:() => "#8080b0",
    requires() {return new Decimal("1e30")}, 
    resource: "crystals", 
    baseResource: "stardust", 
    baseAmount() {return player.s.points},
    type: "normal", 
    exponent: .5,
    gainMult() {
        return new Decimal(1)
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 1,
    layerShown() {return true},  // Each pair corresponds to a line added to the tree when this node is unlocked. The letter is the other end of the line, and the number affects the color, 1 is default
    branches: [["s", 4]]
}, 
)
addLayer("n", {
    startData() { return {
        unl: false,
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
        return "which are boosting stardust gain by "+format(eff)+"."
    },
    color:() => "#6541d1",
    requires() {return new Decimal(50)}, 
    resource: "nebulae", 
    baseResource: "stardust", 
    baseAmount() {return player.s.points},
    type: "normal",
    exponent: 0.5, 
    gainMult() {
        gain = new Decimal(1)
        gain = gain.div(buyableEffect("n",12)["first"])
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
            respecText:() => "Respec Nebulae", // Text on Respec button, optional
            11: {
                title:() => "Emission Nebulae", // Optional, displayed at the top in a larger font
                cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2, x.pow(1.2))
                    return cost.floor()
                },
                effect(x) { // Effects of owning x of the items, x is a decimal
                    let eff = {}
                    if (x.gte(0)) eff.first = Decimal.pow(1.77, x.pow(0.5))
                    return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp.buyables[this.layer][this.id]
                    return "Cost: " + format(data.cost) + " stars\n\
                    Amount: " + player[this.layer].buyables[this.id] + "\n\
                    Further multiply point gain by " + format(data.effect.first) + "x"
                },
                unl() { return player[this.layer].unl }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp.buyables[this.layer][this.id].cost)},
                buy() { 
                    cost = tmp.buyables[this.layer][this.id].cost
                    player[this.layer].points = player[this.layer].points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
                },
            },
      12: {
                title:() => "Reflection Nebulae", // Optional, displayed at the top in a larger font
                cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2, x.pow(1.5))
                    return cost.floor()
                },
                effect(x) { // Effects of owning x of the items, x is a decimal
                    let eff = {}
                    if (x.gte(0)) {
                        eff.first = Decimal.pow(2, x.pow(0.8))
                        if(hasUpg("n",13) && eff.first.gt(1)) eff.first = eff.first.div(layers["n"].upgrades[13].effect())
                    }
                    if (x.gte(0)) eff.second = Decimal.pow(3, x.pow(0.5))
                    return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp.buyables[this.layer][this.id]
                    return "Cost: " + format(data.cost) + " stars\n\
                    Amount: " + player[this.layer].buyables[this.id] + "\n\
                    Divides nebula gain by " + format(data.effect.first) + "x and multiplies point gain by " + format(data.effect.second) + "x"
                },
                unl() { return player[this.layer].unl }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp.buyables[this.layer][this.id].cost)},
                buy() { 
                    cost = tmp.buyables[this.layer][this.id].cost
                    player[this.layer].points = player[this.layer].points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
                },
            },
      13: {
                title:() => "Dark Nebulae", // Optional, displayed at the top in a larger font
                cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2, x.pow(1.6))
                    return cost.floor()
                },
                effect(x) { // Effects of owning x of the items, x is a decimal
                    let eff = {}
                    if (x.gte(0)) {
                        eff.first = Decimal.pow(2, x.pow(0.5))
                        if(hasUpg("so",12) && eff.first.gt(1)) eff.first = eff.first.div(1.5)
                        if(hasUpg("n",13) && eff.first.gt(1)) eff.first = eff.first.div(layers["n"].upgrades[13].effect())
                    }
                    if (x.gte(0)) eff.second = Decimal.pow(3, x.pow(0.5))
                    return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp.buyables[this.layer][this.id]
                    return "Cost: " + format(data.cost) + " stars\n\
                    Amount: " + player[this.layer].buyables[this.id] + "\n\
                    Divides star and point gain by " + format(data.effect.first) + "x and multiplies stardust gain by " + format(data.effect.second) + "x"
                },
                unl() { return player[this.layer].unl }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp.buyables[this.layer][this.id].cost)},
                buy() { 
                    cost = tmp.buyables[this.layer][this.id].cost
                    player[this.layer].points = player[this.layer].points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
                },
            },
      14: {
                title:() => "Planetary Nebulae", // Optional, displayed at the top in a larger font
                cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2, x.pow(1.3))
                    return cost.floor()
                },
                effect(x) { // Effects of owning x of the items, x is a decimal
                    let eff = {}
                    if (x.gte(0)) eff.first = Decimal.pow(2, x.pow(0.5))
                    return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp.buyables[this.layer][this.id]
                    return "Cost: " + format(data.cost) + " stars\n\
                    Amount: " + player[this.layer].buyables[this.id] + "\n\
                    Multiplies contellation effects by " + format(data.effect.first) + "x"
                },
                unl() { return player[this.layer].unl }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp.buyables[this.layer][this.id].cost)},
                buy() { 
                    cost = tmp.buyables[this.layer][this.id].cost
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
                desc:() => "Unspent nebulae buff stardust at a reduced rate.",
                cost:() => new Decimal(3),
                unl() { return player[this.layer].unl }, 
                effect() {
                    eff = player[this.layer].points.add(8).pow(1/3)
                    return eff
                  }
            },
            12: {
                title:() => "Placeholder name.",
                desc:() => "Double nebulae and star gain.",
                cost:() => new Decimal(5),
                unl() { return (hasUpg(this.layer, 11))},
            },
            13: {
                title:() => "Placeholder name.",
                desc:() => "Nebulae nerfs are reduced by unspent nebulae.",
                cost:() => new Decimal(20),
                unl() { return (hasUpg(this.layer, 12))},
                effect() {
                  return player[this.layer].points.add(1).pow(1/5)
                }
            },
            14: {
                title:() => "Placeholder name.",
                desc:() => "Gain 100% of stardust gain per second.",
                cost:() => new Decimal(50),
                unl() { return (hasUpg(this.layer, 13))},
            },
        },
        update(diff) {
            if (hasUpg("n",14)) generatePoints("s", diff)
          },
        hotkeys: [
            {key: "n", 
            desc: "n: reset your stardust for nebulas",
            onPress(){if (player.n.unl) doReset("n")}},
        ],
    row: 1,
    layerShown() {return true},  // Each pair corresponds to a line added to the tree when this node is unlocked. The letter is the other end of the line, and the number affects the color, 1 is default
    branches: [["s", 6]]
}, 
)