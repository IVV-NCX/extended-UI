const iterationTools = require("extended-ui/utils/iteration-tools");

exports.getUnitsValueTop = function(amountToDisplay, granulatiry, hideCoreUnits, hideSupportUnits) {
    let unitsIterator = Groups.unit.iterator();
    let top = new Map();

    let unitCounter = (unit) => {
        if (hideCoreUnits && coreUnits.includes(unit.type.toString())) return;
        if (hideSupportUnits && supportUnits.includes(unit.type.toString())) return;

        let team = unit.team;
        let units;

        if (!top.has(team.id)) {
            top.set(team.id, {team: team, units: {}});
        }
        units = top.get(team.id).units;

        if (!units[unit.type]) {
            units[unit.type] = {amount: 0};
        }
        units[unit.type].amount++;
    }

    iterationTools.iterateSeq(unitCounter, unitsIterator);

    top.forEach((teamInfo, team_id) => {
        let value = 0;
        let units = teamInfo.units;
        for (let unit in units) {
            let unitValue = units[unit].amount * unitsValues[unit] || 0;
            units[unit].value = unitValue;
            value += unitValue;
        }
        top.get(team_id).units = Object.fromEntries(
            Object.entries(units)
                .sort(([,a],[,b]) => b.value - a.value)
                .slice(0, granulatiry)
        );
        top.get(team_id).value = value;
    })

    return Array.from(top.entries()).sort((a, b) => b[1].value - a[1].value).slice(0, amountToDisplay);
}

let coreUnits = [
    'alpha', 'beta', 'gamma'
]

let supportUnits = [
    'mono', 'poly', 'mega'
]

let resourceValues = {
    copper: 1/2.90,
    lead: 1/2.90,
    sand: 1/3.42,
    coal: 1/2.52,
    titanium: 1/2.23,
    thorium: 1/1.99,
}

resourceValues.energy = resourceValues.coal/120;
resourceValues.water = resourceValues.energy*3;
resourceValues.oil = resourceValues.energy*180/15 + resourceValues.water*9/15 + resourceValues.sand/15;
resourceValues.cryo = resourceValues.energy*5 + resourceValues.water + resourceValues.titanium/24;
resourceValues.graphite = resourceValues.coal*1.7;
resourceValues.silicon = resourceValues.sand*2 + resourceValues.coal*1 + resourceValues.energy*20;
resourceValues.metaglss = resourceValues.sand*1 + resourceValues.lead*1 + resourceValues.energy*30;
resourceValues.plastanium = resourceValues.titanium*2 + resourceValues.energy*180 + resourceValues.oil*15;
resourceValues.phaseFabric = resourceValues.sand*10 + resourceValues.thorium*4 + resourceValues.energy*600;
resourceValues.surgeAlloy = resourceValues.silicon*3 + resourceValues.titanium*2 + resourceValues.copper*7 + resourceValues.energy*240/1.25;

let tierValues = {
    second: resourceValues.silicon*40 + resourceValues.graphite*40 + resourceValues.energy*180*10
}

tierValues.third = tierValues.second + resourceValues.silicon*130 + resourceValues.titanium*80 + resourceValues.metaglss*40 + resourceValues.energy*360*30;
tierValues.fourth = tierValues.third + resourceValues.silicon*850 + resourceValues.titanium*750 + resourceValues.plastanium*650
                    + resourceValues.cryo*60*90, resourceValues.energy*780*90;
tierValues.fifth = tierValues.fourth + resourceValues.silicon*1000 + resourceValues.plastanium*600 + resourceValues.surgeAlloy*500
                   + resourceValues.phaseFabric*350 + resourceValues.cryo*180*240 + resourceValues.energy*1500*240;

let unitsValues = {
    alpha: 1,
    beta: 2,
    gamma: 3,
    dagger: resourceValues.silicon*10 + resourceValues.lead*10 + resourceValues.energy*72*15,
    nova: resourceValues.silicon*30 + resourceValues.lead*20 + resourceValues.titanium*20 + resourceValues.energy*72*40,
    crawler: resourceValues.coal*20 + resourceValues.silicon*10 + resourceValues.energy*72*12,
    flare: resourceValues.silicon*15 + resourceValues.energy*72*15,
    mono: resourceValues.silicon*30 + resourceValues.lead*15 + resourceValues.energy*72*35,
    risso: resourceValues.silicon*20 + resourceValues.metaglss*35 + resourceValues.energy*72*45
}

{
    const anotherUnits = [
        {
            name: "mace", base: "dagger", tier: "second"
        },
        {
            name: "fortress", base: "dagger", tier: "third"
        },
        {
            name: "scepter", base: "dagger", tier: "fourth"
        },
        {
            name: "reign", base: "dagger", tier: "fifth"
        },
        {
            name: "pulsar", base: "nova", tier: "second"
        },
        {
            name: "quasar", base: "nova", tier: "third"
        },
        {
            name: "vela", base: "nova", tier: "fourth"
        },
        {
            name: "corvus", base: "nova", tier: "fifth"
        },
        {
            name: "atrax", base: "crawler", tier: "second"
        },
        {
            name: "spiroct", base: "crawler", tier: "third"
        },
        {
            name: "arkyid", base: "crawler", tier: "fourth"
        },
        {
            name: "toxopid", base: "crawler", tier: "fifth"
        },
        {
            name: "horizon", base: "flare", tier: "second"
        },
        {
            name: "zenith", base: "flare", tier: "third"
        },
        {
            name: "antumbra", base: "flare", tier: "fourth"
        },
        {
            name: "eclipse", base: "flare", tier: "fifth"
        },
        {
            name: "poly", base: "mono", tier: "second"
        },
        {
            name: "mega", base: "mono", tier: "third"
        },
        {
            name: "quad", base: "mono", tier: "fourth"
        },
        {
            name: "oct", base: "mono", tier: "fifth"
        },
        {
            name: "minke", base: "risso", tier: "second"
        },
        {
            name: "bryde", base: "risso", tier: "third"
        },
        {
            name: "sei", base: "risso", tier: "fourth"
        },
        {
            name: "omura", base: "risso", tier: "fifth"
        },
    ]

    for (let unit of anotherUnits) {
        unitsValues[unit.name] = unitsValues[unit.base] + tierValues[unit.tier];
    }
}