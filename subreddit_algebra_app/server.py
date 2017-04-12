import os

from flask import (
    Flask,
    json,
)
from flask_cors import CORS

from .algebra import (
    constants,
    initialize_subreddit_algebra,
    initialize_subreddit_names,
)

app = Flask(__name__)

# Enable request from create-react-app in development
if os.environ.get('DEVELOP'):
    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

subreddit_calculator = initialize_subreddit_algebra()
subreddit_completions = initialize_subreddit_names()


@app.route('/algebra/<subreddit_1>/<operator>/<subreddit_2>')
def algebra(subreddit_1, operator, subreddit_2):
    matches = subreddit_calculator(subreddit_1, operator, subreddit_2)
    return json.jsonify(matches)


@app.route('/completions/<prefix>')
def completions(prefix):
    return json.jsonify(subreddit_completions(prefix))


@app.route('/operators')
def operators():
    return json.jsonify(constants.OPERATORS)