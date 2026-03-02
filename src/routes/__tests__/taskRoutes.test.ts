import taskRoutes from '../taskRoutes';

describe('taskRoutes', () => {
  it('should be defined', () => {
    expect(taskRoutes).toBeDefined();
  });

  it('should have route stack defined', () => {
    const stack = (taskRoutes as any).stack;
    expect(stack).toBeDefined();
    expect(Array.isArray(stack)).toBe(true);
    expect(stack.length).toBeGreaterThan(0);
  });

  it('should have GET / route for listing tasks', () => {
    const stack = (taskRoutes as any).stack;
    const getRoute = stack.find((layer: any) => layer.route?.methods?.get && layer.route?.path === '/');
    expect(getRoute).toBeDefined();
  });

  it('should have POST / route for creating tasks', () => {
    const stack = (taskRoutes as any).stack;
    const postRoute = stack.find((layer: any) => layer.route?.methods?.post && layer.route?.path === '/');
    expect(postRoute).toBeDefined();
  });

  it('should have GET /stats route for getting task statistics', () => {
    const stack = (taskRoutes as any).stack;
    const statsRoute = stack.find((layer: any) => layer.route?.methods?.get && layer.route?.path === '/stats');
    expect(statsRoute).toBeDefined();
  });

  it('should have PATCH /:taskId/status route for updating task status', () => {
    const stack = (taskRoutes as any).stack;
    const patchRoute = stack.find((layer: any) => layer.route?.methods?.patch && layer.route?.path === '/:taskId/status');
    expect(patchRoute).toBeDefined();
  });

  it('should have mergeParams enabled for nested routing', () => {
    const options = (taskRoutes as any).mergeParams;
    expect(options).toBe(true);
  });
});
