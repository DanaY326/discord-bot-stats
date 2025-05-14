# Message Analyzer Discord Bot
This is a Discord Bot that will read your messages and return insights! What's the longest message in your server? Who texts the most on the server? What was said on your birthday last year? Find out the answer to all of these questions! 

**Links to project video:**  
[YouTube](https://youtu.be/wtS_HhTXwjk) or [Github](https://github.com/DanaY326/discord-bot-stats/blob/main/videos/discord-bot-stats-video-plain.mp4)

## How It's Made:

**Tech used:** JavaScript, Node.js, Discord.js, mssql, Transact-SQL, SQL Server Management Studio

I used Node.js as the framework. Discord.js was used to connect to the Discord API to retrieve over 5 data points, such as server names, members, and message dates, authors and content. The API was also used to interact with the user, through receiving commands and outputting information in the Discord interface. Several specific features of the API were used, such as returning Ephemereal error messages that could only be seen by the calling user and that could be easily deleted, taking options for commands, and implementing a cooldown. I also created an API for the Node.js app to link with an SQL database using the mssql Node.js package. SQL Server Management Studio was a valuable tool especially when setting up and testing the API to connect to the database from the Node.js app.  
I developed 10 separate commands. These include:
* import, which connects to the Discord API to retrieve all necessary data related to the server, including name, members and message history, and "uploads" the data to the SQL Server
* userstats, which ranks the contributers in a server through percentage of messages sent through SELECT queries on both the Users and Messages tables
* fromdate, which filters the messages to return messages from only a specific date (fun for birthdays etc.) after converting the timestamp returned by the Discord API to a SQL-friendly date format
* longest and shortest, which find the longest and shortest messages in a server
* deletedata, which deletes all data related to a specific guild fromt he SQL Server


## Optimizations

Firstly, using a database made all of the data-related commands a lot faster then getting the message history by hand every time. Secondly, I optimized my SQL queries on various occasions, such as by using 'SELECT 1 ...' instead of 'SELECT * ...' to check existence of values. 

## Lessons Learned:

Firstly, I learned the importance of testing your code in various situations, and of always doing a regression test. I also learned how to use a config file, how to work with timestamps and how to work with JavaScript objects. While some of these are niche, I overall just learned a lot about problem solving. I learned how to narrow down problems when debugging, and also when to completely rethink my approach if a feature wasn't working.

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

