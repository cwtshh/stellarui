module.exports = {
    apps: [
      {
        name: "api",            // Nome do processo
        script: "app.js",    // Arquivo principal da sua API
        instances: "max",       // Usa todas as CPUs disponíveis (ideal para maximizar performance)
        exec_mode: "cluster",   // Modo de cluster para escalabilidade
        env: {
          NODE_ENV: "production",
        },
      },
    ],
  };
  