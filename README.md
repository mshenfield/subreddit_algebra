# Subreddit Algebra
A frontend to [538's analysis](https://fivethirtyeight.com/features/dissecting-trumps-most-rabid-online-following) of subreddit similarity.


## Installation
Make sure you have [`pipenv`](http://docs.pipenv.org/en/latest/) installed.

`pipenv install`


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

`pipenv run python subreddit_algebra/build_index.py <path_to_table_csv>`

This will automatically run the algorithm and processing steps, and save all required data into the 'output' folder as Pickle objects.

### Doing The Math
You can actually play around with it by import `subreddit_algebra.operators`. You can get a copy of the subreddit_algebra
function with all pickled objects initialized by running

```python
from subreddit_algebra import initialize_subreddit_algebra

calculator = initialize_subreddit_algebra()
calculator("The_Donald", "-", "Politics")
# Nasty hobbitses...
```

The `initialize_subreddit_algebra` call loads the pickled `index` and some other supporting files, so make sure you've run
the `build_index.py` script as described above beforehand.


## Methodology
Five Thirty Eight has some really interesting commentary at the end of [their article](https://fivethirtyeight.com/features/dissecting-trumps-most-rabid-online-following/) on their methodology.

For convenience and personal familiarity, this ports [the R script](https://github.com/fivethirtyeight/data/blob/master/subreddit-algebra/processData.sql) used by 538 to Python. This tweaks the methodology so as to be able to more efficiently query for nearest neighbors using an index. Cosine Similarity is not a metric space. This exploits the (hopefully accurate) fact that for unit vectors, Euclidean distance is correlated with the value of Cosine Similarity.

With this in mind, this normalizes all feature vectors to unit length, and builds a [Ball Tree](http://scikit-learn.org/stable/modules/generated/sklearn.neighbors.BallTree.html#sklearn.neighbors.BallTree) index for efficient K-Nearest-Neighbors querying.


## Roadmap

### Frontend
The frontend will allow a user to perform addition and subtraction on two subreddits. The form will be autocomplete, and appear as

r/_ | | r/_ =

The content will be describable via URL parameters. When all parts are filled out, it will display a visual representation of the operation (e.g. an abstraction of the co-occurence vectors being added) and closesness, similar to the article.
It will list the top 5 closest subreddits, with emphasis on the top result.

If a user has no results for a subreddit, leave space for a note that explains not all subreddits have been analyzed.

Include the last time the results were updated.

### Backend
The backend should include the folowing APIs:

`subreddit_names/completions/<text_start>` - Autocompleting subreddit names - we could use the endpoint here https://www.reddit.com/dev/api#POST_api_search_reddit_names,
but not all possible subreddits are in my database. We can extract a list from the dataset used and create our own simple endpoint that returns the top 10 results. .  There are probably 3MB of subreddit names - too many to load and cache in the browser (50K subreddits * 4 bytes per character * 15 characters) and far more than would be looked at.

`operators/` - a list of operators. I can hardcode this in the response. LOW PRIORITY.

`subreddit_algebra/<operator_name>/<name_one>/<name_two>` - returns the first n closest subreddits as well as the ~angle and magnitutde~ distances each result from the result of the operation.

The `build_index` script should run once a month, and be automated
* use the Big Query API and command line client to execute and store query results
  * Retreive my API key
* Add a cron


## License
[MIT](LICENSE.md)


## Contributing
Contributions  ✍  are welcome
