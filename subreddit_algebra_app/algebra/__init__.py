import pickle
from sklearn.preprocessing import normalize

# Relative import
from . import constants
from .build_index import data_filepath


def initialize_subreddit_algebra(names_to_indexes=None, ordered_names=None, pmi_arr=None, index=None):
    """Loads or accepts objects needed for subreddit algebra and returns need functions with a closure over them"""
    if pmi_arr is None:
        with open(data_filepath(constants.PMI_FILE), 'rb') as f:
            pmi_arr = pickle.load(f)

    if index is None:
        with open(data_filepath(constants.INDEX_FILE), 'rb') as f:
            index = pickle.load(f)

    if names_to_indexes is None:
        with open(data_filepath(constants.NAMES_TO_INDEXES_FILE), 'rb') as f:
            names_to_indexes = pickle.load(f)

    if ordered_names is None:
        with open(data_filepath(constants.ORDERED_NAMES_FILE), 'rb') as f:
            ordered_names = pickle.load(f)

    def _overlaps_for_name(name):
        try:
            ix = names_to_indexes[name.lower()]
        except KeyError:
            raise ValueError('Unknown subreddit name {}'.format(name))

        # Return the normalized values for math operations
        return pmi_arr[ix]

    def subreddit_algebra(name_1, op, name_2, limit=5):
        """Apply the operator (plus/minus) to the vectors in t2_overlaps for each subreddit_name

        Return the subreddit_names of the limit closest subreddits to the result.
        """
        if op not in constants.OPERATORS:
            raise ValueError('Invalid operator {}'.format(op))

        inputs = (name_1.lower(), name_2.lower())
        overlaps_1, overlaps_2 = (_overlaps_for_name(name) for name in inputs)

        if op == constants.PLUS:
            calculated = overlaps_1 + overlaps_2
        elif op == constants.MINUS:
            calculated = overlaps_1 - overlaps_2

        # In-place l2 normalization so our query is also unit norm
        normalize([calculated], copy=False)

        # Search, look for two extra in case it includes either of the original results
        distances, ixs = index.query([calculated], k=limit + len(inputs))
        names = (ordered_names[ix] for ix in ixs[0])

        # Return closest 5 that aren't inputs
        names = [n for n in names if n not in inputs][:limit]

        # TODO: Coordinate names with distances returned distances
        # e.g. (ordered_names, distances[i]) for i, ix in enumerate(ixs)
        return names

    return subreddit_algebra


def initialize_subreddit_names(names=None):
    if names is None:
        with open(data_filepath(constants.NAMES_TRIE_FILE), 'rb') as f:
            names = pickle.load(f)

    def completions(prefix, limit=10):
        """Returns the limit names that start with the given prefix

        XXX: How are prefixes ordered?
        """
        # Names that start with the prefix
        starts_with = names.keys(prefix)

        return starts_with[:limit]

    return completions
