import { ServerLoader, ServerSettings, GlobalAcceptMimesMiddleware } from '@tsed/common';
import Path from 'path';
import bodyParser from 'body-parser';
import compression from 'compression';
import '@tsed/swagger';

@ServerSettings({
    rootDir: Path.resolve(__dirname),
    acceptMimes: ['application/json'],
    debug: true,
    mount: {
        '/api': '${rootDir}/controllers/**/*.ts'
    },
    swagger: [
        {
          path: '/api-docs'
        }
    ]
})
export class Server extends ServerLoader {

    /**
     * This method let you configure the middleware required by your application to works.
     * @returns {Server}
     */
    public $onMountingMiddlewares(): void | Promise<any> {

        this
            .use(GlobalAcceptMimesMiddleware)
            .use(compression())
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
                extended: true
            }));

        return null;
    }

    public async $onReady() {
        console.log('Server started...');
    }

    public $onServerInitError(err) {
        console.error(err);
    }

    public close() {
        this.httpServer.close();
    }
}

new Server().start();
