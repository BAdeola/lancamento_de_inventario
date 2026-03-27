import sql from "mssql";

const config: sql.config = {
    user: 'seu_usuario',
    password: 'sua_senha',
    server: 'localhost', // ou o IP do servidor
    database: 'SeuBanco',
    options: {
        encrypt: false, // Geralmente false para SQL 2005
        trustServerCertificate: true, 
        instanceName: 'SQLEXPRESS' // Se houver instância
    },
    port: 1433
};

export const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Conectado ao SQL Server 2005!');
        return pool;
    })
    .catch(err => console.log('Erro na conexão: ', err));