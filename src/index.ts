import server from './server';

import logger from './util/logger';

const port = process.env.PORT || 8080;
server.listen(port, () => logger.info('Server running at port', port));
