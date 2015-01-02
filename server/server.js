var fs = require('fs');

eval(fs.readFileSync('../shared/DungeonCollapse.js')+'');
eval(fs.readFileSync('DungeonCollapse.Chat.js')+'');
eval(fs.readFileSync('DungeonCollapse.Server.js')+'');

DungeonCollapse.Server.start();