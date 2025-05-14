# Message Analyzer Discord Bot
This is a Discord Bot that will read your messages and return insights! What's the longest message in your server? Who texts the most on the server? What was said on your birthday last year? Find out the answer to all of these questions! 

**Link to project:** [YouTube](https://youtu.be/wtS_HhTXwjk)

![Github link](https://github.com/DanaY326/discord-bot-stats/videos/discord-bot-stats-video-plain.mp4)

## How It's Made:

**Tech used:** JavaScript, Node.js, Discord.js, mssql, Transact-SQL, SQL Server Management Studio

I used Node.js and Discord.js to create the framework of the Discord bot and connect to the Discord API repectively. I created 10 commands in separate nodes in the program. I created an API for the Node.js app to link with an SQL database using the mssql Node.js package. Some of the 10 commands include those to import and delete message history, and ones that take advantage of various other commands that are possible in SQL (fromdate that filters by date, userstats that returns overall data that can be graphed, and lognest and shortest). SQL Server Management Studio was a valuable tool especially when setting up and testing the API to connect to the database from the Node.js app.


## Optimizations

Firstly, using a database made all of the data-related commands a lot faster then getting the message history by hand every time. Secondly, I optimized my SQL queries on multiple occasions, such as by using 'SELECT 1 ...' instead of 'SELECT * ...' to check existence of values. 

## Lessons Learned:

This is the first time I've made my own app from top to bottom. Testing was super important, there were little bug fixes or tweaks that I'd make, and I thought there was *no way* they could affect anything, and  yet when I retested, I would have a new bug to find! Of course, often there'd be no new bugs, but new ones appeared often enough that I'm happy I thoroughly checked all commands once I got to a certain point. I also feel a lot more comfortable with SQL Server, and with Node.js, and JavaScript in general now. 

## Setup Instructions:

1. Ensure that necessary software is installed. These are Node.js, SQL Server 2022 Developer, and SQL Server Management Studio.
2. Pull the source code.
3. Run the SQL scripts under the folder sql_scripts in numerical order. For the second script, which is optional, replace the username with your desired username. After running the second script, enable encryption in SSMS if desired before running the third script.
4. Sign into or create a Discord account and create a bot on the developper portal. Give it the Server Members Intent and the Message Content Intent. Create a config file with the following:  
{  
    "token": "XXXXXXXXX",  
    "clientId": "XXXXXXXXX",  
    "guildId": "XXXXXXXXX",  
    "sqlLogin": "XXXXXXXXX",  
    "sqlPassword": "XXXXXXXXX",  
    "sqlServer": "XXXXXXXXX", //name of the server where your SQL database is hosted  
    "sqlPort": XXXX  
}  
5. Deploy commands by running "node deploy.js", then start the app by running "node index.js".
6. Add your bot to servers by generating an invite link on the developper portal.
7. Use the bot and enjoy!

