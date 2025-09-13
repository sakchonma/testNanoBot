import express from 'express';
import serverless from 'serverless-http';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import routes from '../routes/index.js';

const app = express();

// Middleware
app.use(express.json());

// Swagger setup
const swaggerFilePath = path.resolve('./swagger.yaml');
const swaggerDocument = YAML.load(swaggerFilePath);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API Routes
app.use('/api', routes);

// Export as serverless function
export default serverless(app);
