SELECT subreddit, authors, DENSE_RANK() OVER (ORDER BY authors DESC) AS rank_authors
FROM (SELECT subreddit, SUM(1) as authors
     FROM (SELECT subreddit, author, COUNT(1) as cnt
         FROM [fh-bigquery:reddit_comments.all_starting_201501]
         WHERE author NOT IN (SELECT author FROM [fh-bigquery:reddit_comments.bots_201505])
         GROUP BY subreddit, author HAVING cnt > 0)
     GROUP BY subreddit) t
ORDER BY authors DESC;
