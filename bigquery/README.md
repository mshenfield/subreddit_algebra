# BigQuery
Execute the SQL queries that create the dataset used to build our models, downloading the results.

[Create a Cloud Platform project with billing enabled](https://cloud.google.com/bigquery/quickstart-web-ui#before-you-begin). You won't be charged but it is required to save large query results. [Download the Google Cloud SDK](https://cloud.google.com/sdk/docs/) and follow the prompts to add the project you created. After you are done, use the web interface or the `bq mk` command to create a dataset.

Running:

```bash
./run_queries.sh PROJECT_ID DATASET_ID
```

will execute the queries, creating necessary tables, and saving the file to the working directory as subreddit-algebra-output-%Y-%m-%d.csv.

## Thanks
These queries were copied from [FiveThirtyEight's public data repository](https://github.com/fivethirtyeight/data/blob/master/subreddit-algebra/processData.sql)
