"""
Import the Flask WSGI `app` as application so it can be discovered by mod_wsgi

http://flask.pocoo.org/docs/0.12/deploying/mod_wsgi/
"""
from subreddit_algebra_app.server import app as application  # noqa
