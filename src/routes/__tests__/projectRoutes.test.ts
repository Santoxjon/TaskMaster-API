import projectRoutes from '../projectRoutes';

describe('projectRoutes', () => {
  it('should be defined', () => {
    expect(projectRoutes).toBeDefined();
  });

  it('should have route stack defined', () => {
    const stack = (projectRoutes as any).stack;
    expect(stack).toBeDefined();
    expect(Array.isArray(stack)).toBe(true);
    expect(stack.length).toBeGreaterThan(0);
  });

  it('should have GET / route for listing projects', () => {
    const stack = (projectRoutes as any).stack;
    const getRoute = stack.find((layer: any) => layer.route?.methods?.get && layer.route?.path === '/');
    expect(getRoute).toBeDefined();
  });

  it('should have POST / route for creating projects', () => {
    const stack = (projectRoutes as any).stack;
    const postRoute = stack.find((layer: any) => layer.route?.methods?.post && layer.route?.path === '/');
    expect(postRoute).toBeDefined();
  });

  it('should have GET /:projectId route for getting a project', () => {
    const stack = (projectRoutes as any).stack;
    const getRoute = stack.find((layer: any) => layer.route?.methods?.get && layer.route?.path === '/:projectId');
    expect(getRoute).toBeDefined();
  });

  it('should have PUT /:projectId route for updating a project', () => {
    const stack = (projectRoutes as any).stack;
    const putRoute = stack.find((layer: any) => layer.route?.methods?.put && layer.route?.path === '/:projectId');
    expect(putRoute).toBeDefined();
  });

  it('should have DELETE /:projectId route for deleting a project', () => {
    const stack = (projectRoutes as any).stack;
    const deleteRoute = stack.find((layer: any) => layer.route?.methods?.delete && layer.route?.path === '/:projectId');
    expect(deleteRoute).toBeDefined();
  });

  it('should have nested task routes', () => {
    const stack = (projectRoutes as any).stack;
    // Check that there's at least one middleware layer (the task routes)
    const middlewareLayers = stack.filter((layer: any) => !layer.route);
    expect(middlewareLayers.length).toBeGreaterThan(0);
  });
});
