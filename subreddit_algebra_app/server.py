import os

from flask import (
    Flask,
    json,
)
from .algebra import (
    initialize_subreddit_algebra,
    initialize_subreddit_names,
)
from .algebra.exceptions import UnknownSubredditException
from .proxy import prefix_proxy

app = Flask(__name__)

subreddit_calculator = initialize_subreddit_algebra()
subreddit_completions = initialize_subreddit_names()

# Imitate the production build, where the root is mounted by Apache at /api
if not os.environ.get('IS_SERVER', False):
    prefix_proxy(app, '/api')


@app.route('/algebra/<subreddit_1>/<operator>/<subreddit_2>')
def algebra(subreddit_1, operator, subreddit_2):
    try:
        matches = subreddit_calculator(subreddit_1, operator, subreddit_2)
    except UnknownSubredditException:
        return json.jsonify({"error": "UNKNOWN_SUBREDDIT"})
    return json.jsonify(matches)


@app.route('/completions/', defaults={'prefix': None})
@app.route('/completions/<prefix>')
def completions(prefix):
    if prefix is None:
        matches = []
    else:
        matches = subreddit_completions(prefix.lower())
    return json.jsonify(matches)
