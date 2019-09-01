const Logger = require('./logger')
const dbLogger = Logger('DB');
dbLogger.verbose("tt");
const frontLogger = Logger('fb');
frontLogger.info("front info")