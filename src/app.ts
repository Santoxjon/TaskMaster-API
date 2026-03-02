import express, { Request, Response } from 'express';
import projectRoutes from './routes/projectRoutes';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

const app = express();
app.use(express.json());

// Prefix all routes with /api/v1
app.use('/api/v1/projects', projectRoutes);

// Swagger docs endpoint under /api/v1/docs
const swaggerDocument = YAML.load('./openapi.yml');
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Redirect root to /api/v1/docs
app.get('/', (req: Request, res: Response) => {
  res.redirect('/api/v1/docs');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`TaskMaster API running on port http://localhost:${PORT}`);
  console.log(`API documentation available at http://localhost:${PORT}/api/v1/docs`);
});
