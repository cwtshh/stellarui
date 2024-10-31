module.exports = {
    apps: [
      {
        name: "stellar-api",     // Nome da aplicação
        script: "dist/app.js", // Caminho para o arquivo de entrada da aplicação (ajuste conforme necessário)
        instances: "max",     // Número de instâncias; "max" usa o número máximo de núcleos
        exec_mode: "cluster", // Modo de execução "cluster" para balanceamento de carga
        env: {
          NODE_ENV: "production",
          PORT: process.env.PORT || 3001 // Porta que virá do .env
        }
      }
    ]
  };
  