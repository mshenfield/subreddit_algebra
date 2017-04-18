class UnknownSubredditException(Exception):
    """Raised when the user passes in a subreddit that's not in our index"""
    pass
