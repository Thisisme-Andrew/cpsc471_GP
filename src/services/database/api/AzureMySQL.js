import mysql from "mysql2";
import { HOST_ADDRESS, USER, PASSWORD, DATABASE_NAME, PORT, SSL } from '../Constants.js'

var config = {
    host: HOST_ADDRESS,
    user: USER,
    password: PASSWORD,
    database: DATABASE_NAME,
    port: PORT,
    ssl: SSL
};

const conn = new mysql.createConnection(config);

conn.connect(
    function (err) {
    if (err) {
        console.log("!!! Cannot connect !!! Error:");
        throw err;
    }
    else
    {
        console.log("Connection established.");
        // createTable("test", {"id": "serial", "name" : "VARCHAR(50)", "quantity": "INTEGER"})
        // insertRow("test", {"id": 5, "name" : "its me", "quantity": 10});
        // insertRow("test", {"name" : "its me", "quantity": 10});
        // updateRow("test", "quantity", "15", "id", "1");
    }
});

// columnsAndTypes should be stored as an object, where key is the column name and value is the type. The first pair should be the primary key
const createTable = async (tableName, columnsAndTypes) => {
    try {
        deleteTable(tableName);
    }catch (e) {
        console.log(e);
        return;
    }

    let iterator = 0;
    let queryString = "CREATE TABLE ";
    queryString = queryString.concat(tableName, " (");

    for (const columnName in columnsAndTypes) {
        const columnType = columnsAndTypes[key];

        if(iterator == 0) {
            queryString = queryString.concat(columnName, " ", columnType , " PRIMARY KEY, ");
        }else if(iterator == Object.keys(columnsAndTypes).length - 1) {
            queryString = queryString.concat(columnName, " ", columnType);
            break;
        }else {
            queryString = queryString.concat(columnName, " ", columnType ,", ");
        }
        iterator++;
    }
    queryString = queryString.concat(");");

    conn.query(queryString,
        function (err, results, fields) {
            if (err) throw err;
            console.log('Created inventory table.');
        }
    )

    endQuery();
}

const deleteTable = (tableName) => {
    conn.query("DROP TABLE IF EXISTS " + tableName + ";",
        function (err, results, fields) {
            if (err) throw err;
            console.log("Dropped " + tableName + " table if existed.");
        }
    )
}

// columnsAndValues is object where key = column name, value = row value
const insertRow = (tableName, columnsAndValues) => {
    let iterator = 0;
    let queryString = "INSERT INTO ";
    let valuesToBeAdded = [];
    queryString = queryString.concat(tableName, " (");

    for (const columnName in columnsAndValues) {
        let columnValue = columnsAndValues[columnName];
        valuesToBeAdded.push(columnValue);

        if(iterator == Object.keys(columnsAndValues).length - 1) {
            queryString = queryString.concat(columnName, ") VALUES (?,?);");
            break;
        }else {
            queryString = queryString.concat(columnName, ", ");    
        }

        iterator++;
    }

    conn.query(queryString, valuesToBeAdded,
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        }
    )

    endQuery();
}

//Values must be passed in as strings
const updateRow = (tableName, columnName, value, primaryKeyName, primaryKeyValue) => {
    let queryString = "UPDATE ";
    queryString = queryString.concat(tableName, " SET ", columnName, " = '", value, "' WHERE ", primaryKeyName, " = '", primaryKeyValue, "';");
    
    conn.query(queryString, 
        function (err, result) {
            if (err) throw err;
            console.log(result.affectedRows + " record(s) updated");
        }
    );

    endQuery();
}

const endQuery = () => {
    conn.end(function (err) {
        if (err) throw err;
        else  console.log('Done.')
    });
}

function dataBaseTest()
{
    conn.query('DROP TABLE IF EXISTS inventory;',
        function (err, results, fields) {
            if (err) throw err;
            console.log('Dropped inventory table if existed.');
        }
    )
    conn.query('CREATE TABLE inventory (id serial PRIMARY KEY, name VARCHAR(50), quantity INTEGER);',
        function (err, results, fields) {
            if (err) throw err;
            console.log('Created inventory table.');
        }
    )
    conn.query('INSERT INTO inventory (name, quantity) VALUES (?, ?);', ['banana', 150],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        }
    )
    conn.query('INSERT INTO inventory (name, quantity) VALUES (?, ?);', ['orange', 250],
        function (err, results, fields) {
            if (err) throw err;
            console.log('Inserted ' + results.affectedRows + ' row(s).');
        }
    )
    conn.query('INSERT INTO inventory (name, quantity) VALUES (?, ?);', ['apple', 100],
        function (err, results, fields) {
            if (err) throw err;
            console.log('Inserted ' + results.affectedRows + ' row(s).');
        }
    )
    conn.end(function (err) {
        if (err) throw err;
        else  console.log('Done.')
    });
};