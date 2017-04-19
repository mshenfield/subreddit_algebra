def prefix_proxy(app, prefix):
    """Prefix all routes with a string

    Example:
    prefix_proxy(app, '/api')

    # will respond to '/api/hello/world' and 404 on '/hello/world'
    @app.route('/hello/world'):
    def hello():
        return 'Hello world'
    """
    original_route = app.route

    def prefixed_route(*args, **kwargs):
        route = '{}{}'.format(prefix, args[0])
        args = (route,) + args[1:]
        return original_route(*args, **kwargs)

    app.route = prefixed_route
