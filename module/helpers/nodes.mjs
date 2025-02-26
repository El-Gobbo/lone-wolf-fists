export const LWFNODES = {}
LWFNODES.nodeType = [
    {
        "name": "Food",
        "multiply": 5
    },
    {
        "name": "Ammo/Air",
        "multiply": 1
    },
    {
        "name": "Fuel/Fire",
        "multiply": 1
    },
    {
        "name": "Metal",
        "multiply": 1
    },
    {
        "name": "Wood",
        "multiply": 1
    },
    {
        "name": "Water",
        "multiply": 1
    },
    {
        "name": "Earth",
        "multiply": 1
    },
    {
        "name": "Mystical",
        "multiply": '0.01'
    },
    {
        "name": "Wealth",
        "multiply": '0.02'
    },
    {
        "name": "Market",
        "multiply": 1
    }
];

LWFNODES.richness = [
    {
        "name": "Poor",
        "multiply": '0.5'
    },
    {
        "name": "Standard",
        "multiply": 1
    },
    {
        "name": "Rich",
        "multiply": 2
    }
];

// {number base production multiplied by, goods produced in 1:1 worker to product ratio, goods produced in 10:1 worker to product ratio}
LWFNODES.developmentLevel = [
    {
        "name": "None"
    },
    {
        "name": "Pre-industrial"
    },
    {
        "name": "Industrial"
    }
];

LWFNODES.developmentProduct = [
    {
        "name": "Basic",
        "None": 1,
        "Pre-industrial": 3,
        "Industrial": 10
    },
    {
        "name": "Enlightenment",
        "None": 0,
        "Pre-industrial": 1,
        "Industrial": 3
    },
    {
        "name": "Industrial",
        "None": 0,
        "Pre-industrial": '0.1',
        "Industrial": 1
    },
    {
        "name": "Silicon",
        "None": 0,
        "Pre-industrial": 0,
        "Industrial": '0.1'
    },
    {
        "name": "Power",
        "None": 0,
        "Pre-industrial": 5,
        "Industrial": 10
    }
]