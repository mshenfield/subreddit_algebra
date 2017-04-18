import os

from flask import (
    Flask,
    json,
)
from flask_cors import CORS

from .algebra import (
    initialize_subreddit_algebra,
    initialize_subreddit_names,
)
from .algebra.exceptions import UnknownSubredditException

app = Flask(__name__)

# Enable request from create-react-app in development
if not os.environ.get('IS_SERVER'):
    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

subreddit_calculator = initialize_subreddit_algebra()
subreddit_completions = initialize_subreddit_names()


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
