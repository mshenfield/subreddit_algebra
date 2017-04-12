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
`/operators` - returns a list of valid operators

`/algebra/<subreddit_1>/<operator/<subreddit_2>` - return the closest five subreddits to result of adding or subtracting `subreddit_1` and `subreddit_2`

`/completions/<prefix>` - return first 10 subreddit names that start with `prefix`

## Deployment
This project is configured to deploy to AWS Elastic Beanstalk using the [eb command line tool](http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3.html).

You can use normal commands (`eb create`, `eb deploy`), but some special handling is required to push up the pickled models you've built up locally.

```bash
# This assumes you've run the steps in Installation > Backend
mkdir new_data
cp output/* new_data
git add new_data
eb deploy --staged # or eb create --staged
```

[.ebextensions](.ebextensions/00_main.config) has some special handling that detects the presence of a `new_data` folder in the deployed build, and moves the pickled files into a central location on the server where they are read by the Flask app.

This avoids commiting large binary files, and pushing up data each time (which takes much longer). To cleanup, `git reset HEAD new_data && rm -r -f new_data`.

## Roadmap

### Frontend
* Automplete subreddit names.
* Notification bar on errors.
* Form validation if subreddit is unknown, invalid operator.
* Routing via URL parameters (means duplicating the server side functionality w/ Flask).
* Small bite-sized graphs might make nice extra content
* If a user has no results for a subreddit, leave space for a note that explains not all subreddits have been analyzed.
* Include the last time the backing data was updated in the bottom right
* A "similar to" tab, instead of operators
* A swap function might be nice, for the minus operator
* Only show the first result, with an "= r/_", with a "Show More" that fades in results below it.
* Link each result to the subreddit.
* A shimmer across the results box and then a loading bar. Notifications if it takes more than 30 seconds.
* "Help cover the cost of running this dumb site" link with accurate (verifiable?) information on site costs and a patreon account.
* "Join the community of people who think this dumb site is cool"

### Backend
* Set up HTTPS
* Add a second server
  * Set up rolling platform updates
  * Set up rolling deploys
* Enable logging in AWS and log rotation
* Set up Cloudfare or Cloudfront to deliver static assets more effectively.
* Script to build index and deploy to AWS
* redirect *.subreddit-algebra.science -> subreddit-algebra.science
* Maybe: deploy Node+Rust. Re-write server as an Express application so I can take advantage of server-side rendering.  Re-write machine learning portion in Rust for performance and adventure!

## License
[MIT](LICENSE.md)

## Contributing
Contributions  ✍  are welcome
