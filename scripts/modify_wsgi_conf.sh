# We want Flask to be mounted at the /api url. Change the ELB default WSGIScriptAlias "/" to "/api"
conf="../wsgi.conf"
# We're using a custom delimeter "~" to avoid having to escape "/"
sed -i 's~WSGIScriptAlias /~WSGIScriptAlias /api~' $conf

# Preload the wsgi script, otherwise it loads on first visit after release, causing timeouts for that user
# If not in wsgi.conf, I get an error trying to accesss the "wsgi" process group.
script="/opt/python/current/app/subreddit_algebra_app.wsgi"
sed -i "/WSGIProcessGroup/a WSGIImportScript $script process-group=wsgi application-group=%{GLOBAL}" $conf
