// elements.js

const elements = {
    sand: {
        color: 'yellow',
        flow: true, // Sand falls down
        liquid: false, // Sand is not a liquid, so it doesn't flow sideways
        density: 1
    },
    water: {
        color: 'blue',
        flow: true, // Water flows down and sideways
        liquid: true,
        density: 0.5
    },
    fire: {
        color: 'red',
        flow: true, // Fire spreads
        liquid: false, // Fire is not a liquid
        spread: true, // Fire will spread to nearby cells
        lifespan: 30 // Fire will disappear after 30 updates
    }
};
