# Creating list of number of users who authored at least 10 posts in pairs of subreddits:
SELECT t1.subreddit, t2.subreddit, SUM(1) as NumOverlaps
FROM (SELECT subreddit, author, COUNT(1) as cnt
     FROM [fh-bigquery:reddit_comments.all_starting_201501]
     WHERE author NOT IN (SELECT author FROM [fh-bigquery:reddit_comments.bots_201505])
     AND subreddit IN (SELECT subreddit FROM [PROJECT_ID:DATASET_ID.subr_rank_all_starting_201501]
       WHERE rank_authors>200 AND rank_authors<2201)
     GROUP BY subreddit, author HAVING cnt > 10) t1
JOIN (SELECT subreddit, author, COUNT(1) as cnt
     FROM [fh-bigquery:reddit_comments.all_starting_201501]
     WHERE author NOT IN (SELECT author FROM [fh-bigquery:reddit_comments.bots_201505])
     GROUP BY subreddit, author HAVING cnt > 10) t2
ON t1.author=t2.author
WHERE t1.subreddit!=t2.subreddit
GROUP BY t1.subreddit, t2.subreddit
