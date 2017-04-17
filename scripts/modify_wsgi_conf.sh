# We want Flask to be mounted at the /api url. Change the wsgi.conf file Elastic Beanstalk includes in the ondeck
# directory.
sed -i 's~WSGIScriptAlias /~WSGIScriptAlias /api~' ../wsgi.conf
sed -i "/WSGIProcessGroup wsgi/a WSGIImportScript /opt/python/current/app/subreddit_algebra_app.wsgi process-group=wsgi application-group=%{GLOBAL}" ../wsgi.conf
