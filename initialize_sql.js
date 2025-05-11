const { Events } = require('discord.js');
const sql = require("mssql");

const { sqlLogin } = require("./config.json");
const { sqlPassword } = require("./config.json");
const { sqlServer } = require("../config.json");
const { sqlPort } = require("../config.json");

var config = {
	"user": sqlLogin, // Database username
	"password": sqlPassword, // Database password
	"server": sqlServer, // Server IP address
	"database": "discord-messages", // Database name,
	"port": sqlPort,
	"options": {
		"encrypt": true, 
		trustServerCertificate: true
	}
}

try {
	sql.connect(config, err => {
	 if (err) {
		throw err;
	 }});
	 console.log(`Connected to the server!`);
} catch(error) {
	console.error(error);
	console.log(`There was an error connecting to the server!`);
}

try {
	await sql.query`IF NOT EXISTS 
						(SELECT 1 FROM sysobjects WHERE name = 'dbo.Guilds' AND xtype = 'U')
					CREATE TABLE dbo.Guilds(
						id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    					guild_name NVARCHAR(255) NOT NULL,	
					);`;
	await sql.query`IF NOT EXISTS 
						(SELECT 1 FROM sysobjects WHERE name = 'dbo.Users' AND xtype = 'U')
					CREATE TABLE dbo.Users(
						id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
						user_name NVARCHAR(255) NOT NULL,
						display_name NVARCHAR(255) NOT NULL,
					);`;
	await sql.query`IF NOT EXISTS 
						(SELECT 1 FROM sysobjects WHERE name = 'dbo.Messages' AND xtype = 'U')
					CREATE TABLE dbo.Messages(
						id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
						user_id INT NOT NULL,	
					);`;
	await sql.query`IF NOT EXISTS 
						(SELECT 1 FROM sysobjects WHERE name = 'dbo.Memberships' AND xtype = 'U')
					CREATE TABLE dbo.Memberships(
						id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
						guild_name NVARCHAR(255) NOT NULL,	
					);`;
} catch(error) {
	console.error(error);
	console.log(`There was an error creating the tables!`);
}