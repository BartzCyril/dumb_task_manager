const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    redirectionLimit: 50,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
