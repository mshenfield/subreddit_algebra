# Subreddit Algebra
A frontend to [538's analysis](https://fivethirtyeight.com/features/dissecting-trumps-most-rabid-online-following) of subreddit similarity.


## Installation

### Backend
Make sure you have [`pipenv`](http://docs.pipenv.org/en/latest/) installed.

`pipenv install`

### Frontend
See the instructions in [the `frontend` README](./frontend/README.md) for how to run the server for the frontend application.

## Running

### Big Query
The [Big Query](https://bigquery.cloud.google.com) code to pull out overlapping subreddits is located in the [bigquery](bigquery) folder. You'll have to
  * create an account
  * create a project
  * add a billing method to the project so you can save large tables (this won't charge you money)
  * add a dataset to hold the data
  * modify the query in processData.sql to use our project and dataset
  * save the output of the second query to a table, and download it as a CSV into the output folder.

### Building The Index
After getting the data from BigQuery, run

`pipenv run python api/subreddit_algebra/build_index.py <path_to_table_csv>`

This will automatically run the algorithm and processing steps, and save all required data into the 'output' folder as Pickle objects.

### Running The Server
You can actually play around with it through the JSON API!

```bash
pipenv shell # shell into the virtual environment
FLASK_APP=api/server.py flask run # start server
# Go to localhost:5000/api/algebra/<subreddit_1>/<operator>/<subreddit_2> to see results
# e.g. localhost:5000/api/algebra/the_donald/minus/politics (nasty hobbitses)
```

Internally the server loads the pickled `index` and some other supporting files, so make sure you've run
the `build_index.py` script as described above beforehand.

### Frontend
See the instructions in [the `frontend` README](./frontend/README.md) for how to run the server for the frontend application.


## Methodology
538 has some really interesting commentary at the end of [their article](https://fivethirtyeight.com/features/dissecting-trumps-most-rabid-online-following/) on their methodology.

For convenience and personal familiarity, this ports [the R script](https://github.com/fivethirtyeight/data/blob/master/subreddit-algebra/processData.sql) used by 538 to Python. This tweaks the methodology so as to be able to more efficiently query for nearest neighbors using an index. Cosine Similarity is not a metric space. This exploits the (hopefully accurate) fact that for unit vectors, Euclidean distance is correlated with the value of Cosine Similarity.

With this in mind, this normalizes all feature vectors to unit length, and builds a [Ball Tree](http://scikit-learn.org/stable/modules/generated/sklearn.neighbors.BallTree.html#sklearn.neighbors.BallTree) index for efficient K-Nearest-Neighbors querying.

## API
`/operators` - returns a list of valid operators

`/algebra/<subreddit_1>/<operator/<subreddit_2>` - return the closest five subreddits to result of adding or subtracting `subreddit_1` and `subreddit_2`

`/completions/<prefix>` - return first 10 subreddit names that start with `prefix`

## Roadmap

### Frontend
The frontend will allow a user to perform addition and subtraction on two subreddits. The form will be autocomplete, and appear as

r/_ | | r/_ =

The content will be describable via URL parameters. When all parts are filled out, it will display a visual representation of the operation (e.g. an abstraction of the co-occurence vectors being added) and closesness, similar to the article.
It will list the top 5 closest subreddits, with emphasis on the top result.

If a user has no results for a subreddit, leave space for a note that explains not all subreddits have been analyzed.

Include the last time the results were updated.

A swap function might be nice, for the minus operator

### Backend
The `build_index` script should run once a month, and be automated
* use the Big Query API and command line client to execute and store query results
  * Retreive my API key
* Add a cron

TLD subreddit.plus

## License
[MIT](LICENSE.md)


## Contributing
Contributions  ✍  are welcome
