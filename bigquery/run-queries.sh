#!/usr/bin/env bash
# Execute the analytics queries in BigQuery and download the results to a file
# Make sure you downloaded the BigQuery command line tools, created a project in BigQuery,
# have enabled billing and created a dataset

# $1 - the PROJECT_ID for your Google Cloud project
# $2 - the DATASET_ID for the dataset you created to house this project.

set -e

[ -z "$1" ] && echo "Missing PROJECT_ID" && exit 1
[ -z "$2" ] && echo "Missing DATASET_ID" && exit 1

# Execute the first query to compute the ranks of all subreddits
SUBREDDIT_ALGEBRA_RANKS_TABLE="$2.subr_rank_all_starting_201501"
echo "Removing $SUBREDDIT_ALGEBRA_RANKS_TABLE"
bq rm -f "$SUBREDDIT_ALGEBRA_RANKS_TABLE"

echo "Recreating $SUBREDDIT_ALGEBRA_RANKS_TABLE - ranks of subreddits by activity"
cat ./01_ranks.sql | \
  bq query --destination_table="$SUBREDDIT_ALGEBRA_RANKS_TABLE"

# Execute the second query which gets overlaps for all subreddits
SUBREDDIT_ALGEBRA_OVERLAPS_TABLE="$2.subr_overlaps_all_starting_201501"
echo "Removing $SUBREDDIT_ALGEBRA_OVERLAPS_TABLE"
bq rm -f "$SUBREDDIT_ALGEBRA_OVERLAPS_TABLE"

echo "Recreating $SUBREDDIT_ALGEBRA_OVERLAPS_TABLE - overlap lists for each subreddit and the 200 most active"
sed "s/PROJECT_ID/$1/g;s/DATASET_ID/$2/g" ./02_compute_overlaps.sql | \
  bq query --destination_table="$SUBREDDIT_ALGEBRA_OVERLAPS_TABLE" --allow_large_results

# Extract the result into a bucket
echo "Extracting the result into a bucket. This could take a while..."
SUBREDDIT_ALGEBRA_OVERLAPS_BUCKET="gs://$1/$2/subr_overlaps_all_starting_201501.csv"
bq extract --destination_format=CSV "$SUBREDDIT_ALGEBRA_OVERLAPS_TABLE" "$SUBREDDIT_ALGEBRA_OVERLAPS_BUCKET"

# Copy the bucket to the this file
echo "Copying down to local file"
gsutil cp "$SUBREDDIT_ALGEBRA_OVERLAPS_BUCKET" "subreddit-algebra-output-$(date +%Y-%m-%d).csv"
