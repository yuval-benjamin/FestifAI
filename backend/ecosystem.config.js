module.exports = {
  apps : [{
    name   : "festifAI",
    script : "./dist/index.js",
    env_production : {
      NODE_ENV: "production"
    }
  }]
}