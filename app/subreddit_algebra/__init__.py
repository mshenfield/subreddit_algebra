import numpy as np
import pickle
from sklearn.preprocessing import normalize

# Relative import
from . import constants


def initialize_subreddit_algebra(df=None, pmi_arr=None, index=None):
    """Loads or accepts objects needed for subreddit algebra and returns need functions with a closure over them"""
    if df is None:
        with open(constants.DF_FILE, 'rb') as f:
            df = pickle.load(f)

    if pmi_arr is None:
        with open(constants.PMI_FILE, 'rb') as f:
            pmi_arr = pickle.load(f)

    if index is None:
        with open(constants.INDEX_FILE, 'rb') as f:
            index = pickle.load(f)

    def _overlaps_for_name(name):
        try:
            ix = df.index.get_loc(name.lower())
        except KeyError:
            raise ValueError('Unknown subreddit name {}'.format(name))

        # Return PMI overlaps instead of normal df ones
        return pmi_arr[ix]

    def subreddit_algebra(name_1, op, name_2, limit=5):
        """Apply the operator (plus/minus) to the vectors in t2_overlaps for each subreddit_name

        Return the subreddit_names of the limit closest subreddits to the result.
        """
        if op not in constants.OPERATORS:
            raise ValueError('Invalid operator {}'.format(op))

        overlaps_1, overlaps_2 = _overlaps_for_name(name_1), _overlaps_for_name(name_2)

        if op == constants.PLUS:
            calculated = overlaps_1 + overlaps_2
        elif op == constants.MINUS:
            calculated = overlaps_1 - overlaps_2

        # In-place l2 normalization so our query is also unit norm
        normalize([calculated], copy=False)

        # Search, look for two extra in case it includes either of the original results
        distances, ixs = index.query([calculated], k=limit + 2)
        names = df.iloc[ixs[0]].index.values
        # TODO: Filter distances and names so we can return distances
        names = np.array([name for name in names if name not in [name_1.lower(), name_2.lower()]])[:limit]

        return names.tolist()

    return subreddit_algebra


def initialize_subreddit_names(names=None):
    if names is None:
        with open(constants.NAMES_FILE, 'rb') as f:
            names = pickle.load(f)

    def completions(prefix, limit=10):
        """Returns the limit names that start with the given prefix

        XXX: How are prefixes ordered?
        """
        # Names that start with the prefix
        starts_with = names.keys(prefix)

        return starts_with[:limit]

    return completions
