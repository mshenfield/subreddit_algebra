# Subreddit Algebra
A frontend to [538's analysis](https://fivethirtyeight.com/features/dissecting-trumps-most-rabid-online-following) of subreddit similarity.

## Methodology
538 has some really interesting commentary at the end of [their article](https://fivethirtyeight.com/features/dissecting-trumps-most-rabid-online-following/) on their methodology.

For convenience and personal familiarity, this ports [the R script](https://github.com/fivethirtyeight/data/blob/master/subreddit-algebra/processData.sql) used by 538 to Python. This tweaks the methodology so as to be able to more efficiently query for nearest neighbors using an index. Cosine Similarity is not a metric space. This exploits the (hopefully accurate) fact that for unit vectors, Euclidean distance is correlated with the value of Cosine Similarity.

With this in mind, this normalizes all feature vectors to unit length, and builds a [Ball Tree](http://scikit-learn.org/stable/modules/generated/sklearn.neighbors.BallTree.html#sklearn.neighbors.BallTree) index for efficient K-Nearest-Neighbors querying.

## Installation
This requires running two development servers, one for the `Flask` based API which integrates with our pickled sklearn models, and another for the `create-react-app` based frontend.

### Frontend
Make sure you have [`nodejs`](https://github.com/creationix/nvm/) installed.

```bash
cd frontend
npm install # or yarn install
cd frontend
npm start # or yarn start
# you should be automatically sent to localhost:5000 in the browser.
```


### Backend
Building the models is still a manual process of executing SQL code, downloading the results, and using a python script to massage, index, and pickle the results.

Make sure you have [`pipenv`](http://docs.pipenv.org/en/latest/) installed and run `pipenv install`

**Query**

This uses the [processData.sql](bigquery/processData.sql) BigQuery script. This requires creating a table from a query, which unfortunately requires creating an account.

1. Create a "project"
2. Add a billing method to the project so you can save large results as tables (this won't charge you money)
3. Add a "dataset" to the project that will namespace the results (we can't save a table in the GUI without it)
4. Modify the query in processData.sql to use the project and dataset you created in steps 1 and 3.
5. Run both queries and save the output of the second query to a table, and export it as a CSV.

**Index**

With your query results on disk

```bash
mkdir output
pipenv run python subreddit_algebra_app/algebra/build_index.py <path_to_table_csv>
```

This will automatically run the algorithm and processing steps, and save all required data into the `output`. folder at the root of the project.

Now you can see it in action!
```bash
FLASK_APP=subreddit_algebra_app/server.py flask run
curl http://localhost:5000/algebra/highqualitygifs/-/reactiongifs
```

## API
`/algebra/<subreddit_1>/<operator/<subreddit_2>` - return the closest five subreddits to result of adding or subtracting `subreddit_1` and `subreddit_2`

`/completions/<prefix>` - return first 10 subreddit names that start with `prefix`

## Deployment
This project is configured to deploy to AWS Elastic Beanstalk using the [eb command line tool](http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3.html).

You'll have to customize just a little - change the `S3_DATA_BUCKET` variable in [.ebextensions/00_main.config](.ebextensions/00_main.config) to the S3 bucket associated with your ELB setup. Make sure you upload your pickled to the bucket or your app won't run.

You'll also want to set the REACT_APP_GA_TRACKING_CODE environment variable in your ELB production environment.

```bash
eb setenv REACT_APP_GA_TRACKING_CODE=XXXXXXXXXX # Replace with your GA tracking code
```

You can then just use the normal commands (`eb create`, `eb deploy`).

## License
[MIT](LICENSE.md)

## Contributing
Contributions  ✍  are welcome
